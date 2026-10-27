import test from "node:test";
import assert from "node:assert/strict";
import { Document } from "@langchain/core/documents";
import { IncidentAnalyzer } from "../src/rag/analyzer.js";

test("fallback analysis is grounded and auditable", async () => {
  const analyzer = new IncidentAnalyzer([
    new Document({ pageContent: "Restart the worker only after checking queue depth and error rate.", metadata: { source: "worker-runbook.md" } }),
  ]);
  const analysis = await analyzer.analyze({ serviceName: "worker", description: "Queue depth and error rate increased", logs: [] });
  assert.equal(analysis.abstained, false);
  assert.equal(analysis.citations[0]?.source, "worker-runbook.md");
  assert.ok(analysis.recommendedActions.length > 0);
});
