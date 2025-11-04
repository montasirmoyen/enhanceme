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
  resume?: ResumeSchema;
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

export interface ResumeSchema {
  basics: {
    name: string;
    headline?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: { label: string; url: string }[];
    summary?: string;
  };
  skills: { name: string; level?: string; keywords?: string[] }[];
  experience: {
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree?: string;
    area?: string;
    startDate?: string;
    endDate?: string;
    details?: string[];
  }[];
  projects?: { name: string; description?: string; bullets?: string[]; link?: string }[];
}
