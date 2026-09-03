'use client';

/* eslint-disable next/no-img-element, jsx-a11y/prefer-tag-over-role */
import {
  Activity, ArrowLeft, ArrowRight, Award, Camera, Check, ChevronDown, CircuitBoard, Code2, Copy, Cpu,
  ExternalLink, Eye, Gauge, HeartPulse, Maximize2, Menu, Orbit, PackageSearch, Play, Radio,
  ScanLine, Sparkles, Volume2, VolumeX, Wrench, X, Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { UniverseGate } from '@/components/universe-gate';

export type SceneId = 'top' | 'about' | 'projects' | 'awards' | 'reel' | 'moments' | 'join';
export type GroupId = 'algorithm' | 'control' | 'mechanical' | 'hardware' | 'equipment' | 'publicity';
export type UniverseScene = { id: SceneId; code: string; label: string; subtitle: string };
export type TransitionState = { phase: 'idle' | 'closing' | 'opening'; target: SceneId };
export type ProjectAward = { achievementId: string; label: string; year: string; verified: true };
export type Project = {
  id: string; title: string; category: string; image: string; description: string; tags: string[];
  icon: keyof typeof projectIcons; processor: string; functions: string[]; groupIds: GroupId[];
  awards: ProjectAward[]; verificationStatus: 'verified' | 'partial' | 'pending';
  mapPosition: { x: string; y: string }; fallbackVisual?: boolean;
};
export type PracticeGroup = {
  id: GroupId; code: string; title: string; english: string; responsibility: string; intro: string;
  starterTasks: string[]; gains: string[]; future: string; projectIds: string[]; icon: keyof typeof groupIcons;
};
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

const projectIcons = { health: HeartPulse, robot: Cpu, control: Gauge, rehab: Activity, medicine: Radio, home: Zap, posture: HeartPulse };
const groupIcons = { algorithm: Code2, control: Gauge, mechanical: Wrench, hardware: CircuitBoard, equipment: PackageSearch, publicity: Camera };
const projects: Project[] = [
  { id: 'edge-ai', title: '多模态儿童肺炎早期筛查系统', category: 'EDGE AI · MEDTECH', image: '/media/ai-screening.jpg', description: '把边缘 AI、医学影像与生命体征监测装进一台可运行的设备，让算法真正抵达应用现场。', tags: ['边缘计算', '医学影像', '嵌入式 AI'], icon: 'health', processor: '主控资料待协会补充', functions: ['医学影像辅助分析', '生命体征数据呈现', '筛查结果终端交互'], groupIds: ['algorithm', 'hardware', 'publicity'], awards: [], verificationStatus: 'pending', mapPosition: { x: '48%', y: '5%' } },
  { id: 'robot-arm', title: '智能机械臂', category: 'ROBOTICS · CONTROL', image: '/media/project-arm.jpg', description: '从机构搭建、驱动控制到动作编排，用可复现的工程链路完成抓取与交互。', tags: ['运动控制', '结构设计', '传感器'], icon: 'robot', processor: '主控资料待协会补充', functions: ['多关节动作控制', '目标抓取与搬运', '动作序列编排'], groupIds: ['control', 'mechanical', 'hardware'], awards: [], verificationStatus: 'pending', mapPosition: { x: '78%', y: '16%' } },
  { id: 'balance-car', title: '车载平衡滚球运动控制系统', category: 'NUEDC · MOTION', image: '/media/balance-car.jpg', description: '融合视觉测量、闭环控制与机械结构，让小球在运动平台上稳定追踪目标。', tags: ['PID', '机器视觉', '电机控制'], icon: 'control', processor: '主控资料待协会补充', functions: ['小球位置视觉测量', '运动平台闭环控制', '目标轨迹稳定跟踪'], groupIds: ['algorithm', 'control', 'mechanical'], awards: [], verificationStatus: 'pending', mapPosition: { x: '91%', y: '47%' } },
  { id: 'hand-rehab', title: '基于瑞萨 R7FA6M5BF 的智能手部康复训练系统', category: 'REHABILITATION · EMBEDDED', image: '/media/project-hand-rehab.jpg', description: '通过可穿戴手部机构、传感反馈与任务导向训练，把康复动作转化为可执行、可交互的训练流程。', tags: ['瑞萨 RA6M5', '康复工程', '人机交互'], icon: 'rehab', processor: '瑞萨 R7FA6M5BF（RA6M5）', functions: ['手指屈伸辅助训练', '任务导向型康复模式', '触控界面与训练反馈'], groupIds: ['control', 'mechanical', 'hardware'], awards: [{ achievementId: 'hand-national', label: '全国总决赛一等奖', year: '2026', verified: true }, { achievementId: 'hand-south', label: '南部赛区一等奖', year: '2026', verified: true }], verificationStatus: 'verified', mapPosition: { x: '77%', y: '79%' } },
  { id: 'medicine-car', title: '自动送药小车', category: 'SERVICE ROBOT', image: '/media/project-medicine.png', description: '面向真实服务场景，完成环境感知、路径执行与人机信息提示。', tags: ['视觉识别', '自主移动', '交互'], icon: 'medicine', processor: '主控资料待协会补充', functions: ['路线识别与移动执行', '药品配送流程提示', '状态显示与人机交互'], groupIds: ['algorithm', 'control', 'mechanical'], awards: [], verificationStatus: 'pending', mapPosition: { x: '48%', y: '91%' } },
  { id: 'smart-home', title: '智能家居系统', category: 'IOT · PRODUCT', image: '/media/project-home.png', description: '连接传感、控制与终端界面，把一个功能原型打磨成完整的产品体验。', tags: ['物联网', '无线组网', '产品设计'], icon: 'home', processor: '主控资料待协会补充', functions: ['环境状态采集', '家居设备联动控制', '本地终端信息展示'], groupIds: ['hardware', 'control', 'publicity'], awards: [], verificationStatus: 'pending', mapPosition: { x: '18%', y: '79%' } },
  { id: 'cervical-care', title: '颈椎健康监测与预防系统', category: 'WEARABLE · HEALTH', image: '/media/project-cervical.jpg', description: '利用姿态传感与无线通信记录颈部状态，在不良姿态持续发生时提供监测与提醒。', tags: ['姿态传感', '无线通信', '健康监测'], icon: 'posture', processor: '主控资料待协会补充', functions: ['颈部姿态采集', '不良姿态识别', '无线数据传输与提醒'], groupIds: ['algorithm', 'hardware', 'publicity'], awards: [{ achievementId: 'cervical-south', label: '应用赛道南部赛区复赛三等奖', year: '2022', verified: true }], verificationStatus: 'partial', mapPosition: { x: '5%', y: '47%' } },
  { id: 'waist-posture', title: '基于 STM32U575 的智能运动监测与腰姿识别系统', category: 'BIOMEDICAL · MOTION', image: '/media/award-biomedical-first.png', description: '围绕运动数据与腰部姿态识别构建监测系统，将传感数据转化为可理解的姿态状态与风险提示。', tags: ['STM32U575', '运动监测', '姿态识别'], icon: 'posture', processor: 'STM32U575', functions: ['运动状态采集', '腰姿识别与分类', '异常姿态提示'], groupIds: ['algorithm', 'control', 'hardware'], awards: [{ achievementId: 'biomedical-2026', label: '一等奖', year: '2026', verified: true }], verificationStatus: 'partial', mapPosition: { x: '18%', y: '16%' }, fallbackVisual: true },
];
const achievements: Achievement[] = [
  { id: 'hand-national', year: '2026', title: '第九届全国大学生嵌入式芯片与系统设计竞赛芯片应用赛道', level: '全国总决赛一等奖', image: '/media/award-hand-national.jpg', accent: 'GOLD' },
  { id: 'hand-south', year: '2026', title: '第九届全国大学生嵌入式芯片与系统设计竞赛芯片应用赛道', level: '南部赛区一等奖', image: '/media/award-hand-south.jpg', accent: 'CYAN' },
  { id: 'cervical-south', year: '2022', title: '第五届全国大学生嵌入式芯片与系统设计竞赛应用赛道', level: '南部赛区复赛三等奖', image: '/media/award-cervical-south.png', accent: 'BLUE' },
  { id: 'nuedc-2026', year: '2026', title: '全国大学生电子设计竞赛信息科技前沿专题赛', level: '全国三等奖', image: '/media/award-2026-national.jpg', accent: 'CYAN' },
  { id: 'biomedical-2026', year: '2026', title: '第十一届全国大学生生物医学工程创新设计竞赛', level: '一等奖', image: '/media/award-biomedical-first.png', accent: 'GOLD' },
  { id: 'bluebridge', year: '2025', title: '第十六届蓝桥杯大赛', level: '软件与电子赛道获奖', image: '/media/award-bluebridge.jpg', accent: 'BLUE' },
  { id: 'smarttech', year: '2025', title: '全国大学生智能技术应用大赛', level: '智能技术赛道获奖', image: '/media/award-smarttech.jpg', accent: 'ORANGE' },
];
const mediaItems: MediaItem[] = [
  { id: 'tech-video', type: 'video', title: '第一届科技节', subtitle: '把实验台搬到同学们身边', src: '/media/video-techfest.mp4', poster: '/media/activity-tech.jpg', captions: '/media/techfest-zh.vtt' },
  { id: 'contest-video', type: 'video', title: '2026 电赛现场', subtitle: '问题二 · 稳定完成', src: '/media/video-contest.mp4', poster: '/media/activity-contest.jpg', captions: '/media/contest-zh.vtt' },
];
const recruitmentLinks: RecruitmentLink[] = [
  { id: 'form', title: '填写报名问卷', note: '提交你的方向偏好与联系方式', image: '/media/qr-form.png' },
  { id: 'group', title: '加入咨询群', note: 'QQ群：1107926349 · 微信扫码进群咨询', image: '/media/qr-group.png' },
];
const practiceGroups: PracticeGroup[] = [
  { id: 'algorithm', code: 'GROUP 01', title: '算法组', english: 'ALGORITHM', responsibility: '视觉识别 · 数据处理 · 嵌入式 AI', intro: '让设备看懂画面、理解数据，并把模型真正部署到项目现场。', starterTasks: ['学习 Python、OpenCV 与基础数据处理', '参与数据整理、标注、训练和模型评估', '把算法部署到边缘设备并参与现场调试'], gains: ['编程与算法验证能力', '从数据到部署的 AI 工程链路', '跨组沟通与问题拆解能力'], future: '为人工智能、计算机视觉、数据分析和嵌入式 AI 方向建立项目基础。', projectIds: ['edge-ai', 'balance-car', 'medicine-car', 'cervical-care', 'waist-posture'], icon: 'algorithm' },
  { id: 'control', code: 'GROUP 02', title: '电控组', english: 'CONTROL', responsibility: '传感器采集 · 闭环控制 · 电机驱动', intro: '负责让传感器、电机和执行机构按照控制逻辑稳定协同。', starterTasks: ['学习单片机外设、通信协议与传感器采集', '编写 PID、状态机和执行机构控制逻辑', '参与整机联调、参数整定与故障定位'], gains: ['嵌入式开发与实时控制能力', '系统联调和现场排障经验', '机器人与自动化工程思维'], future: '对嵌入式、自动化、控制工程、机器人和智能硬件方向都有直接帮助。', projectIds: ['robot-arm', 'balance-car', 'hand-rehab', 'medicine-car', 'smart-home', 'waist-posture'], icon: 'control' },
  { id: 'mechanical', code: 'GROUP 03', title: '机械组', english: 'MECHANICAL', responsibility: '三维建模 · 结构加工 · 装配联调', intro: '把想法变成能制造、能装配、能稳定运行的实体结构。', starterTasks: ['使用 CAD 完成零件与装配体建模', '接触 3D 打印、结构加工和材料选择', '参与装配、尺寸修正与整机联调'], gains: ['空间设计与结构分析能力', '从图纸到实物的制造经验', '工程公差、可靠性与协作意识'], future: '为机械设计、工业设计、智能制造、机器人工程和产品研发积累作品。', projectIds: ['robot-arm', 'balance-car', 'hand-rehab', 'medicine-car'], icon: 'mechanical' },
  { id: 'hardware', code: 'GROUP 04', title: '硬件组', english: 'HARDWARE', responsibility: '原理图设计 · PCB · 焊接调试', intro: '负责电源、传感、驱动和通信电路，让系统拥有可靠的电子底座。', starterTasks: ['认识常用元器件并读懂原理图', '学习 PCB 设计、焊接和仪器测量', '完成电源、传感或驱动模块调试'], gains: ['电子电路设计与焊接能力', '示波器等仪器的规范使用', '信号、电源和故障定位经验'], future: '为电子信息、硬件研发、芯片应用、测试工程和嵌入式方向夯实基础。', projectIds: ['edge-ai', 'robot-arm', 'hand-rehab', 'smart-home', 'cervical-care', 'waist-posture'], icon: 'hardware' },
  { id: 'equipment', code: 'GROUP 05', title: '器材组', english: 'EQUIPMENT', responsibility: '器件管理 · 设备维护 · 赛前保障', intro: '维护实验室秩序与装备状态，让每个项目在关键时刻都有可靠保障。', starterTasks: ['整理元件库、工具与借用记录', '学习测试仪器、焊接设备和实验室安全', '参与采购统计、赛前物料与设备检查'], gains: ['工程规范和设备维护能力', '物料统筹与流程管理经验', '严谨负责的项目保障意识'], future: '对实验室管理、测试工程、供应链、项目管理和工程现场岗位都有帮助。', projectIds: ['edge-ai', 'robot-arm', 'balance-car', 'hand-rehab', 'medicine-car', 'smart-home', 'cervical-care', 'waist-posture'], icon: 'equipment' },
  { id: 'publicity', code: 'GROUP 06', title: '宣传组', english: 'PUBLICITY', responsibility: '摄影摄像 · 视觉设计 · 新媒体运营', intro: '记录项目与团队的成长，让技术成果被更多同学看见和理解。', starterTasks: ['参与活动摄影、视频剪辑和现场记录', '制作海报、推文排版与招新视觉', '策划内容主题并运营协会新媒体'], gains: ['视觉审美和内容策划能力', '摄影剪辑与品牌表达经验', '沟通采访和团队协作能力'], future: '为新媒体、品牌设计、产品运营、内容创作和用户沟通积累真实案例。', projectIds: ['edge-ai', 'smart-home', 'cervical-care'], icon: 'publicity' },
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
  const [activeGroup, setActiveGroup] = useState(0);
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
    setActiveAchievement(null);
    setActiveMedia(null);
    setActiveQr(null);
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
  const selectGroup = (index: number, withNavigation = false) => { setActiveGroup(index); void signal('select'); if (withNavigation) navigateTo('about'); };
  const showGroupProjects = () => { const projectIndex = projects.findIndex(project => currentGroup.projectIds.includes(project.id)); navigateTo('projects', projectIndex >= 0 ? projectIndex : 0); };
  const openProjectAward = (achievementId: string) => { const achievement = achievements.find(item => item.id === achievementId); if (achievement) setActiveAchievement(achievement); };
  const copyWechat = async () => { try { await navigator.clipboard.writeText('surui200708'); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const currentProject = projects[activeProject], ProjectIcon = projectIcons[currentProject.icon];
  const currentGroup = practiceGroups[activeGroup], GroupIcon = groupIcons[currentGroup.icon];
  const verificationLabel = currentProject.verificationStatus === 'verified' ? '项目档案已核验' : currentProject.verificationStatus === 'partial' ? '部分资料已核验' : '项目资料待补充';
  const transitionScene = scenes.find(scene => scene.id === transition.target) ?? scenes[0];

  return (
    <main className="universe-site">
      <UniverseGate logoSrc={assetUrl('/media/association-logo.jpg')} onEnter={gateEnter} />
      <StarField /><div className="cosmic-nebula" aria-hidden="true" /><div className="pointer-aura" aria-hidden="true" />
      <div className="site-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className={`scene-transition is-${transition.phase}`} aria-hidden="true"><span className="transition-wing wing-left" /><span className="transition-wing wing-right" /><div className="transition-target"><small>{transitionScene.code} / {transitionScene.subtitle}</small><strong>{transitionScene.label}</strong></div><div className="transition-core"><i /><i /><i /></div></div>
      <div className={`scene-announcer ${scenePulse ? 'is-visible' : ''}`} aria-live="polite"><span>{scenePulse?.code}</span><div><small>{scenePulse?.subtitle}</small><strong>{scenePulse?.label}</strong></div></div>

      <header className={`universe-header${menuOpen ? ' is-menu-open' : ''}`}>
        <button className="universe-brand" type="button" onClick={() => navigateTo('top')} aria-label="返回控制终端"><img src={assetUrl('/media/association-logo.jpg')} alt="" /><span><b>GDPU 创新实践协会</b><small>INNOVATION UNIVERSE / 2026</small></span></button>
        <div className="header-scene"><span>{scenes.find(s => s.id === activeScene)?.code}</span>{scenes.find(s => s.id === activeScene)?.label}</div>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="探索章节">{scenes.slice(1).map(scene => <button className={activeScene === scene.id ? 'is-active' : ''} type="button" key={scene.id} onClick={() => navigateTo(scene.id)}><small>{scene.code}</small>{scene.label}</button>)}</nav>
        <div className="header-actions"><button className="sound-toggle" type="button" onClick={toggleSound} aria-label={soundEnabled ? '关闭转场音效' : '开启转场音效'}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button><button className="menu-toggle" type="button" onClick={() => setMenuOpen(v => !v)} aria-label="打开章节导航" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></div>
      </header>

      <section className="universe-hero scene-panel" id="top">
        <div className="hero-system-copy"><p className="system-kicker"><Sparkles /> SIMULATION READY · 2026 AUTUMN</p><h1>把想法<br /><em>焊成现实</em></h1><p className="hero-summary">用代码创造世界。这里不围观未来，<br />我们亲手把它做出来。</p><div className="hero-buttons"><button className="universe-primary" type="button" onClick={() => navigateTo('about')}>开始探索 <ArrowRight /></button><button className="universe-link" type="button" onClick={() => navigateTo('join')}>锁定招新坐标</button></div><dl className="system-stats"><div><dt>2015</dt><dd>协会成立</dd></div><div><dt>06</dt><dd>实践组别</dd></div><div><dt>08</dt><dd>真实项目</dd></div></dl></div>
        <div className="hero-universe-map" aria-label="创新实践协会六个组别节点"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-orbit orbit-three" /><div className="hero-core"><span className="core-triangle" /><span className="core-halo" /><img src={assetUrl('/media/association-logo.jpg')} alt="创新实践协会会徽核心" /><small>ASSOCIATION<br />CORE</small></div>{practiceGroups.map((group, index) => { const Icon = groupIcons[group.icon]; return <button className={`hero-node node-${index + 1}`} type="button" key={group.id} onClick={() => selectGroup(index, true)} aria-label={`了解${group.title}`}><Icon /><span>0{index + 1}</span><b>{group.title}</b></button>; })}<figure className="data-photo photo-team"><img src={assetUrl('/media/team-lab.jpg')} alt="创新实践协会成员实验室合影" /><figcaption>TEAM DATA / 2025</figcaption></figure><figure className="data-photo photo-device"><img src={assetUrl('/media/balance-car.jpg')} alt="车载平衡滚球运动控制系统" /><figcaption>PROJECT NODE / 03</figcaption></figure><div className="map-coordinate">23.0440° N<br />112.0442° E</div></div>
        <button className="hero-scroll" type="button" onClick={() => navigateTo('about')}><span>SCROLL TO EXPLORE</span><ChevronDown /></button>
      </section>

      <section className="path-section scene-panel section-shell" id="about">
        <SceneTitle code="01" label="CHOOSE A GROUP" />
        <div className="path-intro" data-reveal><div><p className="system-kicker">SIX PATHS · ONE TEAM</p><h2>选择你的<br /><em>实践组别</em></h2></div><div><p className="path-lead">六个组负责不同的工程环节，也会在同一个项目里并肩协作。</p><p>你不需要带着满级技能来。先选择一个最想了解的方向，再从真实任务开始成长。</p></div></div>
        <div className="group-explorer" data-reveal>
          <div className="group-map" role="tablist" aria-label="创新实践协会六个组别">
            <div className="group-orbit group-orbit-a" aria-hidden="true" /><div className="group-orbit group-orbit-b" aria-hidden="true" />
            <div className="group-map-core" aria-hidden="true"><GroupIcon /><small>ACTIVE GROUP</small><strong>{currentGroup.code.slice(-2)}</strong></div>
            {practiceGroups.map((group, index) => { const Icon = groupIcons[group.icon]; return <button className={`group-node group-node-${index + 1} ${activeGroup === index ? 'is-active' : ''}`} type="button" role="tab" aria-selected={activeGroup === index} aria-controls="group-dossier" key={group.id} onClick={() => selectGroup(index)}><Icon /><span>0{index + 1}</span><b>{group.title}</b><small>{group.english}</small></button>; })}
          </div>
          <article className="group-dossier" id="group-dossier" role="tabpanel" aria-label={`${currentGroup.title}详情`} key={currentGroup.id}>
            <header><span>{currentGroup.code}</span><GroupIcon /><div><small>{currentGroup.english} UNIT</small><h3>{currentGroup.title}</h3></div></header>
            <p className="group-responsibility">{currentGroup.responsibility}</p><p className="group-intro">{currentGroup.intro}</p>
            <div className="group-brief-grid">
              <section><small>01 / 进入后要做什么</small><ul>{currentGroup.starterTasks.map(item => <li key={item}><Check />{item}</li>)}</ul></section>
              <section><small>02 / 你会收获什么</small><ul>{currentGroup.gains.map(item => <li key={item}><Sparkles />{item}</li>)}</ul></section>
            </div>
            <div className="group-future"><small>03 / 对将来的帮助</small><p>{currentGroup.future}</p></div>
            <button className="group-project-link" type="button" onClick={showGroupProjects}>查看该组参与的项目 <ArrowRight /></button>
          </article>
        </div>
        <div className="path-manifest" data-reveal><span>LEARN</span><i /><span>BUILD</span><i /><span>TEST</span><i /><span>SHARE</span></div>
      </section>

      <section className="project-universe scene-panel" id="projects"><div className="section-shell"><SceneTitle code="02" label="PROJECT NODES" /><Heading kicker="REAL WORKS / 真实作品" title={<>探索项目<br /><em>星图节点</em></>} copy={<>八个节点记录真实搭建、调试与竞赛档案。<br />处理器和奖项只展示已核验信息。</>} />
        <div className="project-explorer" tabIndex={0} role="slider" aria-label="项目星图，可使用左右方向键切换" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={activeProject + 1} aria-valuetext={currentProject.title} onKeyDown={e => { if (e.key === 'ArrowLeft') changeProject(-1); if (e.key === 'ArrowRight') changeProject(1); }} onPointerDown={(e: PointerEvent<HTMLDivElement>) => { swipeStart.current = e.clientX; }} onPointerUp={(e: PointerEvent<HTMLDivElement>) => { if (swipeStart.current === null) return; const d = e.clientX - swipeStart.current; if (Math.abs(d) > 60) changeProject(d > 0 ? -1 : 1); swipeStart.current = null; }}>
          <div className="project-map"><div className="project-map-ring ring-a" /><div className="project-map-ring ring-b" /><div className="project-map-center"><Orbit /><small>NODE</small><strong>0{activeProject + 1}</strong></div>{projects.map((project, index) => { const Icon = projectIcons[project.icon]; return <button className={`project-map-node ${activeProject === index ? 'is-active' : ''}`} style={{ '--node-x': project.mapPosition.x, '--node-y': project.mapPosition.y } as CSSProperties} type="button" key={project.id} onClick={() => { setActiveProject(index); void signal('select'); }} aria-label={`项目 ${index + 1}：${project.title}`} aria-current={activeProject === index ? 'true' : undefined}><Icon /><span>0{index + 1}</span></button>; })}</div>
          <article className="project-dossier" key={currentProject.id}>
            <div className={`dossier-image${currentProject.fallbackVisual ? ' is-fallback-visual' : ''}`}><img src={assetUrl(currentProject.image)} alt={currentProject.fallbackVisual ? `${currentProject.title}获奖证书，作品实拍待补充` : currentProject.title} draggable="false" loading="lazy" />{currentProject.fallbackVisual && <div className="fallback-system-visual" aria-hidden="true"><i /><i /><i /><span>PROJECT IMAGE<br />PENDING</span></div>}<div className="focus-triangle" /><span className="image-scan" /><small>LIVE PROJECT DATA / 0{activeProject + 1}</small><span className={`verification-badge is-${currentProject.verificationStatus}`}>{verificationLabel}</span></div>
            <div className="dossier-copy"><p className="project-category"><ProjectIcon /> {currentProject.category}</p><h3>{currentProject.title}</h3><p>{currentProject.description}</p>
              <dl className="project-facts"><div><dt>PROCESSOR / 主控</dt><dd>{currentProject.processor}</dd></div><div><dt>GROUPS / 参与组别</dt><dd>{currentProject.groupIds.map(id => practiceGroups.find(group => group.id === id)?.title).filter(Boolean).join(' · ')}</dd></div></dl>
              <div className="project-functions"><small>CORE FUNCTIONS / 主要功能</small><ul>{currentProject.functions.map(item => <li key={item}><Check />{item}</li>)}</ul></div>
              <div className="project-awards"><small>ACHIEVEMENTS / 竞赛奖项</small>{currentProject.awards.length ? <div>{currentProject.awards.map(award => <button type="button" key={award.achievementId} onClick={() => openProjectAward(award.achievementId)}><Award /><span><b>{award.label}</b><small>{award.year} · 已核验证书</small></span><Eye /></button>)}</div> : <p><Award />奖项资料待协会补充 <span>不代表该项目未获奖</span></p>}</div>
              <div className="tag-row">{currentProject.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-controls"><Button variant="outline" size="icon-lg" aria-label="上一个项目" onClick={() => changeProject(-1)}><ArrowLeft /></Button><span>0{activeProject + 1} <i /> 0{projects.length}</span><Button variant="outline" size="icon-lg" aria-label="下一个项目" onClick={() => changeProject(1)}><ArrowRight /></Button></div>
            </div>
          </article>
        </div>
      </div></section>

      <section className="archive-section scene-panel section-shell" id="awards"><SceneTitle code="03" label="FIELD ARCHIVE" /><Heading kicker="ACHIEVEMENT RECORDS" title={<>读取<br /><em>成就档案</em></>} copy={<>不是简历上的装饰，而是把作品真正跑通的证明。<br />点击档案读取完整证书。</>} /><div className="archive-grid">{achievements.map((item, index) => <button className={`archive-card accent-${item.accent.toLowerCase()}`} type="button" key={item.id} onClick={() => setActiveAchievement(item)} data-reveal><span className="archive-index">A-0{index + 1}</span><Award /><small>{item.year} / VERIFIED</small><h3>{item.title}</h3><p>{item.level}</p><span className="archive-open"><Eye /> 读取档案</span></button>)}</div></section>

      <section className="replay-section scene-panel" id="reel"><div className="section-shell"><SceneTitle code="04" label="EVENT REPLAY" /><Heading kicker="LIVE EVENT RECORDS" title={<>事件正在<br /><em>重新加载</em></>} copy={<>项目会动起来，人也会聚在一起。<br />点击进入真实活动记录。</>} /><div className="replay-grid">{mediaItems.map((item, index) => <button className="replay-card" type="button" key={item.id} onClick={() => setActiveMedia(item)} data-reveal><img src={assetUrl(item.poster)} alt="" loading="lazy" /><span className="replay-grid-lines" /><span className="replay-play"><Play fill="currentColor" /></span><span className="replay-number">EVENT 0{index + 1}</span><span className="replay-copy"><small>RECORD AVAILABLE</small><b>{item.title}</b><em>{item.subtitle}</em></span></button>)}</div></div></section>

      <section className="memory-section scene-panel section-shell" id="moments"><SceneTitle code="05" label="MEMORY FRAGMENTS" /><div className="memory-heading" data-reveal><p className="system-kicker">WE BUILD TOGETHER</p><h2>真正让作品发光的，<br /><em>是一起做事的人</em></h2></div><div className="memory-grid" data-reveal><Memory className="fragment-a" src="/media/activity-team.jpg" alt="协会成员在竞赛期间交流协作" code="01" label="COMPETITION DAY" /><Memory className="fragment-b" src="/media/activity-share.jpg" alt="创新实践协会技术分享会现场" code="02" label="SHARE & LEARN" /><Memory className="fragment-c" src="/media/activity-tech.jpg" alt="协会科技节活动现场" code="03" label="TECH FESTIVAL" /><Memory className="fragment-d" src="/media/team-lab.jpg" alt="创新实践协会成员实验室合影" code="04" label="ONE TEAM" /></div><blockquote data-reveal>“你可以从不会开始，<br />但不会一个人卡在那里。”</blockquote></section>

      <section className="destination-section scene-panel" id="join"><div className="destination-radar" aria-hidden="true"><ScanLine /><i /><i /></div><div className="section-shell destination-shell"><div className="destination-copy" data-reveal><SceneTitle code="06" label="DESTINATION LOCKED" /><p className="system-kicker"><Radio /> SIGNAL FOUND · 2026</p><h2>你的下一个作品，<br /><em>从这里开始</em></h2><p>不设“大神”门槛。欢迎对电子设计、嵌入式、AI、机器人、软件开发和产品创新保持好奇的你。</p><div className="destination-checks"><span><Check /> 项目制学习</span><span><Check /> 真实竞赛与分享</span></div><div className="wechat-coordinate"><small>CONTACT COORDINATE</small><span>负责人微信</span><strong>surui200708</strong><Button onClick={copyWechat} aria-label="复制负责人微信号">{copied ? <Check /> : <Copy />}{copied ? '已复制' : '复制坐标'}</Button><output className="sr-only" aria-live="polite">{copied ? '微信号已复制' : ''}</output></div></div><div className="destination-links" data-reveal>{recruitmentLinks.map((item, index) => <button className="destination-card" key={item.id} type="button" onClick={() => setActiveQr(item)}><div className="destination-qr"><img src={assetUrl(item.image)} alt={`${item.title}二维码`} /><span><Maximize2 /> 放大坐标</span></div><div><small>DESTINATION 0{index + 1}</small><h3>{item.title}</h3><p>{item.note}</p></div><ExternalLink /></button>)}</div></div></section>

      <footer className="universe-footer"><div><img src={assetUrl('/media/association-logo.jpg')} alt="创新实践协会会徽" /><span><b>广东药科大学创新实践协会</b><small>INTEREST · PRACTICE · CREATION</small></span></div><p>© 2026 GDPU INNOVATION PRACTICE ASSOCIATION</p><button type="button" onClick={() => navigateTo('top')}>RETURN TO CORE <ArrowRight /></button></footer>

      <Dialog open={Boolean(activeAchievement)} onOpenChange={open => !open && setActiveAchievement(null)}><DialogContent className="universe-dialog archive-dialog" showCloseButton><div className="dialog-scan" /><DialogTitle>{activeAchievement?.title}</DialogTitle><DialogDescription>{activeAchievement?.year} · {activeAchievement?.level}</DialogDescription>{activeAchievement && <img src={assetUrl(activeAchievement.image)} alt={`${activeAchievement.title} ${activeAchievement.level}证书`} />}</DialogContent></Dialog>
      <Dialog open={Boolean(activeMedia)} onOpenChange={open => !open && setActiveMedia(null)}><DialogContent className="universe-dialog video-dialog" showCloseButton><DialogTitle>{activeMedia?.title}</DialogTitle><DialogDescription>{activeMedia?.subtitle}</DialogDescription>{activeMedia && <video src={assetUrl(activeMedia.src)} poster={assetUrl(activeMedia.poster)} controls autoPlay playsInline><track kind="captions" src={assetUrl(activeMedia.captions)} srcLang="zh-CN" label="中文场景说明" default /></video>}</DialogContent></Dialog>
      <Dialog open={Boolean(activeQr)} onOpenChange={open => !open && setActiveQr(null)}><DialogContent className="universe-dialog qr-dialog" showCloseButton><DialogTitle>{activeQr?.title}</DialogTitle><DialogDescription>{activeQr?.note}；手机端可长按保存二维码。</DialogDescription>{activeQr && <img src={assetUrl(activeQr.image)} alt={`${activeQr.title}二维码大图`} />}</DialogContent></Dialog>
    </main>
  );
}

function SceneTitle({ code, label }: { code: string; label: string }) { return <div className="scene-title" data-reveal><span>{code}</span><i /><small>{label}</small></div>; }
function Heading({ kicker, title, copy }: { kicker: string; title: React.ReactNode; copy: React.ReactNode }) { return <div className="section-heading-row" data-reveal><div><p className="system-kicker">{kicker}</p><h2>{title}</h2></div><p>{copy}</p></div>; }
function Memory({ className, src, alt, code, label }: { className: string; src: string; alt: string; code: string; label: string }) { return <figure className={`memory-fragment ${className}`}><img src={assetUrl(src)} alt={alt} loading="lazy" /><figcaption><span>MEMORY / {code}</span>{label}</figcaption></figure>; }
