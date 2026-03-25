'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Lbl from '@/components/ui/Lbl';

interface Post {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  text: string;
  sport?: string;
  stats?: string;
  likes: number;
  time: string;
  liked: boolean;
}

export default function SocialTab() {
  const locale = useLocaleStore((s) => s.locale);
  const [view, setView] = useState<'feed' | 'match' | 'challenges' | 'leaderboard'>('feed');

  const [posts, setPosts] = useState<Post[]>([
    { id: '1', name: 'Marko K.', avatar: '🏋️', verified: true, text: locale === 'hr' ? 'Novi PR na bench pressu! 100kg × 3 reps. Put do 120kg nastavlja se!' : 'New bench press PR! 100kg × 3 reps. Road to 120kg continues!', sport: locale === 'hr' ? 'Teretana' : 'Gym', stats: 'Bench: 100kg × 3 — PR! 🏆', likes: 24, time: '2h', liked: false },
    { id: '2', name: 'Ana M.', avatar: '🏃', verified: false, text: locale === 'hr' ? 'Jutarnje trčanje 8km uz more. Savršen tempo 5:20/km 🌅' : 'Morning 8km run by the sea. Perfect pace 5:20/km 🌅', sport: locale === 'hr' ? 'Trčanje' : 'Running', likes: 18, time: '4h', liked: true },
    { id: '3', name: 'Ivan B.', avatar: '🥊', verified: true, text: locale === 'hr' ? 'MMA sparring sesija. 5 rundi, fokus na takedown obranu. Napredak je vidljiv!' : 'MMA sparring session. 5 rounds, focus on takedown defense. Progress is visible!', sport: 'MMA', likes: 31, time: '6h', liked: false },
    { id: '4', name: 'Petra L.', avatar: '🧘', verified: false, text: locale === 'hr' ? '30 dana yoga challengea — dan 22! Flexibility je nevjerojatna sada 🧘‍♀️' : '30 day yoga challenge — day 22! Flexibility is incredible now 🧘‍♀️', sport: 'Yoga', likes: 42, time: '8h', liked: false },
  ]);

  const toggleLike = (id: string) => {
    setPosts((p) => p.map((post) =>
      post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  const matchPeople = [
    { name: 'Luka D.', avatar: '🏋️', city: 'Split', distance: '2.3 km', sports: ['🏋️', '🏃', '🥊'], level: locale === 'hr' ? 'Napredni' : 'Advanced', mutual: 3 },
    { name: 'Mia S.', avatar: '🏃', city: 'Zagreb', distance: '0.8 km', sports: ['🏃', '🧘', '🚴'], level: locale === 'hr' ? 'Srednji' : 'Intermediate', mutual: 1 },
    { name: 'Ante P.', avatar: '⚽', city: 'Split', distance: '4.1 km', sports: ['⚽', '🏋️'], level: locale === 'hr' ? 'Napredni' : 'Advanced', mutual: 5 },
  ];

  const challenges = [
    { name: locale === 'hr' ? '100 Burpeesa / 7 dana' : '100 Burpees / 7 days', participants: 234, progress: 65, badge: '🔥', reward: locale === 'hr' ? 'Fire badge' : 'Fire badge' },
    { name: locale === 'hr' ? 'Bench 100kg Club' : 'Bench 100kg Club', participants: 89, progress: 82, badge: '🏆', reward: locale === 'hr' ? '1 mjesec Pro' : '1 month Pro' },
    { name: locale === 'hr' ? 'Mjesečni Maratonac' : 'Monthly Marathoner', participants: 156, progress: 40, badge: '🏃', reward: locale === 'hr' ? 'Runner badge' : 'Runner badge' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Marko K.', xp: 12450, level: 'Titan', avatar: '🏋️' },
    { rank: 2, name: 'Ana M.', xp: 11200, level: 'Elite', avatar: '🏃' },
    { rank: 3, name: 'Ivan B.', xp: 10800, level: 'Elite', avatar: '🥊' },
    { rank: 4, name: locale === 'hr' ? 'Ti' : 'You', xp: 8420, level: 'Pro', avatar: '⚡' },
    { rank: 5, name: 'Petra L.', xp: 7900, level: 'Pro', avatar: '🧘' },
  ];

  const navItems = [
    { id: 'feed' as const, label: locale === 'hr' ? 'Feed' : 'Feed', icon: '📱' },
    { id: 'match' as const, label: locale === 'hr' ? 'Upoznaj' : 'Match', icon: '🤝' },
    { id: 'challenges' as const, label: locale === 'hr' ? 'Izazovi' : 'Challenges', icon: '🏆' },
    { id: 'leaderboard' as const, label: locale === 'hr' ? 'Top' : 'Top', icon: '👑' },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Sub-nav */}
      <div className="flex gap-1">
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className="flex-1 py-2 rounded-xl text-[10px] font-bold cursor-pointer font-outfit border transition-colors"
            style={{
              background: view === n.id ? '#00f0b515' : 'rgba(255,255,255,0.03)',
              borderColor: view === n.id ? '#00f0b544' : 'rgba(255,255,255,0.06)',
              color: view === n.id ? '#00f0b5' : '#8b8fa3',
            }}
          >
            {n.icon} {n.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {view === 'feed' && posts.map((p) => (
        <Box key={p.id}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-lg">{p.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-fit-text">{p.name}</span>
                {p.verified && <span className="text-[10px]">✅</span>}
              </div>
              <div className="text-[9px] text-fit-dim">{p.time} {locale === 'hr' ? 'prije' : 'ago'}</div>
            </div>
            {p.sport && <span className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-fit-accent/10 text-fit-accent">{p.sport}</span>}
          </div>
          <div className="text-xs text-fit-text leading-relaxed mb-2">{p.text}</div>
          {p.stats && <div className="text-[11px] font-bold text-fit-gold py-1.5 px-3 rounded-lg bg-fit-gold/[0.08] mb-2">{p.stats}</div>}
          <div className="flex items-center gap-4">
            <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1 text-xs cursor-pointer bg-transparent border-none" style={{ color: p.liked ? '#ff4d8d' : '#8b8fa3' }}>
              {p.liked ? '❤️' : '🤍'} {p.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-fit-muted cursor-pointer bg-transparent border-none">💬 {locale === 'hr' ? 'Komentiraj' : 'Comment'}</button>
            <button className="flex items-center gap-1 text-xs text-fit-muted cursor-pointer bg-transparent border-none ml-auto">↗ {locale === 'hr' ? 'Podijeli' : 'Share'}</button>
          </div>
        </Box>
      ))}

      {/* Matchmaking */}
      {view === 'match' && (
        <>
          <Lbl icon="🤝" text={locale === 'hr' ? 'Ljudi u blizini' : 'People nearby'} color="#7c5cfc" />
          {matchPeople.map((p, i) => (
            <Box key={i}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-2xl">{p.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-fit-text">{p.name}</div>
                  <div className="text-[10px] text-fit-muted">{p.city} · {p.distance}</div>
                  <div className="flex gap-1 mt-1">
                    {p.sports.map((s, j) => <span key={j} className="text-sm">{s}</span>)}
                    <span className="text-[9px] text-fit-dim ml-1">{p.level}</span>
                  </div>
                </div>
                <button className="py-2 px-4 rounded-xl text-[10px] font-bold cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', color: '#fff' }}>
                  + {locale === 'hr' ? 'Prati' : 'Follow'}
                </button>
              </div>
              {p.mutual > 0 && <div className="text-[9px] text-fit-dim mt-1.5">{p.mutual} {locale === 'hr' ? 'zajedničkih prijatelja' : 'mutual friends'}</div>}
            </Box>
          ))}
        </>
      )}

      {/* Challenges */}
      {view === 'challenges' && challenges.map((ch, i) => (
        <Box key={i} glow="#ffc233">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{ch.badge}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-fit-text">{ch.name}</div>
              <div className="text-[10px] text-fit-muted">{ch.participants} {locale === 'hr' ? 'sudionika' : 'participants'} · {locale === 'hr' ? 'Nagrada' : 'Reward'}: {ch.reward}</div>
            </div>
          </div>
          <Bar pct={ch.progress} color="#ffc233" h={6} />
          <div className="text-[10px] text-fit-gold mt-1 font-bold">{ch.progress}%</div>
        </Box>
      ))}

      {/* Leaderboard */}
      {view === 'leaderboard' && (
        <Box glow="#ffc233">
          <Lbl icon="👑" text={locale === 'hr' ? 'Rang ljestvica' : 'Leaderboard'} color="#ffc233" />
          <div className="flex flex-col gap-2 mt-3">
            {leaderboard.map((u) => {
              const isMe = u.rank === 4;
              return (
                <div
                  key={u.rank}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all"
                  style={{
                    background: isMe ? '#00f0b510' : u.rank <= 3 ? '#ffc23308' : 'rgba(255,255,255,0.02)',
                    border: isMe ? '1px solid #00f0b533' : '1px solid transparent',
                  }}
                >
                  <div className="w-7 text-center font-black" style={{ color: u.rank <= 3 ? '#ffc233' : '#4a4e62' }}>
                    {u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank - 1] : `#${u.rank}`}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">{u.avatar}</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold" style={{ color: isMe ? '#00f0b5' : '#e8eaf0' }}>{u.name}</div>
                    <div className="text-[9px] text-fit-dim">{u.level}</div>
                  </div>
                  <div className="text-sm font-black text-fit-gold">{u.xp.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>
        </Box>
      )}
    </div>
  );
}
