import { Document } from "@langchain/core/documents";

const STOPWORDS = new Set(["a", "an", "and", "are", "for", "from", "how", "is", "it", "of", "the", "to", "what", "when", "with"]);

function terms(text: string): Set<string> {
  return new Set((text.toLowerCase().match(/[a-z0-9-]+/g) ?? []).filter((term) => !STOPWORDS.has(term)));
}

export type ScoredDocument = { document: Document<Record<string, string>>; score: number };

export class LexicalRetriever {
  private readonly postings = new Map<string, Set<number>>();
  private readonly documentTerms: Set<string>[];

  constructor(private readonly documents: Document<Record<string, string>>[]) {
    this.documentTerms = documents.map((document, index) => {
      const documentTerms = terms(document.pageContent);
      for (const term of documentTerms) {
        const posting = this.postings.get(term) ?? new Set<number>();
        posting.add(index);
        this.postings.set(term, posting);
      }
      return documentTerms;
    });
  }

  search(query: string, limit = 5): ScoredDocument[] {
    const queryTerms = terms(query);
    const candidates = new Set<number>();
    for (const term of queryTerms) {
      for (const documentIndex of this.postings.get(term) ?? []) candidates.add(documentIndex);
    }
    return [...candidates]
      .map((documentIndex) => {
        const document = this.documents[documentIndex];
        if (!document) return undefined;
        const overlap = [...queryTerms].filter((term) => this.documentTerms[documentIndex]?.has(term)).length;
        return { document, score: queryTerms.size === 0 ? 0 : overlap / queryTerms.size };
      })
      .filter((item): item is ScoredDocument => item !== undefined)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);
  }
}
