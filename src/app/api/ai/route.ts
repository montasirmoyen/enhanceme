import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisService } from '@/services/analysis-service';

const API_KEY = process.env.AI_API_KEY;
const AI_URL = process.env.AI_URL;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const USE_MOCK_DATA = true;

export async function POST(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      const mockAnalysis = AnalysisService.createMockAnalysis();
      return NextResponse.json({
        success: true,
        analysis: mockAnalysis
      });
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { resumeText } = body ?? {};

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume analyst and career consultant. Analyze the following resume and provide a comprehensive assessment in the following JSON format:

{
  "ratings": {
    "overall": <number 1-10>,
    "content": <number 1-10>,
    "structure": <number 1-10>,
    "formatting": <number 1-10>,
    "keywords": <number 1-10>,
    "achievements": <number 1-10>
  },
  "deepAnalysis": {
    "content": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    },
    "structure": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    },
    "formatting": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    },
    "keywords": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    },
    "achievements": {
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    }
  },
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "summary": "Overall assessment summary",
  "overallScore": <number 1-10>
}

Resume Text:
${resumeText}`;

    const response = await axios.post(
      `${AI_URL}`,
      {
        model: `${AI_MODEL}`,
        messages: [
          { role: 'system', content: 'You are an expert resume analyst and career consultant. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawAnalysis = response.data?.choices?.[0]?.message?.content ?? response.data?.choices?.[0]?.text;
    
    console.log('AI analysis response:', rawAnalysis);

    try {
      const analysis = JSON.parse(rawAnalysis);
      
      if (!analysis.ratings || !analysis.deepAnalysis || !analysis.recommendations) {
        throw new Error('Invalid analysis structure');
      }

      return NextResponse.json({
        success: true,
        analysis
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error calling API:', error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your API key.' },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
