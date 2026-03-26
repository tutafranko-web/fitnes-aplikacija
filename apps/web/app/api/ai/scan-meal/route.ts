import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;
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
      ? `Analiziraj ovu sliku obroka/hrane. Identificiraj što je na slici i procijeni nutritivne vrijednosti.

Vrati ISKLJUČIVO JSON (ništa drugo):
{
  "name": "naziv jela na hrvatskom",
  "calories": broj,
  "protein": broj u gramima,
  "carbs": broj u gramima,
  "fat": broj u gramima,
  "fiber": broj u gramima,
  "confidence": broj 0-100 (koliko si siguran u procjenu),
  "ingredients": ["sastojak1 na hrvatskom", "sastojak2"],
  "portionSize": "procjena veličine porcije",
  "healthScore": broj 1-10 (koliko je zdravo)
}`
      : `Analyze this meal/food image. Identify what's in the image and estimate nutritional values.

Return ONLY JSON (nothing else):
{
  "name": "meal name in English",
  "calories": number,
  "protein": number in grams,
  "carbs": number in grams,
  "fat": number in grams,
  "fiber": number in grams,
  "confidence": number 0-100,
  "ingredients": ["ingredient1", "ingredient2"],
  "portionSize": "portion size estimate",
  "healthScore": number 1-10
}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64, mimeType } },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return Response.json(JSON.parse(jsonMatch[0]));
    }

    return Response.json({ error: 'Failed to parse', raw: text.substring(0, 300) }, { status: 500 });
  } catch (error: any) {
    console.error('Meal scan error:', error?.message);
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
