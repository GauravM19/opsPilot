import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),
  javaServiceUrl: process.env.JAVA_SERVICE_URL ?? "http://localhost:8080",
  knowledgePath: process.env.KNOWLEDGE_PATH ?? "../../data/knowledge",
  openAiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
};
