'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';
import DrFilip from './DrFilip';
import { findDiagnosis, buildKnowledgePrompt, type PhysioDiagnosis } from '@/lib/constants/physioKnowledge';

type Mood = 'idle' | 'thinking' | 'talking' | 'happy' | 'concerned';

export default function DrFilipConsult({ soreness }: { soreness: Record<string, number> }) {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [mood, setMood] = useState<Mood>('idle');
  const [isTalking, setIsTalking] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMsgs, setChatMsgs] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem('fit-profile') || '{}')); } catch {}
  }, []);

  // Auto-greeting based on soreness
  useEffect(() => {
    const painful = Object.entries(soreness).filter(([, v]) => v >= 2);
    if (painful.length > 0) {
      const muscleNames = painful.map(([id]) => id).join(', ');
      setMood('concerned');
      setMessage(hr
        ? `Vidim upalu u: ${muscleNames}. Klikni "Konzultacija" da mi kažeš više o simptomima.`
        : `I see inflammation in: ${muscleNames}. Click "Consultation" to tell me more about symptoms.`
      );
      setTimeout(() => setMood('idle'), 5000);
    } else {
      setMood('happy');
      setMessage(hr ? 'Sve izgleda dobro! Nastavi s treningom. 💪' : 'Everything looks good! Keep training. 💪');
      setTimeout(() => setMood('idle'), 3000);
    }
  }, [soreness, hr]);

  const handleSend = async (text: string) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', text };
    setChatMsgs((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setMood('thinking');

    // Check local knowledge base first for instant response
    const localDiag = findDiagnosis(text);
    if (localDiag && !chatMsgs.some((m) => m.text.includes(localDiag.name[hr ? 'hr' : 'en']))) {
      setTyping(false);
      setMood('talking');
      setIsTalking(true);
      const lang = hr ? 'hr' : 'en';
      const offlineResponse = buildOfflineResponse(localDiag, lang);
      setChatMsgs((p) => [...p, { role: 'ai', text: offlineResponse }]);
      setMessage(hr ? `Imam podatke o ${localDiag.name.hr}!` : `I have data on ${localDiag.name.en}!`);
      setTimeout(() => { setIsTalking(false); setMood('happy'); }, 3000);
      return;
    }

    // Build context from user profile + soreness
    const painfulMuscles = Object.entries(soreness).filter(([, v]) => v >= 2);
    const injuries = profile?.injuries || [];
    const diagnosis = profile?.injuryDiagnosis || '';

    const systemPrompt = hr
      ? `Ti si Dr. Filip Matković — doktor fizioterapije i sportske medicine.
BIOGRAFIJA: Diplomirao fizioterapiju na Medicinskom fakultetu u Zagrebu. Specijalizaciju sportske medicine završio u Barceloni na Universitat de Barcelona. Radio 3 godine s profesionalnim sportašima u Kataloniji — FC Barcelona B tim, atletičari, plivači. Vratio se u Hrvatsku gdje vodi kliniku u Zagrebu s podružnicom u Splitu.
STATISTIKE: 14 godina iskustva, 3,200+ pacijenata, 98% uspješnost.

PRISTUP: Holistički — gledaš cijelo tijelo, posturalnu analizu, biomehaniku pokreta i mentalni aspekt oporavka. Ne gledaš samo ozljedu.

OSOBNOST:
- Smiren, precizan, nikad ne žuriš s dijagnozom
- Objašnjavaš SVE — nikad ne kažeš "samo radi ovo" bez razloga
- Uvijek pitaš "od 1 do 10, koliko boli?" za sve
- Kombiniraš znanost s empatijom
- Govoriš polako i jasno — nikad žargon bez objašnjenja
- Imaš anatomski model kostura "Franjo" kojeg ponekad spominješ
- Šalješ follow-up — "Kako je danas? Skala 1-10?"
- Kad kažeš "ovo će malo boljeti" — boljeti će, ali pomoći će

ULOGA U APLIKACIJI:
- Analiziraj koji mišići su upaljeni i zašto (na osnovu zadnjih treninga)
- Koliko odmora treba svaka mišićna grupa
- Personalizirani program istezanja i mobilnosti
- Modifikacije treninga da se izbjegne pogoršanje
- Upozorenja kad je potrebno posjetiti pravog fizioterapeuta

Korisnikovi podaci:
- Ozljede: ${injuries.join(', ') || 'nema'}
- Dijagnoza: ${diagnosis || 'nije unesena'}
- Trenutna bol: ${painfulMuscles.map(([id, v]) => `${id} (razina ${v}/4)`).join(', ') || 'nema boli'}
- Težina: ${profile?.weight || '?'}kg, Visina: ${profile?.height || '?'}cm, Dob: ${profile?.age || '?'}

PRAVILA: Daj KONKRETNE preporuke. UVIJEK napomeni da posjeti pravog liječnika za potvrdu. Na hrvatskom jeziku.
${buildKnowledgePrompt('hr')}`
      : `You are Dr. Filip Matković — doctor of physiotherapy and sports medicine.
BIO: Graduated physiotherapy at Zagreb Medical Faculty. Specialized in sports medicine at Universitat de Barcelona. Worked 3 years with professional athletes in Catalonia — FC Barcelona B team, athletes, swimmers. Runs clinics in Zagreb and Split.
STATS: 14 years experience, 3,200+ patients, 98% success rate.

APPROACH: Holistic — you look at the whole body, postural analysis, movement biomechanics and mental recovery aspect.

PERSONALITY:
- Calm, precise, never rush a diagnosis
- Explain EVERYTHING — never say "just do this" without reason
- Always ask "on a scale of 1-10, how much does it hurt?"
- Combine science with empathy
- Speak slowly and clearly — no jargon without explanation
- Have a skeleton model named "Franjo" you sometimes mention
- Follow up: "How is it today? Scale 1-10?"

User data:
- Injuries: ${injuries.join(', ') || 'none'}
- Diagnosis: ${diagnosis || 'not entered'}
- Current pain: ${painfulMuscles.map(([id, v]) => `${id} (level ${v}/4)`).join(', ') || 'no pain'}
- Weight: ${profile?.weight || '?'}kg, Height: ${profile?.height || '?'}cm, Age: ${profile?.age || '?'}

RULES: Give SPECIFIC recommendations. ALWAYS remind to visit a real doctor. In English.
${buildKnowledgePrompt('en')}`;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMsgs.slice(-15),
          locale,
          trainerPrompt: systemPrompt,
          userContext: profile,
        }),
      });
      const data = await res.json();
      setTyping(false);
      setMood('talking');
      setIsTalking(true);
      setChatMsgs((p) => [...p, { role: 'ai', text: data.text }]);
      setMessage(data.text.substring(0, 80) + (data.text.length > 80 ? '...' : ''));
      setTimeout(() => { setIsTalking(false); setMood('idle'); }, 3000);
    } catch {
      setTyping(false);
      setMood('concerned');
      setChatMsgs((p) => [...p, { role: 'ai', text: hr ? 'Greška u komunikaciji. Pokušaj ponovno.' : 'Communication error. Try again.' }]);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs, typing]);

  const stats = [
    { val: '14', label: hr ? 'godina iskustva' : 'years experience' },
    { val: '3,200+', label: hr ? 'pacijenata' : 'patients' },
    { val: '98%', label: hr ? 'uspješnost' : 'success rate' },
  ];

  return (
    <Box glow="#3ea8ff">
      <Lbl icon="🩺" text={hr ? 'Specijalist — Dr. Filip Matković' : 'Specialist — Dr. Filip Matković'} color="#3ea8ff" />

      {/* Dr Filip Avatar */}
      <div className="flex gap-3 mt-2">
        <div className="w-32 shrink-0">
          <DrFilip mood={mood} isTalking={isTalking} message={!showChat ? message : undefined} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-fit-text">Dr. Filip Matković</div>
          <div className="text-[10px] text-fit-muted">{hr ? 'Doktor fizioterapije · Sportska medicina' : 'Doctor of Physiotherapy · Sports Medicine'}</div>
          <div className="text-[10px] text-fit-dim">Zagreb / Split · {hr ? 'Specijalizacija' : 'Specialization'}: Barcelona</div>

          <div className="flex gap-1 flex-wrap mt-1.5">
            {[hr ? 'Fizioterapeut' : 'Physiotherapist', hr ? 'Sportska medicina' : 'Sports Medicine', hr ? 'Rehabilitacija' : 'Rehabilitation', hr ? 'Biomehanika' : 'Biomechanics'].map((t) => (
              <span key={t} className="text-[8px] py-0.5 px-1.5 rounded-full bg-fit-blue/10 text-fit-blue font-semibold">{t}</span>
            ))}
          </div>

          <div className="text-[9px] text-fit-muted italic mt-2 border-l-2 border-fit-blue/30 pl-2">
            &ldquo;{hr ? 'Tijelo ti govori sve — samo ga trebaš slušati. Ja sam tu da prevedem taj jezik i vratim te jačeg nego prije.' : 'Your body tells you everything — you just need to listen. I\'m here to translate that language and bring you back stronger.'}&rdquo;
          </div>

          <div className="grid grid-cols-3 gap-1 mt-2">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-1 rounded-lg bg-white/[0.04]">
                <div className="text-xs font-black text-fit-text">{s.val}</div>
                <div className="text-[7px] text-fit-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation toggle */}
      <button onClick={() => setShowChat(!showChat)}
        className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none transition-all"
        style={{ background: showChat ? '#ff6b4a20' : 'linear-gradient(135deg, #3ea8ff, #7c5cfc)', color: showChat ? '#ff6b4a' : '#fff' }}>
        {showChat ? (hr ? '✕ Zatvori konzultaciju' : '✕ Close consultation') : (hr ? '🩺 Započni konzultaciju' : '🩺 Start consultation')}
      </button>

      {/* Chat */}
      {showChat && (
        <div className="mt-3 animate-[fadeIn_0.3s_ease]">
          <div ref={chatRef} className="flex flex-col gap-2 max-h-52 overflow-auto mb-2">
            {chatMsgs.length === 0 && (
              <div className="text-[10px] text-fit-muted text-center py-4">
                {hr ? 'Opišite svoju bol, simptome ili pitajte o ozljedi...' : 'Describe your pain, symptoms or ask about an injury...'}
              </div>
            )}
            {chatMsgs.map((m, i) => (
              <div key={i} className="flex gap-1.5" style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                {m.role === 'ai' && <div className="w-5 h-5 rounded-full bg-fit-blue/20 flex items-center justify-center text-[8px] shrink-0 mt-0.5">🩺</div>}
                <div className="py-2 px-3 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: m.role === 'user' ? 'linear-gradient(135deg, #3ea8ff, #7c5cfc)' : 'rgba(255,255,255,0.05)',
                    color: m.role === 'user' ? '#fff' : '#e8eaf0',
                    borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                    borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
                  }}>{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1.5 self-start">
                <div className="w-5 h-5 rounded-full bg-fit-blue/20 flex items-center justify-center text-[8px]">🩺</div>
                <div className="py-2 px-4 rounded-2xl bg-white/[0.05] flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-fit-blue" style={{ animation: `pulse3 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="flex flex-wrap gap-1 mb-2">
            {(hr
              ? ['Boli me koljeno', 'Imam bol u leđima', 'Rame me steže', 'Prevencija ozljeda', 'Program istezanja']
              : ['My knee hurts', 'I have back pain', 'Shoulder is tight', 'Injury prevention', 'Stretching program']
            ).map((q) => (
              <button key={q} onClick={() => handleSend(q)}
                className="text-[9px] py-1 px-2 rounded-full bg-fit-blue/10 text-fit-blue font-semibold cursor-pointer border border-fit-blue/20 hover:bg-fit-blue/20 transition-colors">
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder={hr ? 'Opišite simptome...' : 'Describe symptoms...'}
              className="flex-1 bg-white/[0.04] border border-fit-border rounded-xl py-2 px-3 text-fit-text text-[11px] outline-none font-outfit focus:border-fit-blue/30" />
            <button onClick={() => handleSend(input)}
              className="rounded-xl px-4 cursor-pointer font-bold text-sm text-white border-none"
              style={{ background: 'linear-gradient(135deg, #3ea8ff, #7c5cfc)' }}>→</button>
          </div>
        </div>
      )}
    </Box>
  );
}

function buildOfflineResponse(diag: PhysioDiagnosis, lang: 'hr' | 'en'): string {
  const l = lang;
  const isHr = l === 'hr';
  let r = '';

  r += `🩺 **${diag.name[l]}**\n`;
  r += isHr ? `ICD-10: ${diag.icd10 || 'N/A'}\n\n` : `ICD-10: ${diag.icd10 || 'N/A'}\n\n`;

  r += isHr ? '📋 **Opis:**\n' : '📋 **Description:**\n';
  r += diag.description[l] + '\n\n';

  r += isHr ? '🔍 **Simptomi:**\n' : '🔍 **Symptoms:**\n';
  r += diag.symptoms[l].map((s) => `• ${s}`).join('\n') + '\n\n';

  r += isHr ? '⚡ **Akutna faza** (' + diag.phase1_acute.duration + '):\n' : '⚡ **Acute phase** (' + diag.phase1_acute.duration + '):\n';
  r += diag.phase1_acute[l].map((s) => `• ${s}`).join('\n') + '\n\n';

  r += isHr ? '🏋️ **Vježbe za prvu fazu:**\n' : '🏋️ **Phase 1 exercises:**\n';
  const p1ex = diag.exercises.filter((e) => e.phase === 1);
  r += p1ex.map((e) => `• ${isHr ? e.nameHr : e.name} — ${e.sets}×${e.reps}${e.hold ? ` (${isHr ? 'drži' : 'hold'} ${e.hold})` : ''} — ${e.frequency}\n  ${e.description[l]}`).join('\n') + '\n\n';

  r += isHr ? '🚫 **Kontraindikacije:**\n' : '🚫 **Contraindications:**\n';
  r += diag.contraindications[l].map((s) => `• ${s}`).join('\n') + '\n\n';

  r += isHr ? '🚨 **Crvene zastave — posjet liječniku:**\n' : '🚨 **Red flags — see a doctor:**\n';
  r += diag.redFlags[l].map((s) => `• ${s}`).join('\n') + '\n\n';

  r += isHr ? `⏱️ **Oporavak:** ${diag.recoveryTimeline}\n` : `⏱️ **Recovery:** ${diag.recoveryTimeline}\n`;
  r += isHr ? `✅ **Uspješnost:** ${diag.successRate}\n\n` : `✅ **Success rate:** ${diag.successRate}\n\n`;

  r += isHr
    ? '💡 Od 1 do 10, koliko boli? Reci mi više o simptomima pa ću prilagoditi program. ⚠️ Ovo je AI procjena — za potvrdu posjetite pravog fizioterapeuta.'
    : '💡 On a scale of 1-10, how much does it hurt? Tell me more about symptoms and I\'ll customize the program. ⚠️ This is an AI assessment — visit a real physiotherapist for confirmation.';

  return r;
}
