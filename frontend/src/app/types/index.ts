export interface Source {
    name: string;
    url: string;
    snippet: string;
    type: string;
}

export interface Statement {
    text: string;
    verdict: 'verified' | 'partiallyAccurate' | 'false' | 'unverified';
    confidenceScore: number;
    sources: Source[];
    explanation: string;
}

export interface FactCheckResult {
    confidenceScore: number;
    statements: Statement[];
}