import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    const weight = formData.get('weight') as string;
    const height = formData.get('height') as string;
    const age = formData.get('age') as string;
    const gender = formData.get('gender') as string;
    const locale = (formData.get('locale') as string) || 'hr';

    if (!file || !GEMINI_API_KEY) {
      return Response.json({ error: 'Missing photo or API key' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = locale === 'hr'
      ? `Analiziraj ovu fotografiju tijela osobe. Podaci: težina ${weight}kg, visina ${height}cm, dob ${age}, spol ${gender}.

Vrati ISKLJUČIVO JSON u ovom formatu (ništa drugo, samo JSON):
{
  "bodyFat": broj (procjena body fat postotka),
  "muscleMass": broj (procjena mišićne mase u kg),
  "bmi": broj,
  "fitLevel": "Početnik" ili "Srednji" ili "Napredni" ili "Elite",
  "score": broj 0-100 (FIT score),
  "strong": ["snažna strana 1 na hrvatskom", "snažna strana 2"],
  "weak": ["slaba točka 1 na hrvatskom", "slaba točka 2"],
  "recommendations": ["preporuka 1", "preporuka 2"]
}`
      : `Analyze this body photo. Data: weight ${weight}kg, height ${height}cm, age ${age}, gender ${gender}.

Return ONLY JSON in this format (nothing else, just JSON):
{
  "bodyFat": number (body fat percentage estimate),
  "muscleMass": number (muscle mass estimate in kg),
  "bmi": number,
  "fitLevel": "Beginner" or "Intermediate" or "Advanced" or "Elite",
  "score": number 0-100 (FIT score),
  "strong": ["strong point 1", "strong point 2"],
  "weak": ["weak point 1", "weak point 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64, mimeType } },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return Response.json(data);
    }

    return Response.json({ error: 'Failed to parse AI response', raw: text.substring(0, 500) }, { status: 500 });
  } catch (error: any) {
    console.error('Body analysis error:', error?.message);
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
