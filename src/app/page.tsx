'use client';

import { Star, Lightbulb, Book, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { AnalysisState } from '@/types/analysis';
import { AnalysisService } from '@/services/analysis-service';
import { FileUpload } from '@/components/file-upload';
import { AnalysisDisplay } from '@/components/analysis-display';

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setAnalysisState({
        isAnalyzing: false,
        result,
        error: null
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisState({
        isAnalyzing: false,
        result: null,
        error: error instanceof Error ? error.message : 'Failed to analyze resume'
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisState({
      isAnalyzing: false,
      result: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-b from-purple-700 via-purple-500 to-purple-500/25 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
        <div className="flex items-center space-x-3">
          <Image className="p-2" src="/sparkle.png" alt="Sparkle" width={50} height={50} />
          <h1 className="text-2xl font-bold">enhanceme</h1>
        </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-18">
        {!analysisState.result ? (
          <>
            <div className="text-center mb-16 mt-4">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Enhance Your Resume with
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-purple-500/50">
                  {' '}AI
                </span>
              </h2>
              {/* <p className="font-medium text-xl text-gray-500 max-w-3xl mx-auto mb-12">
                Upload your resume and get an AI analysis with detailed ratings,
                personalized recommendations, and realistic advice to improve your resume.
              </p>  */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-purple-500/75 mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Analysis</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Comprehensive AI-powered analysis of content, structure, formatting, and keywords
                  </p>
                </div>

                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-purple-500/75 mb-6">
                    <Book className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Ratings</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Get specific scores and insights across multiple resume dimensions
                  </p>
                </div>

                <div className="flex flex-col items-center p-8 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 rounded-full bg-purple-500/75 mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Actionable Insights</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Receive personalized recommendations to optimize your resume's impact
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
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h2>
                <p className="text-gray-500">Here's your comprehensive resume analysis</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another Resume
              </button>
            </div>
            
            {analysisState.result && (
              <AnalysisDisplay result={analysisState.result} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 bg-white/80 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <div className="inline-flex items-center justify-center gap-2">
              <Image src="/sparkle.png" alt="Sparkle" width={30} height={30} className="align-middle" />
              <p className="m-0">&copy; 2025 enhanceme. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
