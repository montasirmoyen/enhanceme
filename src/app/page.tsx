'use client';

import { Star, Lightbulb, Book } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisState } from '@/types/analysis';
import { AnalysisService } from '@/services/analysis-service';
import { FileUpload } from '@/components/file-upload';

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasPreviousAnalysis, setHasPreviousAnalysis] = useState(false);
  const router = useRouter();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setAnalysisState(prev => ({ ...prev, error: null }));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const validation = AnalysisService.validateFile(selectedFile);
    if (!validation.isValid) {
      setAnalysisState(prev => ({ 
        ...prev, 
        error: validation.error || 'Invalid file',
        result: null 
      }));
      return;
    }

    setAnalysisState({
      isAnalyzing: true,
      result: null,
      error: null
    });

    try {
      const result = await AnalysisService.analyzeResume(selectedFile);
      try {
        sessionStorage.setItem('lastAnalysis', JSON.stringify(result));
      } catch {}
      setAnalysisState({
        isAnalyzing: false,
        result: null,
        error: null
      });
      router.push('/analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisState({
        isAnalyzing: false,
        result: null,
        error: error instanceof Error ? error.message : 'Failed to analyze resume'
      });
    }
  };

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lastAnalysis');
      setHasPreviousAnalysis(!!stored);
    } catch {
      setHasPreviousAnalysis(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <header className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Image className="p-2" src="/logo.png" alt="Sparkle" width={50} height={50} />
              <h1 className="text-2xl font-bold">enhanceme</h1>
            </div>
            {hasPreviousAnalysis && (
              <button
                onClick={() => router.push('/analysis')}
                className="px-4 py-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              >
                View last analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-18">
        <>
          <div className="text-center mb-16 mt-4">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Stand Out with
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-green-600 to-green-500/30">
                {' '}AI-Powered Resume Reviews
              </span>
            </h2>
            <p className="font-medium text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Upload your resume to get honest ratings, deep analysis, and actionable recommendations.
              Built with ATS best practices so recruiters see your impact fast.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-green-400/75 mb-6">
                    <Book className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Honest Ratings</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Objective ratings across key resume aspects to highlight strengths and weaknesses
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-green-400/75 mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analysis</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Powerful analysis to evaluate your resume&apos;s strengths and areas for improvement
                  </p>
                </div>

                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-green-400/75 mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS Compliant</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Built on compatibility with Applicant Tracking Systems (ATS)
                  </p>
                </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              isAnalyzing={analysisState.isAnalyzing}
              error={analysisState.error}
            />
          </div>
        </>
      </main>

      <footer className="border-t border-gray-100 bg-white/80 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <div className="inline-flex items-center justify-center gap-2">
              <Image src="/sparkle.png" alt="Sparkle" width={30} height={30} className="align-middle" />
              <p className="m-0">&copy; 2025 enhanceme</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
