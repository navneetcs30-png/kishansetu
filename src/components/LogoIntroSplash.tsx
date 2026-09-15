import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Sparkles, ArrowRight, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

interface LogoIntroSplashProps {
  onComplete: () => void;
}

export const LogoIntroSplash: React.FC<LogoIntroSplashProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Status message sequence
  const statusMessages = [
    { text: 'Initializing Digital Agricultural Highway...', icon: Sprout },
    { text: 'Connecting Supabase Cloud PostgreSQL...', icon: Database },
    { text: 'Syncing National Mandi & MSP Benchmarks...', icon: Sparkles },
    { text: 'Securing Gateway • Soil to Sale', icon: ShieldCheck },
  ];
  const [statusIndex, setStatusIndex] = useState(0);

  // Background floating golden/emerald firefly particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      alphaChange: number;
    }

    const particles: Particle[] = [];
    const colors = ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#059669', '#6ee7b7'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.2, // Drift upward like golden harvest spores
        alpha: Math.random() * 0.7 + 0.2,
        alphaChange: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial ambient glow in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      gradient.addColorStop(0.5, 'rgba(6, 78, 59, 0.06)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render floating particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaChange;

        if (p.alpha <= 0.15 || p.alpha >= 0.85) {
          p.alphaChange = -p.alphaChange;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Main animation timeline (total ~2.6s)
  useEffect(() => {
    // Phase 1 -> 2
    const t1 = setTimeout(() => setPhase(2), 600);
    // Phase 2 -> 3
    const t2 = setTimeout(() => setPhase(3), 1300);
    // Phase 3 -> 4 (ready to fade)
    const t3 = setTimeout(() => setPhase(4), 2100);

    // Progress bar runner
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 45);

    // Status message cycling
    const m1 = setTimeout(() => setStatusIndex(1), 650);
    const m2 = setTimeout(() => setStatusIndex(2), 1250);
    const m3 = setTimeout(() => setStatusIndex(3), 1850);

    // Complete transition
    const tComplete = setTimeout(() => {
      triggerExit();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(m1);
      clearTimeout(m2);
      clearTimeout(m3);
      clearTimeout(tComplete);
      clearInterval(interval);
    };
  }, []);

  const triggerExit = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  const CurrentStatusIcon = statusMessages[statusIndex]?.icon || Sprout;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white select-none transition-all duration-500 ease-out overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Decorative Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Skip Button */}
      <button
        type="button"
        onClick={triggerExit}
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-emerald-300 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-md transition-all cursor-pointer shadow-lg"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Central Animated Emblem Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Animated Emblem Badge */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulsing Backlight Glow */}
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-400/20 to-amber-500/20 blur-2xl animate-pulse" />

          {/* Outer Orbital Orbit Ring (SVG) */}
          <svg className="w-36 h-36 relative animate-[spin_16s_linear_infinite]" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r="68"
              fill="none"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="1"
              strokeDasharray="20 40 10 30"
            />
          </svg>

          {/* Center Glass Hexagon Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-900/90 via-slate-900/90 to-teal-900/80 border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.35)] flex items-center justify-center backdrop-blur-md transition-all duration-700">
              
              {/* Dynamic Animated Logo SVG: Wheat & Highway Bridge (Setu) */}
              <svg 
                className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" 
                viewBox="0 0 64 64" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Bridge Arch (Setu) Base Foundation */}
                <path
                  d="M12 48C18 36 46 36 52 48"
                  stroke="url(#bridgeGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{
                    strokeDasharray: 60,
                    strokeDashoffset: phase >= 1 ? 0 : 60,
                    transition: 'stroke-dashoffset 0.8s ease-out',
                  }}
                />
                <path
                  d="M20 48V42M32 48V38M44 48V42"
                  stroke="url(#bridgeGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={phase >= 2 ? 0.8 : 0}
                  style={{ transition: 'opacity 0.6s ease' }}
                />

                {/* 2. Golden Sprout & Wheat Stalk (Kishan) growing from center */}
                <path
                  d="M32 40V14"
                  stroke="url(#wheatGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 30,
                    strokeDashoffset: phase >= 2 ? 0 : 30,
                    transition: 'stroke-dashoffset 0.7s ease-out',
                  }}
                />

                {/* Left Leaf / Grain */}
                <path
                  d="M32 28C26 25 24 18 32 16C32 22 28 26 32 28Z"
                  fill="url(#leafGrad)"
                  opacity={phase >= 2 ? 1 : 0}
                  style={{
                    transform: phase >= 2 ? 'scale(1)' : 'scale(0.3)',
                    transformOrigin: '32px 28px',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                />

                {/* Right Leaf / Grain */}
                <path
                  d="M32 22C38 19 40 12 32 10C32 16 36 20 32 22Z"
                  fill="url(#leafGrad2)"
                  opacity={phase >= 2 ? 1 : 0}
                  style={{
                    transform: phase >= 2 ? 'scale(1)' : 'scale(0.3)',
                    transformOrigin: '32px 22px',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s',
                  }}
                />

                {/* Golden Sun Sprout Crown Top */}
                <circle
                  cx="32"
                  cy="12"
                  r="3.5"
                  fill="#fbbf24"
                  opacity={phase >= 3 ? 1 : 0}
                  style={{
                    transform: phase >= 3 ? 'scale(1)' : 'scale(0)',
                    transformOrigin: '32px 12px',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
                  }}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="bridgeGrad" x1="12" y1="48" x2="52" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10b981" />
                    <stop offset="0.5" stopColor="#34d399" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="wheatGrad" x1="32" y1="40" x2="32" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#059669" />
                    <stop offset="0.6" stopColor="#10b981" />
                    <stop offset="1" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="leafGrad" x1="24" y1="16" x2="32" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="leafGrad2" x1="40" y1="10" x2="32" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>

            </div>
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className={`transition-all duration-700 transform ${
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              Kishan<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Setu</span>
            </span>
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 text-emerald-400/90 font-medium text-sm tracking-wide">
            <span>किसान सेतु</span>
            <span>•</span>
            <span className="text-amber-400/90 font-semibold">Agri-Tech Highway</span>
          </div>

          <p className="mt-2 text-xs text-slate-400 tracking-wide font-normal max-w-xs mx-auto">
            Unified Digital Agricultural Highway connecting Farmers, Mandis, Consumers & Agribusinesses
          </p>
        </div>

        {/* Progress & Live Sync Status Indicator */}
        <div className={`w-full mt-7 transition-all duration-500 ${
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {/* Sleek Gradient Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 p-0.5 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
            <CurrentStatusIcon className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span className="transition-all duration-300">
              {statusMessages[statusIndex]?.text || 'Loading...'}
            </span>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Supabase Live
          </span>
          <span>•</span>
          <span>APMC Mandis</span>
          <span>•</span>
          <span>Government MSP</span>
        </div>

      </div>
    </div>
  );
};
