'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { useSpotStore, EQUIPMENT_OPTIONS, type WorkoutSpot } from '@/lib/workoutSpotsStore';
import { useCoinStore, COIN_REWARDS } from '@/lib/gamificationStore';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';

// Leaflet-free map — pure CSS/SVG interactive map with list view
// (Real Leaflet/Google Maps would need API keys + heavy bundle)

const BALKANS_BOUNDS = { minLat: 41.5, maxLat: 46.5, minLng: 13.5, maxLng: 21.0 };

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BALKANS_BOUNDS.minLng) / (BALKANS_BOUNDS.maxLng - BALKANS_BOUNDS.minLng)) * w;
  const y = ((BALKANS_BOUNDS.maxLat - lat) / (BALKANS_BOUNDS.maxLat - BALKANS_BOUNDS.minLat)) * h;
  return { x, y };
}

export default function StreetWorkoutMap() {
  const locale = useLocaleStore(s => s.locale);
  const hr = locale === 'hr';
  const store = useSpotStore();
  const coins = useCoinStore();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [addingSpot, setAddingSpot] = useState(false);
  const [spotDetail, setSpotDetail] = useState<WorkoutSpot | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // New spot form
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newEquipment, setNewEquipment] = useState<string[]>([]);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    store.init();
    coins.init();
  }, []);

  const filtered = store.getFiltered();
  const cities = store.getCities();

  const handleAddSpot = () => {
    if (!newName || !newCity) return;

    // Generate approximate coords based on city
    const cityCoords: Record<string, [number, number]> = {
      Split: [43.508, 16.44], Zagreb: [45.815, 15.97], Beograd: [44.787, 20.457],
      Sarajevo: [43.856, 18.413], Ljubljana: [46.056, 14.508], Rijeka: [45.327, 14.442],
      Osijek: [45.551, 18.694], Mostar: [43.343, 17.808], 'Novi Sad': [45.252, 19.837],
      Zadar: [44.119, 15.231], Pula: [44.867, 13.849], Dubrovnik: [42.649, 18.094],
      Podgorica: [42.443, 19.264], Maribor: [46.558, 15.646], 'Banja Luka': [44.772, 17.191],
    };
    const coords = cityCoords[newCity] || [43.5 + Math.random() * 3, 15 + Math.random() * 5];

    store.addSpot({
      name: newName,
      lat: coords[0] + (Math.random() - 0.5) * 0.01,
      lng: coords[1] + (Math.random() - 0.5) * 0.01,
      address: newAddress || newCity,
      city: newCity,
      country: newCity === 'Beograd' || newCity === 'Novi Sad' ? 'RS' : newCity === 'Sarajevo' || newCity === 'Mostar' || newCity === 'Banja Luka' ? 'BA' : newCity === 'Ljubljana' || newCity === 'Maribor' ? 'SI' : newCity === 'Podgorica' ? 'ME' : 'HR',
      equipment: newEquipment,
      photos: newPhoto ? [newPhoto] : [],
      addedBy: 'Korisnik',
    });

    coins.earn(COIN_REWARDS.SPOT_ADDED, hr ? 'Spot dodan na mapu' : 'Spot added to map');
    setAddingSpot(false);
    setNewName(''); setNewCity(''); setNewAddress(''); setNewEquipment([]); setNewPhoto(null);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setNewPhoto(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const submitReview = () => {
    if (!spotDetail || !reviewText.trim()) return;
    store.addReview(spotDetail.id, {
      userId: 'me',
      userName: hr ? 'Ti' : 'You',
      rating: reviewRating,
      comment: reviewText,
    });
    setReviewText('');
    // Refresh detail
    const updated = store.spots.find(s => s.id === spotDetail.id);
    if (updated) setSpotDetail(updated);
  };

  const getEquipmentLabel = (id: string) => {
    const eq = EQUIPMENT_OPTIONS.find(e => e.id === id);
    return eq ? `${eq.icon} ${hr ? eq.hr : eq.en}` : id;
  };

  // ── SPOT DETAIL BOTTOM SHEET ──
  if (spotDetail) {
    return (
      <div className="flex flex-col gap-3">
        <button onClick={() => setSpotDetail(null)} className="text-left text-fit-accent text-xs font-bold cursor-pointer bg-transparent border-none p-0">
          ← {hr ? 'Natrag na mapu' : 'Back to map'}
        </button>

        <Box glow={spotDetail.verified ? '#00f0b5' : '#ffc233'}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-black text-fit-text">{spotDetail.name}</div>
              <div className="text-[11px] text-fit-dim mt-0.5">{spotDetail.address}, {spotDetail.city}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-[#ffd700]">⭐ {spotDetail.avgRating || '—'}</div>
              <div className="text-[9px] text-fit-dim">{spotDetail.reviewCount} {hr ? 'recenzija' : 'reviews'}</div>
            </div>
          </div>

          {spotDetail.verified && (
            <div className="mt-2 text-[10px] text-fit-accent font-bold">✅ {hr ? 'Verificirani spot' : 'Verified spot'}</div>
          )}

          {/* Equipment */}
          <div className="mt-3">
            <div className="text-[10px] text-fit-dim font-bold mb-1.5">{hr ? 'OPREMA' : 'EQUIPMENT'}</div>
            <div className="flex flex-wrap gap-1">
              {spotDetail.equipment.map(eq => (
                <span key={eq} className="text-[9px] px-2 py-0.5 rounded-full bg-fit-accent/10 text-fit-accent font-semibold">
                  {getEquipmentLabel(eq)}
                </span>
              ))}
            </div>
          </div>
        </Box>

        {/* Reviews */}
        <Box>
          <Lbl icon="💬" text={hr ? 'Recenzije' : 'Reviews'} />

          {spotDetail.reviews.length === 0 && (
            <div className="text-[11px] text-fit-dim py-4 text-center">{hr ? 'Nema recenzija. Budi prvi!' : 'No reviews yet. Be first!'}</div>
          )}

          {spotDetail.reviews.map(r => (
            <div key={r.id} className="py-2.5 border-b border-fit-border last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-fit-text">{r.userName}</span>
                <span className="text-[10px] text-[#ffd700]">{'⭐'.repeat(r.rating)}</span>
              </div>
              <div className="text-[11px] text-fit-muted mt-1">{r.comment}</div>
            </div>
          ))}

          {/* Add review */}
          <div className="mt-3 pt-3 border-t border-fit-border">
            <div className="text-[10px] text-fit-dim font-bold mb-2">{hr ? 'Dodaj recenziju' : 'Add review'}</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(r => (
                <button key={r} onClick={() => setReviewRating(r)}
                  className="text-lg cursor-pointer bg-transparent border-none p-0"
                  style={{ opacity: r <= reviewRating ? 1 : 0.2 }}>
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder={hr ? 'Tvoje iskustvo...' : 'Your experience...'}
              className="w-full p-2.5 rounded-xl text-[11px] text-fit-text bg-white/[0.02] border border-fit-border resize-none outline-none font-outfit"
              rows={2}
            />
            <button onClick={submitReview}
              className="mt-2 w-full py-2 rounded-xl text-xs font-bold cursor-pointer border-none"
              style={{ background: 'linear-gradient(135deg, #00f0b5, #7c5cfc)', color: '#fff' }}>
              {hr ? 'Objavi recenziju' : 'Post review'}
            </button>
          </div>
        </Box>
      </div>
    );
  }

  // ── ADD SPOT FORM ──
  if (addingSpot) {
    return (
      <div className="flex flex-col gap-3">
        <button onClick={() => setAddingSpot(false)} className="text-left text-fit-accent text-xs font-bold cursor-pointer bg-transparent border-none p-0">
          ← {hr ? 'Natrag' : 'Back'}
        </button>

        <Box glow="#00f0b5">
          <Lbl icon="📍" text={hr ? 'Dodaj novi spot' : 'Add new spot'} color="#00f0b5" />

          <div className="flex flex-col gap-2.5 mt-3">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder={hr ? 'Naziv spota *' : 'Spot name *'}
              className="w-full p-2.5 rounded-xl text-[12px] text-fit-text bg-white/[0.02] border border-fit-border outline-none font-outfit" />

            <select value={newCity} onChange={e => setNewCity(e.target.value)}
              className="w-full p-2.5 rounded-xl text-[12px] text-fit-text bg-[#0c0c18] border border-fit-border outline-none font-outfit">
              <option value="">{hr ? 'Odaberi grad *' : 'Select city *'}</option>
              {['Split', 'Zagreb', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Dubrovnik', 'Beograd', 'Novi Sad', 'Sarajevo', 'Mostar', 'Banja Luka', 'Ljubljana', 'Maribor', 'Podgorica'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input value={newAddress} onChange={e => setNewAddress(e.target.value)}
              placeholder={hr ? 'Adresa / lokacija' : 'Address / location'}
              className="w-full p-2.5 rounded-xl text-[12px] text-fit-text bg-white/[0.02] border border-fit-border outline-none font-outfit" />

            {/* Equipment checklist */}
            <div className="text-[10px] text-fit-dim font-bold mt-1">{hr ? 'OPREMA' : 'EQUIPMENT'}</div>
            <div className="flex flex-wrap gap-1.5">
              {EQUIPMENT_OPTIONS.map(eq => {
                const active = newEquipment.includes(eq.id);
                return (
                  <button key={eq.id}
                    onClick={() => setNewEquipment(prev => active ? prev.filter(e => e !== eq.id) : [...prev, eq.id])}
                    className="px-2 py-1 rounded-lg text-[9px] font-semibold cursor-pointer transition-all font-outfit"
                    style={{
                      background: active ? '#00f0b515' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? '#00f0b540' : 'rgba(255,255,255,0.06)'}`,
                      color: active ? '#00f0b5' : '#556',
                    }}>
                    {eq.icon} {hr ? eq.hr : eq.en}
                  </button>
                );
              })}
            </div>

            {/* Photo */}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-xl border-2 border-dashed text-xs text-fit-dim font-bold cursor-pointer bg-transparent font-outfit"
              style={{ borderColor: newPhoto ? '#00f0b540' : 'rgba(255,255,255,0.06)' }}>
              {newPhoto ? `✅ ${hr ? 'Slika dodana' : 'Photo added'}` : `📸 ${hr ? 'Dodaj sliku' : 'Add photo'}`}
            </button>

            <button onClick={handleAddSpot}
              disabled={!newName || !newCity}
              className="w-full py-3 rounded-xl text-sm font-black cursor-pointer border-none disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #00f0b5, #7c5cfc)', color: '#fff' }}>
              📍 {hr ? 'Dodaj spot' : 'Add spot'} (+{COIN_REWARDS.SPOT_ADDED} 🪙)
            </button>
          </div>
        </Box>
      </div>
    );
  }

  // ── MAIN MAP VIEW ──
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-fit-text">🗺️ {hr ? 'Street Workout Mapa' : 'Street Workout Map'}</div>
          <div className="text-[10px] text-fit-dim">{filtered.length} {hr ? 'spotova' : 'spots'} · {cities.length} {hr ? 'gradova' : 'cities'}</div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setView(view === 'map' ? 'list' : 'map')}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer border font-outfit"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#aaa' }}>
            {view === 'map' ? '📋' : '🗺️'}
          </button>
          <button onClick={() => setAddingSpot(true)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer border-none font-outfit"
            style={{ background: '#00f0b520', color: '#00f0b5' }}>
            + {hr ? 'Dodaj' : 'Add'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => store.setFilterCity('')}
          className="px-2.5 py-1 rounded-full text-[9px] font-bold cursor-pointer whitespace-nowrap shrink-0 font-outfit"
          style={{ background: !store.filterCity ? '#00f0b520' : 'rgba(255,255,255,0.03)', color: !store.filterCity ? '#00f0b5' : '#556', border: `1px solid ${!store.filterCity ? '#00f0b530' : 'rgba(255,255,255,0.05)'}` }}>
          {hr ? 'Svi gradovi' : 'All cities'}
        </button>
        {cities.map(c => (
          <button key={c} onClick={() => store.setFilterCity(store.filterCity === c ? '' : c)}
            className="px-2.5 py-1 rounded-full text-[9px] font-bold cursor-pointer whitespace-nowrap shrink-0 font-outfit"
            style={{ background: store.filterCity === c ? '#7c5cfc20' : 'rgba(255,255,255,0.03)', color: store.filterCity === c ? '#7c5cfc' : '#556', border: `1px solid ${store.filterCity === c ? '#7c5cfc30' : 'rgba(255,255,255,0.05)'}` }}>
            {c}
          </button>
        ))}
      </div>

      {/* SVG Map View */}
      {view === 'map' && (
        <Box>
          <div className="relative rounded-xl overflow-hidden" style={{ background: '#0a0a1a', height: 320 }}>
            <svg viewBox="0 0 400 260" className="w-full h-full">
              {/* Sea background */}
              <rect width="400" height="260" fill="#0a1628" />

              {/* Simplified Balkans coastline */}
              <path d="M0,40 L40,30 L80,50 L100,80 L90,120 L70,140 L60,160 L80,180 L100,200 L120,220 L140,230 L160,240 L180,260 L0,260Z" fill="#0f1a2e" opacity=".5" />
              <path d="M40,0 L80,10 L120,0 L160,10 L200,20 L240,10 L280,20 L320,30 L360,20 L400,30 L400,260 L180,260 L160,240 L140,230 L120,220 L100,200 L80,180 L60,160 L70,140 L90,120 L100,80 L80,50 L40,30Z" fill="#111822" />

              {/* Country labels */}
              <text x="200" y="60" fill="#222a3a" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="Outfit">SLO</text>
              <text x="250" y="100" fill="#222a3a" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="Outfit">HRVATSKA</text>
              <text x="340" y="80" fill="#222a3a" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="Outfit">HUN</text>
              <text x="320" y="150" fill="#222a3a" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Outfit">SRBIJA</text>
              <text x="220" y="180" fill="#222a3a" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Outfit">BiH</text>
              <text x="270" y="230" fill="#222a3a" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="Outfit">CG</text>

              {/* Spot dots */}
              {filtered.map(spot => {
                const { x, y } = latLngToXY(spot.lat, spot.lng, 400, 260);
                const isSelected = store.selectedSpot?.id === spot.id;
                return (
                  <g key={spot.id} onClick={() => setSpotDetail(spot)} className="cursor-pointer">
                    {/* Glow ring */}
                    <circle cx={x} cy={y} r={isSelected ? 10 : 6} fill={spot.verified ? '#00f0b5' : '#ffc233'} opacity=".15">
                      <animate attributeName="r" values={isSelected ? '10;14;10' : '6;9;6'} dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Dot */}
                    <circle cx={x} cy={y} r={isSelected ? 5 : 3.5}
                      fill={spot.verified ? '#00f0b5' : '#ffc233'}
                      stroke="#0c0c18" strokeWidth="1.5" />
                    {/* Label */}
                    <text x={x} y={y - 8} fill="#aab" fontSize="5" fontWeight="700" textAnchor="middle" fontFamily="Outfit">
                      {spot.city}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex gap-2">
              <div className="flex items-center gap-1 text-[8px] text-fit-dim">
                <div className="w-2 h-2 rounded-full bg-fit-accent" /> {hr ? 'Verificiran' : 'Verified'}
              </div>
              <div className="flex items-center gap-1 text-[8px] text-fit-dim">
                <div className="w-2 h-2 rounded-full bg-fit-gold" /> Community
              </div>
            </div>
          </div>
        </Box>
      )}

      {/* List View */}
      <div className="flex flex-col gap-2">
        {filtered.map(spot => (
          <div key={spot.id} onClick={() => setSpotDetail(spot)}
            className="p-3 rounded-xl cursor-pointer transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  {spot.verified && <span className="text-[9px] text-fit-accent">✅</span>}
                  <span className="text-[12px] font-bold text-fit-text">{spot.name}</span>
                </div>
                <div className="text-[10px] text-fit-dim mt-0.5">📍 {spot.city}, {spot.country}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {spot.equipment.slice(0, 5).map(eq => {
                    const opt = EQUIPMENT_OPTIONS.find(e => e.id === eq);
                    return (
                      <span key={eq} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.03] text-fit-dim">
                        {opt?.icon}
                      </span>
                    );
                  })}
                  {spot.equipment.length > 5 && (
                    <span className="text-[8px] text-fit-dim">+{spot.equipment.length - 5}</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="text-sm font-black text-[#ffd700]">⭐ {spot.avgRating || '—'}</div>
                <div className="text-[8px] text-fit-dim">{spot.reviewCount} {hr ? 'rec.' : 'rev.'}</div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-fit-dim">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-xs">{hr ? 'Nema spotova s ovim filterima' : 'No spots match these filters'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
