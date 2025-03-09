export interface Source {
    name: string;
    url: string;
    snippet: string;
    type: string;
}

export interface FactCheckResult {
    confidenceScore: number;
    statements: Statement[];
}

export interface FactCheckSource {
    title: string;
    publisher?: { name: string }; // 🔹 Publisher is optional
    url: string;
    textualRating?: string; // 🔹 Some sources may not have a rating
    reviewDate?: string; // 🔹 Some sources may not have a review date
    languageCode?: string;
    [key: string]: any; // 🔹 Allows extra attributes without TypeScript errors
}

export interface Statement {
    text: string;
    verdict: string;
    confidenceScore: number;
    sources: FactCheckSource[]; // Ensure this is an array of FactCheckSource objects
    explanation: string;
}
