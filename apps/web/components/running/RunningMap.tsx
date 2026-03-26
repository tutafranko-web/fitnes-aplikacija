'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';
import Bar from '@/components/ui/Bar';

interface GpsPoint {
  lat: number;
  lng: number;
  time: number;
  elevation?: number;
}

export default function RunningMap() {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [points, setPoints] = useState<GpsPoint[]>([]);
  const [distance, setDistance] = useState(0); // km
  const [duration, setDuration] = useState(0); // seconds
  const [pace, setPace] = useState('0:00');
  const [calories, setCalories] = useState(0);
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watchRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate distance between two GPS points (Haversine)
  const haversine = (p1: GpsPoint, p2: GpsPoint): number => {
    const R = 6371;
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((p1.lat * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Draw route on canvas
  const drawRoute = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Find bounds
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 20;
    const rangeX = maxLng - minLng || 0.001;
    const rangeY = maxLat - minLat || 0.001;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Route
    ctx.beginPath();
    ctx.strokeStyle = '#00f0b5';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#00f0b5';
    ctx.shadowBlur = 8;

    points.forEach((p, i) => {
      const x = padding + ((p.lng - minLng) / rangeX) * (w - padding * 2);
      const y = h - padding - ((p.lat - minLat) / rangeY) * (h - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Start point
    const sx = padding + ((points[0].lng - minLng) / rangeX) * (w - padding * 2);
    const sy = h - padding - ((points[0].lat - minLat) / rangeY) * (h - padding * 2);
    ctx.fillStyle = '#00f0b5';
    ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();

    // Current position
    const last = points[points.length - 1];
    const ex = padding + ((last.lng - minLng) / rangeX) * (w - padding * 2);
    const ey = h - padding - ((last.lat - minLat) / rangeY) * (h - padding * 2);
    ctx.fillStyle = '#3ea8ff';
    ctx.shadowColor = '#3ea8ff';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }, [points]);

  useEffect(() => { drawRoute(); }, [drawRoute]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError(hr ? 'GPS nije dostupan u ovom pregledniku' : 'GPS not available in this browser');
      return;
    }

    setTracking(true);
    setPaused(false);
    setPoints([]);
    setDistance(0);
    setDuration(0);

    // Timer
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);

    // GPS watch
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point: GpsPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: Date.now(),
          elevation: pos.coords.altitude || undefined,
        };
        setCurrentPos({ lat: point.lat, lng: point.lng });
        setPoints((prev) => {
          const next = [...prev, point];
          // Calculate total distance
          if (next.length >= 2) {
            let total = 0;
            for (let i = 1; i < next.length; i++) total += haversine(next[i - 1], next[i]);
            setDistance(Math.round(total * 100) / 100);
            setCalories(Math.round(total * 65)); // ~65 kcal/km
            // Pace
            const mins = (Date.now() - next[0].time) / 60000;
            if (total > 0.01) {
              const paceMin = mins / total;
              const p = Math.floor(paceMin);
              const s = Math.round((paceMin - p) * 60);
              setPace(`${p}:${s.toString().padStart(2, '0')}`);
            }
          }
          return next;
        });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopTracking = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setTracking(false);
  };

  const togglePause = () => {
    if (paused) {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    setPaused(!paused);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Box glow="#00f0b5">
      <Lbl icon="🏃" text={hr ? 'GPS Trčanje' : 'GPS Running'} color="#00f0b5" />

      {error && (
        <div className="text-xs text-fit-warn mt-2 p-2 rounded-xl bg-fit-warn/10">⚠️ {error}</div>
      )}

      {/* Map Canvas */}
      <div className="mt-2 rounded-xl overflow-hidden border border-fit-border/50 relative">
        <canvas ref={canvasRef} width={380} height={200} className="w-full" style={{ height: 200 }} />
        {!tracking && points.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0e1a]">
            <span className="text-3xl mb-2">🗺️</span>
            <span className="text-xs text-fit-muted">{hr ? 'Klikni Start za praćenje rute' : 'Click Start to track your route'}</span>
          </div>
        )}
        {currentPos && (
          <div className="absolute bottom-2 left-2 text-[8px] text-fit-dim bg-black/60 px-2 py-0.5 rounded">
            {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[
          { l: hr ? 'Udaljenost' : 'Distance', v: `${distance} km`, c: '#00f0b5' },
          { l: 'Tempo', v: `${pace} /km`, c: '#3ea8ff' },
          { l: hr ? 'Trajanje' : 'Duration', v: formatTime(duration), c: '#7c5cfc' },
          { l: hr ? 'Kalorije' : 'Calories', v: `${calories}`, c: '#ff6b4a' },
        ].map((s) => (
          <div key={s.l} className="text-center py-2 rounded-xl" style={{ background: `${s.c}08` }}>
            <div className="text-sm font-black" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[8px] text-fit-dim">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        {!tracking ? (
          <button onClick={startTracking}
            className="flex-1 py-3 rounded-xl text-sm font-black cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #00f0b5, #3ea8ff)', color: '#000' }}>
            ▶ {hr ? 'Pokreni trčanje' : 'Start run'}
          </button>
        ) : (
          <>
            <button onClick={togglePause}
              className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer border-none"
              style={{ background: paused ? '#00f0b520' : '#ffc23320', color: paused ? '#00f0b5' : '#ffc233' }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button onClick={stopTracking}
              className="py-3 px-6 rounded-xl text-sm font-bold cursor-pointer border-none bg-fit-warn/20 text-fit-warn">
              ⏹ Stop
            </button>
          </>
        )}
      </div>
    </Box>
  );
}
