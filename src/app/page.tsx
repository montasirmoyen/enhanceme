'use client';

import { Sparkles, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">enhanceme</h1>
            </div>
            <div className="text-sm text-gray-500">
              AI-Powered Resume Enhancement
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Resume with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              {' '}AI Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your resume and let our AI analyze, optimize, and enhance it for better job prospects. 
            Get personalized suggestions to make your resume stand out.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="p-3 rounded-full bg-purple-100 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
              <p className="text-gray-600 text-sm text-center">
                AI-powered analysis of your resume content and structure
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="p-3 rounded-full bg-purple-100 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Optimization</h3>
              <p className="text-gray-600 text-sm text-center">
                Get personalized suggestions to improve your resume's impact
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="p-3 rounded-full bg-purple-100 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enhancement</h3>
              <p className="text-gray-600 text-sm text-center">
                Refine your resume with industry-specific recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {/* TODO: File Upload */}
        </div>        
      </main>

      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 enhanceme. Built with AI to help you succeed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
