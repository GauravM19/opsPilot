import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export type KnowledgeChunk = Document<Record<string, string>>;

export async function loadKnowledge(directory: string): Promise<KnowledgeChunk[]> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".md") || file.endsWith(".txt"));
  const documents = await Promise.all(files.map(async (file) => {
    const text = await readFile(join(directory, file), "utf8");
    return new Document({ pageContent: text, metadata: { source: basename(file) } });
  }));
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 900, chunkOverlap: 120 });
  return splitter.splitDocuments(documents);
}
