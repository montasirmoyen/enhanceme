'use client';

import { Sparkles, Target, TrendingUp } from 'lucide-react';
import React from 'react';
import mammoth from 'mammoth';
import pdfToText from 'react-pdftotext';

async function extractText(event: React.ChangeEvent<HTMLInputElement>) {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error("No file selected");
    return;
  }
  
  const file = files[0];
  const fileType = file.type;
  
  try {
    let extractedText = '';
    
    if (fileType === 'application/pdf') { // pdf
      extractedText = await pdfToText(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // docx
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else if (fileType === 'text/plain') { // other
      extractedText = await file.text();
    } else {
      console.error("Unsupported file type:", fileType);
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    
    console.log(extractedText);
  } catch (error) {
    console.error("Text extraction failed", error);
    alert("Failed to extract text from file. Please try again.");
  }
}

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
              Resume Enhancer
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enhance Your Resume with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              {' '}AI
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
      </main>

      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-purple-300 rounded-2xl bg-purple-50 hover:bg-purple-100 transition">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={extractText}
            className="hidden"
            id="resumeUpload"
          />
          <label
            htmlFor="resumeUpload"
            className="cursor-pointer text-purple-700 font-medium"
          >
            Click to upload your resume
          </label>
          <div id="fileContent"></div>
        </div>
      </div>
    </div>
  );
}
