import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const systemPrompt = {
  hr: `Ti si FIT AI Trener — osobni fitness trener u aplikaciji. Tvoje ime je "Trener".
Pravila:
- UVIJEK odgovaraj na hrvatskom jeziku
- Budi motivirajući, energičan i stručan
- Koristi emoji umjereno
- Personaliziraj savjete na osnovu korisnikovih podataka (ozljede, ciljevi, oprema, razina)
- Možeš generirati treninge, planove prehrane, savjete za oporavak
- Ako korisnik ima ozljedu, UVIJEK prilagodi vježbe i upozori
- Budi koncizan — odgovori od 2-5 rečenica osim kad generiraš trening/plan
- Koristi formatiranje s novim redovima za liste`,

  en: `You are FIT AI Trainer — a personal fitness coach in the app. Your name is "Trainer".
Rules:
- ALWAYS respond in English
- Be motivating, energetic and professional
- Use emoji moderately
- Personalize advice based on user data (injuries, goals, equipment, level)
- You can generate workouts, meal plans, recovery advice
- If user has an injury, ALWAYS adapt exercises and warn
- Be concise — 2-5 sentences unless generating a workout/plan
- Use formatting with line breaks for lists`,
};

export async function POST(req: NextRequest) {
  try {
    const { message, history, locale, userContext } = await req.json();

    if (!GEMINI_API_KEY) {
      // Fallback mock responses when no API key
      return Response.json({
        text: locale === 'hr'
          ? getMockResponseHR(message)
          : getMockResponseEN(message),
        mood: 'motivated',
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const lang = locale === 'hr' ? 'hr' : 'en';
    const contextBlock = userContext
      ? `\n\nKorisnikovi podaci:\n${JSON.stringify(userContext, null, 2)}`
      : '';

    const chat = model.startChat({
      history: (history || []).slice(-20).map((m: any) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      systemInstruction: systemPrompt[lang] + contextBlock,
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    // Detect mood from response
    let mood = 'happy';
    if (text.includes('💪') || text.includes('trening') || text.includes('workout')) mood = 'motivated';
    if (text.includes('🤔') || text.includes('analiz') || text.includes('analyz')) mood = 'thinking';
    if (text.includes('🔥') || text.includes('odlič') || text.includes('great')) mood = 'excited';

    return Response.json({ text, mood });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return Response.json(
      { text: 'Ups, greška u komunikaciji s AI-em. Pokušaj ponovno.', mood: 'calm' },
      { status: 500 }
    );
  }
}

function getMockResponseHR(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('trening') || lower.includes('workout') || lower.includes('novi'))
    return "Evo novog treninga za danas:\n\n🏋️ Bench Press 4×8 @ 82kg\n🏋️ Incline DB 3×12 @ 30kg\n🏋️ Cable Fly 3×15 @ 16kg\n🏋️ Tricep Pushdown 3×12\n🔥 Finisher: 3 runde AMRAP\n\nPrilagođeno za tvoje tijelo i ciljeve!";
  if (lower.includes('dijet') || lower.includes('prehra') || lower.includes('kalor'))
    return "Za tvoj cilj, preporučujem:\n\nProtein: 2.2g/kg = 185g dnevno\nUgljikohidrati: 240g\nMasti: 65g\nUkupno: ~2,280 kcal\n\nDoručak: Zobene + whey (480 kcal)\nRučak: Piletina + riža (620 kcal)\nVečera: Losos + krumpir (540 kcal)";
  if (lower.includes('leđa') || lower.includes('bol') || lower.includes('ozljed'))
    return "Vježbe za tvoje bolne leđa:\n\nCat-Cow 3×10\nBird-Dog 3×8 po strani\nDead Bug 3×10\nGlute Bridge 3×15\nChild's Pose 2×30s\n\nRadi svaki dan 15 min za oporavak! 🧘";
  if (lower.includes('istez') || lower.includes('stretch'))
    return "Program istezanja za danas:\n\n1. Ramena: Cross-Body Stretch 2×20s\n2. Prsa: Doorway Stretch 3×30s\n3. Noge: Couch Stretch 2×45s\n4. Leđa: Cat-Cow 3×10\n5. Kukovi: Pigeon Pose 2×30s\n\nDrži svaku poziciju barem 20 sekundi! 🧘";
  if (lower.includes('motiv'))
    return "Sjeti se zašto si počeo! 🔥\n\nSvaki trening te čini jačim nego jučer. Ne trebaš biti savršen — trebaš biti konstantan.\n\n\"Jedini loš trening je onaj koji nisi napravio.\"\n\nHajde, danas razbijamo! 💪";
  return "Odličan si! 💪 Nastavi s trudom, rezultati dolaze. Reci mi ako trebaš novi trening, savjet za prehranu, ili pomoć s ozljedom — tu sam za tebe! 🔥";
}

function getMockResponseEN(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('workout') || lower.includes('train') || lower.includes('new'))
    return "Here's your workout for today:\n\n🏋️ Bench Press 4×8 @ 82kg\n🏋️ Incline DB 3×12 @ 30kg\n🏋️ Cable Fly 3×15 @ 16kg\n🏋️ Tricep Pushdown 3×12\n🔥 Finisher: 3 rounds AMRAP\n\nCustomized for your body and goals!";
  if (lower.includes('diet') || lower.includes('nutri') || lower.includes('calor') || lower.includes('meal'))
    return "For your goal, I recommend:\n\nProtein: 2.2g/kg = 185g daily\nCarbs: 240g\nFat: 65g\nTotal: ~2,280 kcal\n\nBreakfast: Oats + whey (480 kcal)\nLunch: Chicken + rice (620 kcal)\nDinner: Salmon + potato (540 kcal)";
  if (lower.includes('back') || lower.includes('pain') || lower.includes('hurt') || lower.includes('injur'))
    return "Exercises for your back pain:\n\nCat-Cow 3×10\nBird-Dog 3×8 each side\nDead Bug 3×10\nGlute Bridge 3×15\nChild's Pose 2×30s\n\nDo this daily for 15 min! 🧘";
  if (lower.includes('stretch'))
    return "Today's stretching program:\n\n1. Shoulders: Cross-Body Stretch 2×20s\n2. Chest: Doorway Stretch 3×30s\n3. Legs: Couch Stretch 2×45s\n4. Back: Cat-Cow 3×10\n5. Hips: Pigeon Pose 2×30s\n\nHold each position for at least 20 seconds! 🧘";
  if (lower.includes('motiv'))
    return "Remember why you started! 🔥\n\nEvery workout makes you stronger than yesterday. You don't need to be perfect — you need to be consistent.\n\n\"The only bad workout is the one you didn't do.\"\n\nLet's crush it today! 💪";
  return "You're doing great! 💪 Keep pushing, results are coming. Let me know if you need a new workout, nutrition advice, or help with an injury — I'm here for you! 🔥";
}
