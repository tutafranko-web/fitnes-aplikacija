import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const defaultPrompt = {
  hr: `Ti si FIT AI Trener — osobni fitness trener u aplikaciji.
Pravila:
- UVIJEK odgovaraj na hrvatskom jeziku
- Budi motivirajući, energičan i stručan
- Koristi emoji umjereno
- Personaliziraj savjete na osnovu korisnikovih podataka
- Budi koncizan — odgovori od 2-5 rečenica osim kad generiraš trening/plan
- Koristi formatiranje s novim redovima za liste`,
  en: `You are FIT AI Trainer — a personal fitness coach in the app.
Rules:
- ALWAYS respond in English
- Be motivating, energetic and professional
- Use emoji moderately
- Personalize advice based on user data
- Be concise — 2-5 sentences unless generating a workout/plan
- Use formatting with line breaks for lists`,
};

export async function POST(req: NextRequest) {
  try {
    const { message, history, locale, userContext, trainerPrompt } = await req.json();
    const lang = (locale === 'hr' ? 'hr' : 'en') as 'hr' | 'en';

    if (!GEMINI_API_KEY) {
      return Response.json({
        text: `[No API Key found in env] ${lang === 'hr' ? getMockResponseHR(message) : getMockResponseEN(message)}`,
        mood: 'motivated',
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: (trainerPrompt || defaultPrompt[lang]) +
        (userContext ? `\n\nUser profile:\n${JSON.stringify(userContext, null, 2)}` : ''),
    });

    const chatHistory = (history || []).slice(-20)
      .filter((m: any) => m.text && m.text.trim())
      .map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    let mood = 'happy';
    if (text.includes('💪') || text.includes('trening') || text.includes('workout')) mood = 'motivated';
    if (text.includes('🤔') || text.includes('analiz')) mood = 'thinking';
    if (text.includes('🔥') || text.includes('odlič') || text.includes('great')) mood = 'excited';

    return Response.json({ text, mood });
  } catch (error: any) {
    console.error('AI Chat error:', error?.message || error);
    return Response.json({
      text: `⚠️ AI greška: ${(error?.message || 'nepoznato').substring(0, 200)}\n\nKoristim offline odgovor:\n${getMockResponseHR('bok')}`,
      mood: 'calm',
    });
  }
}

function getMockResponseHR(msg: string): string {
  const lower = (msg || '').toLowerCase();
  if (lower.includes('trening') || lower.includes('workout') || lower.includes('novi'))
    return "Evo novog treninga za danas:\n\n🏋️ Bench Press 4×8 @ 82kg\n🏋️ Incline DB 3×12 @ 30kg\n🏋️ Cable Fly 3×15\n🏋️ Tricep Pushdown 3×12\n🔥 Finisher: 3 runde AMRAP";
  if (lower.includes('dijet') || lower.includes('prehra') || lower.includes('kalor'))
    return "Za tvoj cilj preporučujem:\n\nProtein: 2.2g/kg dnevno\nUgljikohidrati: 240g\nMasti: 65g\nUkupno: ~2,280 kcal\n\nDoručak: Zobene + whey\nRučak: Piletina + riža\nVečera: Losos + krumpir";
  if (lower.includes('leđa') || lower.includes('bol') || lower.includes('ozljed'))
    return "Vježbe za oporavak:\n\nCat-Cow 3×10\nBird-Dog 3×8 po strani\nDead Bug 3×10\nGlute Bridge 3×15\nChild's Pose 2×30s\n\nRadi svaki dan 15 min! 🧘";
  if (lower.includes('motiv'))
    return "Sjeti se zašto si počeo! 🔥\n\nSvaki trening te čini jačim. Ne trebaš biti savršen — trebaš biti konstantan.\n\n\"Jedini loš trening je onaj koji nisi napravio.\" 💪";
  return "Tu sam za tebe! 💪 Pitaj me za novi trening, prehranu, oporavak ili bilo što vezano za fitness. Zajedno idemo do cilja! 🔥";
}

function getMockResponseEN(msg: string): string {
  const lower = (msg || '').toLowerCase();
  if (lower.includes('workout') || lower.includes('train') || lower.includes('new'))
    return "Here's your workout:\n\n🏋️ Bench Press 4×8 @ 82kg\n🏋️ Incline DB 3×12 @ 30kg\n🏋️ Cable Fly 3×15\n🏋️ Tricep Pushdown 3×12\n🔥 Finisher: 3 rounds AMRAP";
  if (lower.includes('diet') || lower.includes('nutri') || lower.includes('meal'))
    return "For your goal:\n\nProtein: 2.2g/kg daily\nCarbs: 240g\nFat: 65g\nTotal: ~2,280 kcal\n\nBreakfast: Oats + whey\nLunch: Chicken + rice\nDinner: Salmon + potato";
  if (lower.includes('back') || lower.includes('pain') || lower.includes('injur'))
    return "Recovery exercises:\n\nCat-Cow 3×10\nBird-Dog 3×8 each side\nDead Bug 3×10\nGlute Bridge 3×15\nChild's Pose 2×30s\n\nDo this daily for 15 min! 🧘";
  if (lower.includes('motiv'))
    return "Remember why you started! 🔥\n\nEvery workout makes you stronger. You don't need perfection — just consistency.\n\n\"The only bad workout is the one you didn't do.\" 💪";
  return "I'm here for you! 💪 Ask me about workouts, nutrition, recovery or anything fitness related. Let's reach your goals together! 🔥";
}
