// ./types/navigation.d.ts
export type HighlightArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScannerStackParams = {
  "/(tabs)/scanner/camera": undefined;
  "/(tabs)/scanner/highlight": { imageUri: string };
  "/(tabs)/scanner/fact-check": {
    query: string;
    highlights: string; // JSON string of HighlightArea[]
    imageUri: string;
  };
};

export type FactCheckResponse = {
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  sources: {
    name: string;
    url: string;
    reliability: number;
  }[];
  timestamp: string;
};