import test from "node:test";
import assert from "node:assert/strict";
import { Document } from "@langchain/core/documents";
import { LexicalRetriever } from "../src/rag/lexicalRetriever.js";

test("retriever ranks the matching runbook first", () => {
  const retriever = new LexicalRetriever([
    new Document({ pageContent: "Database pool exhaustion causes connection errors", metadata: { source: "db.md" } }),
    new Document({ pageContent: "The CDN serves static assets", metadata: { source: "cdn.md" } }),
  ]);
  const results = retriever.search("database connection errors", 1);
  assert.equal(results[0]?.document.metadata.source, "db.md");
  assert.ok((results[0]?.score ?? 0) > 0);
});
