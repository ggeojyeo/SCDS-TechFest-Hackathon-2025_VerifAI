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

// Define the HighlightArea interface
export interface HighlightArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type scannerStackParamList = {
  scanner: undefined;
  HighlightScreen: { imageUri: string };
  FactCheckScreen: { query: string; highlights?: HighlightArea[]; imageUri?: string };
};
