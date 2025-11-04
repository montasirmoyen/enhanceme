import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisService } from '@/services/analysis-service';

const API_KEY = process.env.AI_API_KEY;
const AI_URL = process.env.AI_URL;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o';
const USE_MOCK_DATA = false;

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

    const prompt = `Analyze the following resume and return ONLY valid JSON with both analysis and a normalized resume structure (no markdown, no prose).

Required JSON schema (example values allowed):
{
  "ratings": { "overall": 7.5, "content": 7, "structure": 8, "formatting": 6, "keywords": 7, "achievements": 7 },
  "deepAnalysis": {
    "content": { "strengths": ["..."], "improvements": ["..."] },
    "structure": { "strengths": ["..."], "improvements": ["..."] },
    "formatting": { "strengths": ["..."], "improvements": ["..."] },
    "keywords": { "strengths": ["..."], "improvements": ["..."] },
    "achievements": { "strengths": ["..."], "improvements": ["..."] }
  },
  "recommendations": ["..."],
  "summary": "...",
  "overallScore": 7.5,
  "resume": {
    "basics": { "name": "...", "headline": "...", "email": "...", "phone": "...", "location": "...", "links": [{"label":"GitHub","url":"https://..."}], "summary": "..." },
    "skills": [{ "name": "Backend", "keywords": ["Node.js","PostgreSQL"] }],
    "experience": [
      { "company": "...", "role": "...", "location": "...", "startDate": "2022-01", "endDate": "2024-03", "current": false, "bullets": ["..."] }
    ],
    "education": [
      { "institution": "...", "degree": "...", "area": "...", "startDate": "2018-08", "endDate": "2022-05", "details": ["..."] }
    ],
    "projects": [{ "name": "...", "description": "...", "bullets": ["..."], "link": "https://..." }]
  }
}

Respond with ONLY the JSON object.

Resume Text:\n${resumeText}`;

    const response = await axios.post(
      `${AI_URL}`,
      {
        model: `${AI_MODEL}`,
        messages: [
          { role: 'system', content: 'You are an expert resume analyst. You must respond with valid JSON only, no markdown formatting, no code blocks, no explanatory text.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let rawAnalysis = response.data?.choices?.[0]?.message?.content ?? response.data?.choices?.[0]?.text;
    
    if (typeof rawAnalysis === 'string') {
      rawAnalysis = rawAnalysis.trim();
      rawAnalysis = rawAnalysis.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
      rawAnalysis = rawAnalysis.trim();
    }

    try {
      const analysis = JSON.parse(rawAnalysis);
      
      if (!analysis.ratings || typeof analysis.ratings !== 'object') {
        throw new Error('Missing or invalid ratings object');
      }
      if (!analysis.deepAnalysis || typeof analysis.deepAnalysis !== 'object') {
        throw new Error('Missing or invalid deepAnalysis object');
      }
      if (!Array.isArray(analysis.recommendations)) {
        throw new Error('Missing or invalid recommendations array');
      }
      if (!analysis.summary || typeof analysis.summary !== 'string') {
        throw new Error('Missing or invalid summary');
      }

      return NextResponse.json({
        success: true,
        analysis
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response was:', rawAnalysis);
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
