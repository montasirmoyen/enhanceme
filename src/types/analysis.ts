export interface AnalysisRatings {
  overall: number;
  content: number;
  structure: number;
  formatting: number;
  keywords: number;
  achievements: number;
}

export interface AnalysisSection {
  strengths: string[];
  improvements: string[];
}

export interface DeepAnalysis {
  content: AnalysisSection;
  structure: AnalysisSection;
  formatting: AnalysisSection;
  keywords: AnalysisSection;
  achievements: AnalysisSection;
}

export interface AnalysisResult {
  ratings: AnalysisRatings;
  deepAnalysis: DeepAnalysis;
  recommendations: string[];
  summary: string;
  overallScore: number;
}

export interface ApiResponse {
  success: boolean;
  analysis?: AnalysisResult;
  error?: string;
}

export interface FileUploadState {
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
