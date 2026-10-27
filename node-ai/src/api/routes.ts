import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import type { IncidentAnalyzer } from "../rag/analyzer.js";

const requestSchema = z.object({
  incidentId: z.string().uuid().optional(),
  serviceName: z.string().min(1).max(120),
  description: z.string().min(10).max(10000),
  logs: z.array(z.string().max(20000)).max(20).default([]),
  persistToIncidentService: z.boolean().default(false),
});

export function createRouter(analyzer: IncidentAnalyzer): Router {
  const router = Router();

  router.get("/health", (_request, response) => response.json({ status: "ok", service: "opspilot-node-ai" }));

  router.post("/v1/analyze", async (request, response) => {
    const parsed = requestSchema.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ error: parsed.error.flatten() });
    try {
      const analysis = await analyzer.analyze(parsed.data);
      if (parsed.data.persistToIncidentService && parsed.data.incidentId && !analysis.abstained) {
        await fetch(`${env.javaServiceUrl}/api/v1/incidents/${parsed.data.incidentId}/analysis`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ summary: analysis.summary, confidence: analysis.confidence, analysisId: analysis.analysisId }),
        });
      }
      return response.json(analysis);
    } catch (error) {
      return response.status(502).json({ error: "AI analysis failed" });
    }
  });

  return router;
}
