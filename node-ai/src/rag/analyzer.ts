import { randomUUID } from "node:crypto";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.js";
import type { Analysis, Citation } from "../shared/types.js";
import { LexicalRetriever } from "./lexicalRetriever.js";

const prompt = PromptTemplate.fromTemplate(`You are an incident-response assistant. Use only the evidence below.
Return a concise incident analysis with probable cause and numbered recommended actions.
Every factual claim must use [source] citations. If evidence is insufficient, say INSUFFICIENT_EVIDENCE.

INCIDENT:
{incident}

EVIDENCE:
{evidence}`);

export class IncidentAnalyzer {
  private readonly retriever: LexicalRetriever;

  constructor(private readonly documents: Document<Record<string, string>>[]) {
    this.retriever = new LexicalRetriever(documents);
  }

  async analyze(input: { incidentId?: string; serviceName: string; description: string; logs: string[] }): Promise<Analysis> {
    const started = performance.now();
    const incident = `${input.serviceName}\n${input.description}\n${input.logs.join("\n")}`;
    const retrieved = this.retriever.search(incident, 5);
    const citations: Citation[] = retrieved.map(({ document, score }) => ({
      source: String(document.metadata.source ?? "unknown"),
      quote: document.pageContent.slice(0, 500),
      score,
    }));
    const evidence = retrieved.map(({ document }) => `[${document.metadata.source}]\n${document.pageContent}`).join("\n\n");
    const first = retrieved[0];
    const firstScore = first?.score ?? 0;
    const firstSource = String(first?.document.metadata.source ?? "unknown");
    const hasEvidence = firstScore >= 0.12;
    let summary: string;
    let probableCauses: string[];
    let recommendedActions: string[];
    let confidence: number;
    let model = "local-grounded-fallback";
    let provider = "deterministic";

    if (!hasEvidence) {
      summary = "Insufficient evidence in the indexed runbooks and incident history.";
      probableCauses = [];
      recommendedActions = ["Collect service logs, deployment history, and a recent timeline before diagnosing the incident."];
      confidence = 0.05;
    } else if (env.openAiKey) {
      const chain = RunnableSequence.from([
        prompt,
        new ChatOpenAI({ apiKey: env.openAiKey, model: env.openAiModel, temperature: 0 }),
        new StringOutputParser(),
      ]);
      summary = await chain.invoke({ incident, evidence });
      probableCauses = ["See the cited analysis and verify the proposed cause against live telemetry."];
      recommendedActions = ["Review the cited runbook steps with the incident commander before execution."];
      confidence = Math.min(0.95, 0.45 + firstScore * 0.5);
      model = env.openAiModel;
      provider = "openai-compatible";
    } else {
      summary = `The strongest available evidence is in ${firstSource}. Review the cited runbook and compare its signals with the incident timeline.`;
      probableCauses = [`Evidence overlap suggests the ${input.serviceName} failure may match the documented failure pattern.`];
      recommendedActions = [
        "Check the service metrics and deployment timeline against the cited evidence.",
        "Have the incident commander approve any rollback or configuration change.",
        "Record the confirmed cause and outcome in the incident timeline.",
      ];
      confidence = Math.min(0.8, 0.35 + firstScore * 0.55);
    }

    return {
      analysisId: randomUUID(),
      incidentId: input.incidentId,
      summary,
      probableCauses,
      recommendedActions,
      confidence,
      citations,
      abstained: !hasEvidence,
      model,
      trace: { retrievedDocuments: retrieved.length, provider, latencyMs: Math.round(performance.now() - started) },
    };
  }
}
