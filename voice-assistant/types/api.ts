// API Types for fact-checking responses
export interface FactCheckResponse {
  claim: string;
  verdict: 'True' | 'False' | 'Partially True' | 'Unverified';
  confidence: number;
  explanation: string;
  sources: Source[];
  timestamp: string;
}

export interface Source {
  name: string;
  url: string;
  reliability: number;
}

export interface AudioProcessingError {
  code: string;
  message: string;
}