import express from "express";
import helmet from "helmet";
import pino from "pino";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.js";
import { loadKnowledge } from "./documents/knowledge.js";
import { IncidentAnalyzer } from "./rag/analyzer.js";
import { createRouter } from "./api/routes.js";

const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const currentDirectory = resolve(fileURLToPath(new URL(".", import.meta.url)));
const knowledgeDirectory = resolve(currentDirectory, env.knowledgePath);
const documents = await loadKnowledge(knowledgeDirectory);
const analyzer = new IncidentAnalyzer(documents);
app.use("/", createRouter(analyzer));

app.listen(env.port, () => logger.info({ port: env.port, documents: documents.length }, "OpsPilot AI service started"));
