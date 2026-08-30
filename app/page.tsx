'use client';

/* eslint-disable next/no-img-element, jsx-a11y/prefer-tag-over-role */
import {
  ArrowLeft, ArrowRight, Award, Check, ChevronDown, CircuitBoard, Code2, Copy, Cpu,
  ExternalLink, Eye, Gauge, HeartPulse, Maximize2, Menu, Orbit, Play, Radio, Rocket, ScanLine,
  Sparkles, Volume2, VolumeX, X, Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { UniverseGate } from '@/components/universe-gate';

export type SceneId = 'top' | 'about' | 'projects' | 'awards' | 'reel' | 'moments' | 'join';
export type UniverseScene = { id: SceneId; code: string; label: string; subtitle: string };
export type TransitionState = { phase: 'idle' | 'closing' | 'opening'; target: SceneId };
export type Project = { id: string; title: string; category: string; image: string; description: string; tags: string[]; icon: keyof typeof projectIcons };
export type Achievement = { id: string; year: string; title: string; level: string; image: string; accent: string };
export type MediaItem = { id: string; type: 'video'; title: string; subtitle: string; src: string; poster: string; captions: string };
export type RecruitmentLink = { id: 'form' | 'group'; title: string; note: string; image: string };

const scenes: UniverseScene[] = [
  { id: 'top', code: '00', label: '控制终端', subtitle: 'UNIVERSE GATE' },
  { id: 'about', code: '01', label: '实践路径', subtitle: 'CHOOSE A PATH' },
  { id: 'projects', code: '02', label: '项目星图', subtitle: 'PROJECT NODES' },
  { id: 'awards', code: '03', label: '成就档案', subtitle: 'FIELD ARCHIVE' },
  { id: 'reel', code: '04', label: '事件回放', subtitle: 'EVENT REPLAY' },
  { id: 'moments', code: '05', label: '记忆碎片', subtitle: 'MEMORY FRAGMENTS' },
  { id: 'join', code: '06', label: '最终坐标', subtitle: 'DESTINATION LOCKED' },
];

const projectIcons = { health: HeartPulse, robot: Cpu, control: Gauge, flight: Rocket, medicine: Radio, home: Zap };
const projects: Project[] = [
  { id: 'edge-ai', title: '多模态肺炎早期筛查系统', category: 'EDGE AI · MEDTECH', image: '/media/ai-screening.jpg', description: '把边缘 AI、医学影像与生命体征监测装进一台可运行的设备，让算法真正抵达应用现场。', tags: ['边缘计算', '医学影像', '嵌入式'], icon: 'health' },
  { id: 'robot-arm', title: '智能机械臂', category: 'ROBOTICS · CONTROL', image: '/media/project-arm.jpg', description: '从机构搭建、驱动控制到动作编排，用可复现的工程链路完成抓取与交互。', tags: ['运动控制', '结构设计', '传感器'], icon: 'robot' },
  { id: 'balance-car', title: '车载平衡滚球运动控制系统', category: 'NUEDC · MOTION', image: '/media/balance-car.jpg', description: '融合视觉测量、闭环控制与机械结构，让小球在运动平台上稳定追踪目标。', tags: ['PID', '机器视觉', '电机控制'], icon: 'control' },
  { id: 'drone', title: '四轴飞行器', category: 'FLIGHT · EMBEDDED', image: '/media/project-drone.jpg', description: '理解姿态、动力与实时系统，在调参和试飞中建立真正的工程直觉。', tags: ['姿态解算', '飞控', '无线通信'], icon: 'flight' },
  { id: 'medicine-car', title: '自动送药小车', category: 'SERVICE ROBOT', image: '/media/project-medicine.png', description: '面向真实服务场景，完成环境感知、路径执行与人机信息提示。', tags: ['视觉识别', '自主移动', '交互'], icon: 'medicine' },
  { id: 'smart-home', title: '智能家居系统', category: 'IOT · PRODUCT', image: '/media/project-home.png', description: '连接传感、控制与终端界面，把一个功能原型打磨成完整的产品体验。', tags: ['物联网', '无线组网', '产品设计'], icon: 'home' },
];
const achievements: Achievement[] = [
  { id: 'nuedc-2026', year: '2026', title: '全国大学生电子设计竞赛信息科技前沿专题赛', level: '题赛全国三等奖', image: '/media/award-2026-national.jpg', accent: 'CYAN' },
  { id: 'nuedc-2025', year: '2025', title: '全国大学生电子设计竞赛', level: '全国二等奖', image: '/media/award-2025-national.jpg', accent: 'GOLD' },
  { id: 'bluebridge', year: '2025', title: '第十六届蓝桥杯大赛', level: '软件与电子赛道获奖', image: '/media/award-bluebridge.jpg', accent: 'BLUE' },
  { id: 'smarttech', year: '2025', title: '全国大学生智能技术应用大赛', level: '智能技术赛道获奖', image: '/media/award-smarttech.jpg', accent: 'ORANGE' },
];
const mediaItems: MediaItem[] = [
  { id: 'tech-video', type: 'video', title: '第一届科技节', subtitle: '把实验台搬到同学们身边', src: '/media/video-techfest.mp4', poster: '/media/activity-tech.jpg', captions: '/media/techfest-zh.vtt' },
  { id: 'contest-video', type: 'video', title: '2026 电赛现场', subtitle: '问题二 · 稳定完成', src: '/media/video-contest.mp4', poster: '/media/activity-contest.jpg', captions: '/media/contest-zh.vtt' },
];
const recruitmentLinks: RecruitmentLink[] = [
  { id: 'form', title: '填写报名问卷', note: '提交你的方向偏好与联系方式', image: '/media/qr-form.png' },
  { id: 'group', title: '加入咨询群', note: '和学长学姐面对面聊聊', image: '/media/qr-group.png' },
];
const pathItems = [
  { code: 'PATH 01', title: '软件与算法', copy: '让感知、决策与交互真正运行起来。', icon: Code2 },
  { code: 'PATH 02', title: '嵌入式系统', copy: '理解芯片、实时控制与软硬件边界。', icon: Cpu },
  { code: 'PATH 03', title: '硬件与电路', copy: '从原理图到焊接调试，让信号被看见。', icon: CircuitBoard },
  { code: 'PATH 04', title: '创意与产品', copy: '把功能原型推进成完整、可用的体验。', icon: Rocket },
];
const githubPagesBase = '/gdpu-innovation-practice';
function assetUrl(path: string) { return typeof window !== 'undefined' && window.location.hostname.endsWith('github.io') ? `${githubPagesBase}${path}` : path; }

function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0, w = 0, h = 0;
    let stars: { x: number; y: number; r: number; s: number; a: number; c: boolean }[] = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: w < 700 ? 48 : 108 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + .3, s: Math.random() * .08 + .02, a: Math.random() * .7 + .2, c: i % 8 === 0 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(star => { if (!reduced) star.y = star.y < -2 ? h + 2 : star.y - star.s; ctx.beginPath(); ctx.fillStyle = star.c ? `rgba(105,232,255,${star.a})` : `rgba(255,250,235,${star.a})`; ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill(); });
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener('resize', resize);
    return () => { removeEventListener('resize', resize); cancelAnimationFrame(frame); };
  }, []);
  return <canvas className="star-field" ref={ref} aria-hidden="true" />;
}

export default function Home() {
  const [activeScene, setActiveScene] = useState<SceneId>('top');
  const [transition, setTransition] = useState<TransitionState>({ phase: 'idle', target: 'top' });
  const [scenePulse, setScenePulse] = useState<UniverseScene | null>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeQr, setActiveQr] = useState<RecruitmentLink | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]), pulseTimer = useRef(0), swipeStart = useRef<number | null>(null);
  const seen = useRef(new Set<SceneId>(['top']));

  const signal = useCallback(async (kind: 'launch' | 'shift' | 'select', force = false) => {
    if (!soundEnabled && !force) return;
    try {
      if (!audioRef.current || audioRef.current.state === 'closed') audioRef.current = new AudioContext();
      const audio = audioRef.current; if (audio.state === 'suspended') await audio.resume();
      const now = audio.currentTime, notes = kind === 'launch' ? [196, 294, 440] : kind === 'shift' ? [330, 494] : [523];
      notes.forEach((freq, i) => { const osc = audio.createOscillator(), gain = audio.createGain(); osc.type = i % 2 ? 'sine' : 'triangle'; osc.frequency.setValueAtTime(freq, now + i * .055); gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'launch' ? .06 : .03, now + .04 + i * .055); gain.gain.exponentialRampToValueAtTime(.0001, now + .48 + i * .055); osc.connect(gain).connect(audio.destination); osc.start(now + i * .055); osc.stop(now + .58 + i * .055); });
    } catch { setSoundEnabled(false); }
  }, [soundEnabled]);

  const announce = useCallback((scene: UniverseScene) => { clearTimeout(pulseTimer.current); setScenePulse(scene); pulseTimer.current = window.setTimeout(() => setScenePulse(null), 1450); }, []);
  const navigateTo = useCallback((target: SceneId, projectIndex?: number) => {
    if (transition.phase !== 'idle') return;
    if (projectIndex !== undefined) setActiveProject(projectIndex);
    setMenuOpen(false); setTransition({ phase: 'closing', target }); void signal('shift');
    const scene = scenes.find(item => item.id === target) ?? scenes[0];
    timers.current.push(window.setTimeout(() => { history.pushState(null, '', `#${target}`); document.getElementById(target)?.scrollIntoView({ behavior: 'auto' }); setActiveScene(target); setTransition({ phase: 'opening', target }); announce(scene); }, 470));
    timers.current.push(window.setTimeout(() => setTransition({ phase: 'idle', target }), 1180));
  }, [announce, signal, transition.phase]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); clearTimeout(pulseTimer.current); audioRef.current?.close().catch(() => undefined); }, []);
  useEffect(() => {
    let frame = 0; const update = () => { const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? scrollY / max : 0); frame = 0; }; const scroll = () => { if (!frame) frame = requestAnimationFrame(update); }; update(); addEventListener('scroll', scroll, { passive: true }); return () => { removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const root = document.documentElement; let frame = 0; const move = (e: globalThis.PointerEvent) => { if (innerWidth < 760 || frame) return; frame = requestAnimationFrame(() => { root.style.setProperty('--mouse-x', `${e.clientX}px`); root.style.setProperty('--mouse-y', `${e.clientY}px`); frame = 0; }); }; addEventListener('pointermove', move, { passive: true }); return () => { removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible || transition.phase !== 'idle') return; const id = visible.target.id as SceneId; const scene = scenes.find(item => item.id === id); if (!scene) return; setActiveScene(id); if (!seen.current.has(id)) { seen.current.add(id); announce(scene); } }, { rootMargin: '-28% 0px -52%', threshold: [0, .2, .45] });
    scenes.forEach(scene => { const node = document.getElementById(scene.id); if (node) observer.observe(node); }); return () => observer.disconnect();
  }, [announce, transition.phase]);
  useEffect(() => { const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .13 }); document.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node)); return () => observer.disconnect(); }, []);
  useEffect(() => { const pop = () => { const id = location.hash.slice(1); if (scenes.some(scene => scene.id === id)) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }; addEventListener('popstate', pop); return () => removeEventListener('popstate', pop); }, []);

  const gateEnter = (withSound: boolean) => { if (withSound) { setSoundEnabled(true); void signal('launch', true); } const hash = location.hash.slice(1); if (hash && hash !== 'top') window.setTimeout(() => document.getElementById(hash)?.scrollIntoView(), withSound ? 1180 : 0); };
  const toggleSound = () => { const next = !soundEnabled; setSoundEnabled(next); if (next) void signal('select', true); };
  const changeProject = (direction: number) => { setActiveProject(index => (index + direction + projects.length) % projects.length); void signal('select'); };
  const copyWechat = async () => { try { await navigator.clipboard.writeText('surui200708'); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const currentProject = projects[activeProject], ProjectIcon = projectIcons[currentProject.icon];
  const transitionScene = scenes.find(scene => scene.id === transition.target) ?? scenes[0];

  return (
    <main className="universe-site">
      <UniverseGate logoSrc={assetUrl('/media/association-logo.jpg')} onEnter={gateEnter} />
      <StarField /><div className="cosmic-nebula" aria-hidden="true" /><div className="pointer-aura" aria-hidden="true" />
      <div className="site-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className={`scene-transition is-${transition.phase}`} aria-hidden="true"><span className="transition-wing wing-left" /><span className="transition-wing wing-right" /><div className="transition-target"><small>{transitionScene.code} / {transitionScene.subtitle}</small><strong>{transitionScene.label}</strong></div><div className="transition-core"><i /><i /><i /></div></div>
      <div className={`scene-announcer ${scenePulse ? 'is-visible' : ''}`} aria-live="polite"><span>{scenePulse?.code}</span><div><small>{scenePulse?.subtitle}</small><strong>{scenePulse?.label}</strong></div></div>

      <header className={`universe-header${menuOpen ? ' is-menu-open' : ''}`}>
        <button className="universe-brand" type="button" onClick={() => navigateTo('top')} aria-label="返回控制终端"><img src={assetUrl('/media/association-logo.jpg')} alt="" /><span><b>GDP·U 创新实践协会</b><small>INNOVATION UNIVERSE / 2026</small></span></button>
        <div className="header-scene"><span>{scenes.find(s => s.id === activeScene)?.code}</span>{scenes.find(s => s.id === activeScene)?.label}</div>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="探索章节">{scenes.slice(1).map(scene => <button className={activeScene === scene.id ? 'is-active' : ''} type="button" key={scene.id} onClick={() => navigateTo(scene.id)}><small>{scene.code}</small>{scene.label}</button>)}</nav>
        <div className="header-actions"><button className="sound-toggle" type="button" onClick={toggleSound} aria-label={soundEnabled ? '关闭转场音效' : '开启转场音效'}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button><button className="menu-toggle" type="button" onClick={() => setMenuOpen(v => !v)} aria-label="打开章节导航" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <section className="universe-hero scene-panel" id="top">
        <div className="hero-system-copy"><p className="system-kicker"><Sparkles /> SIMULATION READY · 2026 AUTUMN</p><h1>把想法<br /><em>焊成现实</em></h1><p className="hero-summary">用代码创造世界。这里不围观未来，<br />我们亲手把它做出来。</p><div className="hero-buttons"><button className="universe-primary" type="button" onClick={() => navigateTo('about')}>开始探索 <ArrowRight /></button><button className="universe-link" type="button" onClick={() => navigateTo('join')}>锁定招新坐标</button></div><dl className="system-stats"><div><dt>2015</dt><dd>协会成立</dd></div><div><dt>06</dt><dd>项目节点</dd></div><div><dt>全国奖项</dt><dd>赛场验证</dd></div></dl></div>
        <div className="hero-universe-map" aria-label="六个实践项目节点"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-orbit orbit-three" /><div className="hero-core"><span className="core-triangle" /><span className="core-halo" /><img src={assetUrl('/media/association-logo.jpg')} alt="创新实践协会会徽核心" /><small>ASSOCIATION<br />CORE</small></div>{projects.map((project, index) => { const Icon = projectIcons[project.icon]; return <button className={`hero-node node-${index + 1}`} type="button" key={project.id} onClick={() => navigateTo('projects', index)} aria-label={`探索项目：${project.title}`}><Icon /><span>0{index + 1}</span><b>{project.title}</b></button>; })}<figure className="data-photo photo-team"><img src={assetUrl('/media/team-lab.jpg')} alt="创新实践协会成员实验室合影" /><figcaption>TEAM DATA / 2025</figcaption></figure><figure className="data-photo photo-device"><img src={assetUrl('/media/balance-car.jpg')} alt="车载平衡滚球运动控制系统" /><figcaption>PROJECT NODE / 03</figcaption></figure><div className="map-coordinate">23.0440° N<br />112.0442° E</div></div>
        <button className="hero-scroll" type="button" onClick={() => navigateTo('about')}><span>SCROLL TO EXPLORE</span><ChevronDown /></button>
      </section>

      <section className="path-section scene-panel section-shell" id="about"><SceneTitle code="01" label="CHOOSE A PATH" /><div className="path-intro" data-reveal><div><p className="system-kicker">WHY CHUANGXIE</p><h2>选择你的<br /><em>实践路径</em></h2></div><div><p className="path-lead">创新实践协会成立于 2015 年。我们相信，最好的学习发生在“真的做一个东西”时。</p><p>你不需要带着满级技能来，只需要带上好奇心，以及把问题追到底的耐心。</p></div></div><div className="path-grid">{pathItems.map((path, index) => { const Icon = path.icon; return <article className="path-card" key={path.code} data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties}><small>{path.code}</small><Icon /><h3>{path.title}</h3><p>{path.copy}</p><span>PATH AVAILABLE <ArrowRight /></span></article>; })}</div><div className="path-manifest" data-reveal><span>LEARN</span><i /><span>BUILD</span><i /><span>TEST</span><i /><span>SHARE</span></div></section>

      <section className="project-universe scene-panel" id="projects"><div className="section-shell"><SceneTitle code="02" label="PROJECT NODES" /><Heading kicker="REAL WORKS / 真实作品" title={<>探索项目<br /><em>星图节点</em></>} copy={<>每个节点都来自真实搭建、调试与赛场验证。<br />选择一个坐标，读取它的工程数据。</>} /><div className="project-explorer" tabIndex={0} role="slider" aria-label="项目星图，可使用左右方向键切换" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={activeProject + 1} aria-valuetext={currentProject.title} onKeyDown={e => { if (e.key === 'ArrowLeft') changeProject(-1); if (e.key === 'ArrowRight') changeProject(1); }} onPointerDown={(e: PointerEvent<HTMLDivElement>) => { swipeStart.current = e.clientX; }} onPointerUp={(e: PointerEvent<HTMLDivElement>) => { if (swipeStart.current === null) return; const d = e.clientX - swipeStart.current; if (Math.abs(d) > 60) changeProject(d > 0 ? -1 : 1); swipeStart.current = null; }}><div className="project-map"><div className="project-map-ring ring-a" /><div className="project-map-ring ring-b" /><div className="project-map-center"><Orbit /><small>NODE</small><strong>0{activeProject + 1}</strong></div>{projects.map((project, index) => { const Icon = projectIcons[project.icon]; return <button className={`project-map-node project-node-${index + 1} ${activeProject === index ? 'is-active' : ''}`} type="button" key={project.id} onClick={() => { setActiveProject(index); void signal('select'); }} aria-label={project.title}><Icon /><span>0{index + 1}</span></button>; })}</div><article className="project-dossier" key={currentProject.id}><div className="dossier-image"><img src={assetUrl(currentProject.image)} alt={currentProject.title} draggable="false" /><div className="focus-triangle" /><span className="image-scan" /><small>LIVE PROJECT DATA / 0{activeProject + 1}</small></div><div className="dossier-copy"><p className="project-category"><ProjectIcon /> {currentProject.category}</p><h3>{currentProject.title}</h3><p>{currentProject.description}</p><div className="tag-row">{currentProject.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-controls"><Button variant="outline" size="icon-lg" aria-label="上一个项目" onClick={() => changeProject(-1)}><ArrowLeft /></Button><span>0{activeProject + 1} <i /> 0{projects.length}</span><Button variant="outline" size="icon-lg" aria-label="下一个项目" onClick={() => changeProject(1)}><ArrowRight /></Button></div></div></article></div></div></section>

      <section className="archive-section scene-panel section-shell" id="awards"><SceneTitle code="03" label="FIELD ARCHIVE" /><Heading kicker="ACHIEVEMENT RECORDS" title={<>读取<br /><em>成就档案</em></>} copy={<>不是简历上的装饰，而是把作品真正跑通的证明。<br />点击档案读取完整证书。</>} /><div className="archive-grid">{achievements.map((item, index) => <button className={`archive-card accent-${item.accent.toLowerCase()}`} type="button" key={item.id} onClick={() => setActiveAchievement(item)} data-reveal><span className="archive-index">A-0{index + 1}</span><Award /><small>{item.year} / VERIFIED</small><h3>{item.level}</h3><p>{item.title}</p><span className="archive-open"><Eye /> 读取档案</span></button>)}</div></section>

      <section className="replay-section scene-panel" id="reel"><div className="section-shell"><SceneTitle code="04" label="EVENT REPLAY" /><Heading kicker="LIVE EVENT RECORDS" title={<>事件正在<br /><em>重新加载</em></>} copy={<>项目会动起来，人也会聚在一起。<br />点击进入真实活动记录。</>} /><div className="replay-grid">{mediaItems.map((item, index) => <button className="replay-card" type="button" key={item.id} onClick={() => setActiveMedia(item)} data-reveal><img src={assetUrl(item.poster)} alt="" loading="lazy" /><span className="replay-grid-lines" /><span className="replay-play"><Play fill="currentColor" /></span><span className="replay-number">EVENT 0{index + 1}</span><span className="replay-copy"><small>RECORD AVAILABLE</small><b>{item.title}</b><em>{item.subtitle}</em></span></button>)}</div></div></section>

      <section className="memory-section scene-panel section-shell" id="moments"><SceneTitle code="05" label="MEMORY FRAGMENTS" /><div className="memory-heading" data-reveal><p className="system-kicker">WE BUILD TOGETHER</p><h2>真正让作品发光的，<br /><em>是一起做事的人</em></h2></div><div className="memory-grid" data-reveal><Memory className="fragment-a" src="/media/activity-team.jpg" alt="协会成员在竞赛期间交流协作" code="01" label="COMPETITION DAY" /><Memory className="fragment-b" src="/media/activity-share.jpg" alt="创新实践协会技术分享会现场" code="02" label="SHARE & LEARN" /><Memory className="fragment-c" src="/media/activity-tech.jpg" alt="协会科技节活动现场" code="03" label="TECH FESTIVAL" /><Memory className="fragment-d" src="/media/team-lab.jpg" alt="创新实践协会成员实验室合影" code="04" label="ONE TEAM" /></div><blockquote data-reveal>“你可以从不会开始，<br />但不会一个人卡在那里。”</blockquote></section>

      <section className="destination-section scene-panel" id="join"><div className="destination-radar" aria-hidden="true"><ScanLine /><i /><i /></div><div className="section-shell destination-shell"><div className="destination-copy" data-reveal><SceneTitle code="06" label="DESTINATION LOCKED" /><p className="system-kicker"><Radio /> SIGNAL FOUND · 2026</p><h2>你的下一个作品，<br /><em>从这里开始</em></h2><p>不设“大神”门槛。欢迎对电子设计、嵌入式、AI、机器人、软件开发和产品创新保持好奇的你。</p><div className="destination-checks"><span><Check /> 零基础可加入</span><span><Check /> 项目制学习</span><span><Check /> 真实竞赛与分享</span></div><div className="wechat-coordinate"><small>CONTACT COORDINATE</small><span>负责人微信</span><strong>surui200708</strong><Button onClick={copyWechat} aria-label="复制负责人微信号">{copied ? <Check /> : <Copy />}{copied ? '已复制' : '复制坐标'}</Button><output className="sr-only" aria-live="polite">{copied ? '微信号已复制' : ''}</output></div></div><div className="destination-links" data-reveal>{recruitmentLinks.map((item, index) => <button className="destination-card" key={item.id} type="button" onClick={() => setActiveQr(item)}><div className="destination-qr"><img src={assetUrl(item.image)} alt={`${item.title}二维码`} /><span><Maximize2 /> 放大坐标</span></div><div><small>DESTINATION 0{index + 1}</small><h3>{item.title}</h3><p>{item.note}</p></div><ExternalLink /></button>)}</div></div></section>

      <footer className="universe-footer"><div><img src={assetUrl('/media/association-logo.jpg')} alt="创新实践协会会徽" /><span><b>广东药科大学创新实践协会</b><small>INTEREST · PRACTICE · CREATION</small></span></div><p>© 2026 GDP·U INNOVATION PRACTICE ASSOCIATION</p><button type="button" onClick={() => navigateTo('top')}>RETURN TO CORE <ArrowRight /></button></footer>

      <Dialog open={Boolean(activeAchievement)} onOpenChange={open => !open && setActiveAchievement(null)}><DialogContent className="universe-dialog archive-dialog" showCloseButton><div className="dialog-scan" /><DialogTitle>{activeAchievement?.title}</DialogTitle><DialogDescription>{activeAchievement?.year} · {activeAchievement?.level}</DialogDescription>{activeAchievement && <img src={assetUrl(activeAchievement.image)} alt={`${activeAchievement.title} ${activeAchievement.level}证书`} />}</DialogContent></Dialog>
      <Dialog open={Boolean(activeMedia)} onOpenChange={open => !open && setActiveMedia(null)}><DialogContent className="universe-dialog video-dialog" showCloseButton><DialogTitle>{activeMedia?.title}</DialogTitle><DialogDescription>{activeMedia?.subtitle}</DialogDescription>{activeMedia && <video src={assetUrl(activeMedia.src)} poster={assetUrl(activeMedia.poster)} controls autoPlay playsInline><track kind="captions" src={assetUrl(activeMedia.captions)} srcLang="zh-CN" label="中文场景说明" default /></video>}</DialogContent></Dialog>
      <Dialog open={Boolean(activeQr)} onOpenChange={open => !open && setActiveQr(null)}><DialogContent className="universe-dialog qr-dialog" showCloseButton><DialogTitle>{activeQr?.title}</DialogTitle><DialogDescription>{activeQr?.note}；手机端可长按保存二维码。</DialogDescription>{activeQr && <img src={assetUrl(activeQr.image)} alt={`${activeQr.title}二维码大图`} />}</DialogContent></Dialog>
    </main>
  );
}

function SceneTitle({ code, label }: { code: string; label: string }) { return <div className="scene-title" data-reveal><span>{code}</span><i /><small>{label}</small></div>; }
function Heading({ kicker, title, copy }: { kicker: string; title: React.ReactNode; copy: React.ReactNode }) { return <div className="section-heading-row" data-reveal><div><p className="system-kicker">{kicker}</p><h2>{title}</h2></div><p>{copy}</p></div>; }
function Memory({ className, src, alt, code, label }: { className: string; src: string; alt: string; code: string; label: string }) { return <figure className={`memory-fragment ${className}`}><img src={assetUrl(src)} alt={alt} loading="lazy" /><figcaption><span>MEMORY / {code}</span>{label}</figcaption></figure>; }
