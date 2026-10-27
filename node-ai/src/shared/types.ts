export type Citation = {
  source: string;
  quote: string;
  score: number;
};

export type Analysis = {
  analysisId: string;
  incidentId?: string;
  summary: string;
  probableCauses: string[];
  recommendedActions: string[];
  confidence: number;
  citations: Citation[];
  abstained: boolean;
  model: string;
  trace: {
    retrievedDocuments: number;
    provider: string;
    latencyMs: number;
  };
};
