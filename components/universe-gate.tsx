'use client';

/* eslint-disable next/no-img-element */

import { useEffect, useState } from 'react';
import { ArrowRight, FastForward, Sparkles } from 'lucide-react';

type UniverseGateProps = {
  logoSrc: string;
  onEnter?: (withSound: boolean) => void;
};

export function UniverseGate({ logoSrc, onEnter }: UniverseGateProps) {
  const [phase, setPhase] = useState<'checking' | 'ready' | 'departing' | 'hidden'>('checking');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visited = window.sessionStorage.getItem('innovation-universe-entered') === '1';
    const frame = window.requestAnimationFrame(() => setPhase(reduced || visited ? 'hidden' : 'ready'));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase === 'hidden') return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previousOverflow; };
  }, [phase]);

  const finish = (withSound: boolean) => {
    window.sessionStorage.setItem('innovation-universe-entered', '1');
    onEnter?.(withSound);
    if (!withSound) {
      setPhase('hidden');
      return;
    }
    setPhase('departing');
    window.setTimeout(() => setPhase('hidden'), 1180);
  };

  if (phase === 'hidden') return null;

  return (
    <dialog open className={`universe-gate is-${phase}`} aria-modal="true" aria-labelledby="universe-gate-title">
      <div className="gate-stars" aria-hidden="true" />
      <div className="gate-aperture" aria-hidden="true"><i /><i /><i /></div>
      <div className="gate-console">
        <div className="gate-status"><Sparkles /> GDPU SIMULATION SYSTEM <span>ONLINE</span></div>
        <div className="gate-core">
          <span className="gate-ring ring-a" />
          <span className="gate-ring ring-b" />
          <span className="gate-ring ring-c" />
          <img src={logoSrc} alt="广东药科大学创新实践协会会徽" />
        </div>
        <p className="gate-kicker">INNOVATION UNIVERSE · 2026</p>
        <h1 id="universe-gate-title">创新宇宙<br /><em>连接完成</em></h1>
        <p className="gate-copy">将好奇心作为坐标，把想法焊成现实。</p>
        <div className="gate-progress" aria-label="系统初始化完成"><i /><span>100%</span></div>
        <button className="gate-enter" type="button" onClick={() => finish(true)} disabled={phase !== 'ready'}>
          启动创新宇宙 <ArrowRight />
        </button>
        <button className="gate-skip" type="button" onClick={() => finish(false)} disabled={phase !== 'ready'}>
          <FastForward /> 跳过启动动画
        </button>
      </div>
      <div className="gate-coordinates" aria-hidden="true">23.0440° N / 112.0442° E<br />NODE 00 · READY</div>
    </dialog>
  );
}
