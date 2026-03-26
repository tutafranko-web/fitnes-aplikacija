'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { useSocialStore, type SocialPost } from '@/lib/globalStore';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Lbl from '@/components/ui/Lbl';

export default function SocialTab() {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const { posts, stories, addPost, toggleLike } = useSocialStore();
  const [view, setView] = useState<'feed' | 'create' | 'match' | 'challenges' | 'leaderboard'>('feed');
  const [showStory, setShowStory] = useState<SocialPost | null>(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Create post state
  const [newPost, setNewPost] = useState({ text: '', sport: '', type: 'text' as 'text' | 'image' | 'video', media: '', isStory: false });

  // Seed demo posts on first load
  useEffect(() => {
    if (posts.length === 0) {
      const demoPosts: SocialPost[] = [
        { id: '1', name: 'Marko K.', avatar: '🏋️', type: 'text', text: hr ? 'Novi PR na bench pressu! 100kg × 3 reps. Put do 120kg nastavlja se! 💪' : 'New bench press PR! 100kg × 3 reps. Road to 120kg continues! 💪', sport: hr ? 'Teretana' : 'Gym', stats: 'Bench: 100kg × 3 — PR! 🏆', likes: 24, comments: 5, time: '2h', liked: false },
        { id: '2', name: 'Ana M.', avatar: '🏃', type: 'image', text: hr ? 'Jutarnje trčanje 8km uz more. Savršen tempo 5:20/km 🌅' : 'Morning 8km run by the sea. Perfect pace 5:20/km 🌅', media: '', sport: hr ? 'Trčanje' : 'Running', likes: 18, comments: 3, time: '4h', liked: true },
        { id: '3', name: 'Ivan B.', avatar: '🥊', type: 'video', text: hr ? 'MMA sparring sesija. 5 rundi, fokus na takedown obranu. 🥊' : 'MMA sparring session. 5 rounds, focus on takedown defense. 🥊', media: '', sport: 'MMA', likes: 31, comments: 8, time: '6h', liked: false },
        { id: '4', name: 'Petra L.', avatar: '🧘', type: 'text', text: hr ? '30 dana yoga challengea — dan 22! Flexibility je nevjerojatna sada 🧘‍♀️' : '30 day yoga challenge — day 22! Flexibility is incredible now 🧘‍♀️', sport: 'Yoga', likes: 42, comments: 12, time: '8h', liked: false },
        { id: '5', name: 'Luka P.', avatar: '🚴', type: 'image', text: hr ? '80km brdska ruta danas. Osjećaj kada dođeš na vrh je neusporediv! 🏔️' : '80km mountain route today. The feeling when you reach the top is incomparable! 🏔️', media: '', sport: hr ? 'Biciklizam' : 'Cycling', likes: 56, comments: 9, time: '12h', liked: false },
      ];
      const demoStories: SocialPost[] = [
        { id: 's1', name: 'Sara', avatar: '🧘', type: 'image', text: hr ? 'Jutarnja yoga 🌅' : 'Morning yoga 🌅', media: '', likes: 0, comments: 0, time: '1h', liked: false, isStory: true, sport: 'Yoga' },
        { id: 's2', name: 'Mate', avatar: '💪', type: 'image', text: hr ? 'Leg day! 🔥' : 'Leg day! 🔥', media: '', likes: 0, comments: 0, time: '3h', liked: false, isStory: true, sport: hr ? 'Teretana' : 'Gym' },
        { id: 's3', name: 'Lana', avatar: '💃', type: 'video', text: hr ? 'Dance cardio 🎵' : 'Dance cardio 🎵', media: '', likes: 0, comments: 0, time: '5h', liked: false, isStory: true, sport: 'Dance' },
      ];
      demoPosts.forEach((p) => addPost(p));
      demoStories.forEach((s) => addPost(s));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setNewPost((p) => ({ ...p, media: url, type }));
    }
  };

  const publishPost = () => {
    if (!newPost.text.trim() && !newPost.media) return;
    let profile: any = {};
    try { profile = JSON.parse(localStorage.getItem('fit-profile') || '{}'); } catch {}
    addPost({
      id: `p_${Date.now()}`,
      name: profile.name || 'Ti',
      avatar: '⚡',
      type: newPost.media ? newPost.type : 'text',
      text: newPost.text,
      media: newPost.media || undefined,
      sport: newPost.sport || undefined,
      likes: 0,
      comments: 0,
      time: hr ? 'upravo' : 'just now',
      liked: false,
      isStory: newPost.isStory,
    });
    setNewPost({ text: '', sport: '', type: 'text', media: '', isStory: false });
    setView('feed');
  };

  const matchPeople = [
    { name: 'Luka D.', avatar: '🏋️', city: 'Split', distance: '2.3 km', sports: ['🏋️', '🏃', '🥊'], level: hr ? 'Napredni' : 'Advanced', mutual: 3 },
    { name: 'Mia S.', avatar: '🏃', city: 'Zagreb', distance: '0.8 km', sports: ['🏃', '🧘', '🚴'], level: hr ? 'Srednji' : 'Intermediate', mutual: 1 },
    { name: 'Ante P.', avatar: '⚽', city: 'Split', distance: '4.1 km', sports: ['⚽', '🏋️'], level: hr ? 'Napredni' : 'Advanced', mutual: 5 },
    { name: 'Jana K.', avatar: '🧘', city: 'Rijeka', distance: '1.5 km', sports: ['🧘', '🏊'], level: hr ? 'Srednji' : 'Intermediate', mutual: 2 },
  ];

  const challenges = [
    { name: hr ? '100 Burpeesa / 7 dana' : '100 Burpees / 7 days', participants: 234, progress: 65, badge: '🔥', reward: 'Fire badge' },
    { name: hr ? 'Bench 100kg Club' : 'Bench 100kg Club', participants: 89, progress: 82, badge: '🏆', reward: hr ? '1 mj Pro' : '1 mo Pro' },
    { name: hr ? 'Mjesečni Maratonac' : 'Monthly Marathoner', participants: 156, progress: 40, badge: '🏃', reward: 'Runner badge' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Marko K.', xp: 12450, level: 'Titan', avatar: '🏋️' },
    { rank: 2, name: 'Ana M.', xp: 11200, level: 'Elite', avatar: '🏃' },
    { rank: 3, name: 'Ivan B.', xp: 10800, level: 'Elite', avatar: '🥊' },
    { rank: 4, name: hr ? 'Ti' : 'You', xp: 8420, level: 'Pro', avatar: '⚡' },
    { rank: 5, name: 'Petra L.', xp: 7900, level: 'Pro', avatar: '🧘' },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Story viewer overlay */}
      {showStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={() => setShowStory(null)}>
          <div className="w-full max-w-[430px] p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">{showStory.avatar}</div>
              <div>
                <div className="text-sm font-bold text-white">{showStory.name}</div>
                <div className="text-[10px] text-white/50">{showStory.time} {hr ? 'prije' : 'ago'}</div>
              </div>
              <button onClick={() => setShowStory(null)} className="ml-auto text-white/60 text-xl bg-transparent border-none cursor-pointer">✕</button>
            </div>
            {/* Story progress bar */}
            <div className="flex gap-1 mb-4">
              {stories.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i <= storyIdx ? '#fff' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">{showStory.avatar}</div>
              <div className="text-lg font-bold text-white">{showStory.text}</div>
              {showStory.sport && <div className="text-sm text-fit-accent mt-2">{showStory.sport}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Stories row */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {/* Add story button */}
        <button onClick={() => { setNewPost((p) => ({ ...p, isStory: true })); setView('create'); }}
          className="shrink-0 w-16 flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-fit-accent/40 flex items-center justify-center text-xl bg-fit-accent/10">+</div>
          <span className="text-[9px] text-fit-muted">{hr ? 'Tvoj story' : 'Your story'}</span>
        </button>
        {stories.map((s, i) => (
          <button key={s.id} onClick={() => { setShowStory(s); setStoryIdx(i); }}
            className="shrink-0 w-16 flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', padding: 2 }}>
              <div className="w-full h-full rounded-full bg-fit-bg flex items-center justify-center text-xl">{s.avatar}</div>
            </div>
            <span className="text-[9px] text-fit-muted truncate max-w-[60px]">{s.name}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-1">
        {[
          { id: 'feed' as const, l: 'Feed', icon: '📱' },
          { id: 'create' as const, l: hr ? 'Objavi' : 'Post', icon: '➕' },
          { id: 'match' as const, l: hr ? 'Ljudi' : 'People', icon: '🤝' },
          { id: 'challenges' as const, l: hr ? 'Izazovi' : 'Challenges', icon: '🏆' },
          { id: 'leaderboard' as const, l: 'Top', icon: '👑' },
        ].map((n) => (
          <button key={n.id} onClick={() => setView(n.id)}
            className="flex-1 py-2 rounded-xl text-[9px] font-bold cursor-pointer font-outfit border transition-colors"
            style={{
              background: view === n.id ? '#00f0b515' : 'rgba(255,255,255,0.03)',
              borderColor: view === n.id ? '#00f0b544' : 'rgba(255,255,255,0.06)',
              color: view === n.id ? '#00f0b5' : '#8b8fa3',
            }}>{n.icon} {n.l}</button>
        ))}
      </div>

      {/* Create Post / Story */}
      {view === 'create' && (
        <Box glow="#7c5cfc">
          <Lbl icon="✏️" text={newPost.isStory ? (hr ? 'Novi story' : 'New story') : (hr ? 'Nova objava' : 'New post')} color="#7c5cfc" />

          {/* Toggle post/story */}
          <div className="flex gap-2 mt-2 mb-3">
            <button onClick={() => setNewPost((p) => ({ ...p, isStory: false }))}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold cursor-pointer border"
              style={{ background: !newPost.isStory ? '#7c5cfc20' : 'transparent', borderColor: !newPost.isStory ? '#7c5cfc55' : 'rgba(255,255,255,0.06)', color: !newPost.isStory ? '#7c5cfc' : '#8b8fa3' }}>
              📱 {hr ? 'Objava' : 'Post'}
            </button>
            <button onClick={() => setNewPost((p) => ({ ...p, isStory: true }))}
              className="flex-1 py-2 rounded-xl text-[10px] font-bold cursor-pointer border"
              style={{ background: newPost.isStory ? '#ff4d8d20' : 'transparent', borderColor: newPost.isStory ? '#ff4d8d55' : 'rgba(255,255,255,0.06)', color: newPost.isStory ? '#ff4d8d' : '#8b8fa3' }}>
              ⏱ Story
            </button>
          </div>

          <textarea value={newPost.text} onChange={(e) => setNewPost((p) => ({ ...p, text: e.target.value }))}
            placeholder={hr ? 'Što imaš za reći? Podijeli trening, napredak, motivaciju...' : 'What do you want to share? Workout, progress, motivation...'}
            className="w-full bg-white/[0.04] border border-fit-border rounded-xl py-3 px-4 text-fit-text text-xs outline-none font-outfit h-24 resize-none focus:border-fit-secondary/30" />

          {/* Media preview */}
          {newPost.media && (
            <div className="mt-2 relative">
              {newPost.type === 'video' ? (
                <video src={newPost.media} controls className="w-full rounded-xl max-h-48 object-cover" />
              ) : (
                <div className="w-full h-48 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${newPost.media})` }} />
              )}
              <button onClick={() => setNewPost((p) => ({ ...p, media: '', type: 'text' }))}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center cursor-pointer border-none">✕</button>
            </div>
          )}

          {/* Media buttons */}
          <div className="flex gap-2 mt-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'image')} className="hidden" />
            <input ref={videoRef} type="file" accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="flex-1 py-2.5 rounded-xl text-[10px] font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted hover:text-fit-accent transition-colors">
              📸 {hr ? 'Slika' : 'Photo'}
            </button>
            <button onClick={() => videoRef.current?.click()} className="flex-1 py-2.5 rounded-xl text-[10px] font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted hover:text-fit-accent transition-colors">
              🎬 Video
            </button>
          </div>

          {/* Sport tag */}
          <div className="flex gap-1 flex-wrap mt-2">
            {['Gym', 'Running', 'MMA', 'Yoga', 'CrossFit', 'Cycling'].map((s) => (
              <button key={s} onClick={() => setNewPost((p) => ({ ...p, sport: p.sport === s ? '' : s }))}
                className="text-[9px] py-1 px-2 rounded-full cursor-pointer border"
                style={{
                  background: newPost.sport === s ? '#00f0b515' : 'transparent',
                  borderColor: newPost.sport === s ? '#00f0b555' : 'rgba(255,255,255,0.06)',
                  color: newPost.sport === s ? '#00f0b5' : '#8b8fa3',
                }}>#{s}</button>
            ))}
          </div>

          <button onClick={publishPost} disabled={!newPost.text.trim() && !newPost.media}
            className="w-full mt-3 py-3 rounded-xl text-sm font-black cursor-pointer border-none transition-all"
            style={{
              background: (newPost.text.trim() || newPost.media) ? 'linear-gradient(135deg, #7c5cfc, #ff4d8d)' : 'rgba(255,255,255,0.04)',
              color: (newPost.text.trim() || newPost.media) ? '#fff' : '#4a4e62',
            }}>
            {newPost.isStory ? '⏱' : '📤'} {hr ? 'Objavi' : 'Publish'}
          </button>
        </Box>
      )}

      {/* Feed */}
      {view === 'feed' && posts.map((p) => (
        <Box key={p.id}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-lg">{p.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-fit-text">{p.name}</span>
                {p.type !== 'text' && <span className="text-[8px] text-fit-secondary">{p.type === 'video' ? '🎬' : '📸'}</span>}
              </div>
              <div className="text-[9px] text-fit-dim">{p.time} {hr ? 'prije' : 'ago'}</div>
            </div>
            {p.sport && <span className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-fit-accent/10 text-fit-accent">#{p.sport}</span>}
          </div>

          <div className="text-xs text-fit-text leading-relaxed mb-2">{p.text}</div>

          {/* Media */}
          {p.media && p.type === 'image' && (
            <div className="w-full h-48 rounded-xl bg-white/[0.04] mb-2 flex items-center justify-center text-4xl">📸</div>
          )}
          {p.media && p.type === 'video' && (
            <div className="w-full h-48 rounded-xl bg-white/[0.04] mb-2 flex items-center justify-center text-4xl">🎬</div>
          )}

          {p.stats && <div className="text-[11px] font-bold text-fit-gold py-1.5 px-3 rounded-lg bg-fit-gold/[0.08] mb-2">{p.stats}</div>}

          <div className="flex items-center gap-4 pt-1 border-t border-fit-border/30">
            <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1 text-xs cursor-pointer bg-transparent border-none transition-colors" style={{ color: p.liked ? '#ff4d8d' : '#8b8fa3' }}>
              {p.liked ? '❤️' : '🤍'} {p.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-fit-muted cursor-pointer bg-transparent border-none">
              💬 {p.comments}
            </button>
            <button className="flex items-center gap-1 text-xs text-fit-muted cursor-pointer bg-transparent border-none ml-auto">
              ↗ {hr ? 'Podijeli' : 'Share'}
            </button>
          </div>
        </Box>
      ))}

      {/* Matchmaking */}
      {view === 'match' && (
        <>
          <Lbl icon="🤝" text={hr ? 'Ljudi u blizini' : 'People nearby'} color="#7c5cfc" />
          {matchPeople.map((p, i) => (
            <Box key={i}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-2xl">{p.avatar}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-fit-text">{p.name}</div>
                  <div className="text-[10px] text-fit-muted">{p.city} · {p.distance}</div>
                  <div className="flex gap-1 mt-1">{p.sports.map((s, j) => <span key={j}>{s}</span>)} <span className="text-[9px] text-fit-dim ml-1">{p.level}</span></div>
                </div>
                <button className="py-2 px-4 rounded-xl text-[10px] font-bold cursor-pointer border-none" style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', color: '#fff' }}>
                  + {hr ? 'Prati' : 'Follow'}
                </button>
              </div>
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
              <div className="text-[10px] text-fit-muted">{ch.participants} {hr ? 'sudionika' : 'participants'} · {ch.reward}</div>
            </div>
          </div>
          <Bar pct={ch.progress} color="#ffc233" h={6} />
          <div className="text-[10px] text-fit-gold mt-1 font-bold">{ch.progress}%</div>
        </Box>
      ))}

      {/* Leaderboard */}
      {view === 'leaderboard' && (
        <Box glow="#ffc233">
          <Lbl icon="👑" text={hr ? 'Rang ljestvica' : 'Leaderboard'} color="#ffc233" />
          <div className="flex flex-col gap-2 mt-3">
            {leaderboard.map((u) => {
              const isMe = u.rank === 4;
              return (
                <div key={u.rank} className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                  style={{ background: isMe ? '#00f0b510' : u.rank <= 3 ? '#ffc23308' : 'rgba(255,255,255,0.02)', border: isMe ? '1px solid #00f0b533' : '1px solid transparent' }}>
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
