'use client';

/* eslint-disable next/no-img-element, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/prefer-tag-over-role */

import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  CircuitBoard,
  Code2,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  Gauge,
  HeartPulse,
  Maximize2,
  Menu,
  Play,
  Radio,
  Rocket,
  ScanLine,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

export type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  icon: 'health' | 'robot' | 'control' | 'flight' | 'medicine' | 'home';
};

export type Achievement = {
  id: string;
  year: string;
  title: string;
  level: string;
  image: string;
  accent: string;
};

export type MediaItem = {
  id: string;
  type: 'image' | 'video';
  title: string;
  subtitle: string;
  src: string;
  poster?: string;
  captions: string;
};

export type RecruitmentLink = {
  id: 'form' | 'group';
  title: string;
  note: string;
  image: string;
};

const projects: Project[] = [
  {
    id: 'edge-ai',
    title: '多模态肺炎早期筛查系统',
    category: 'EDGE AI · MEDTECH',
    image: '/media/ai-screening.jpg',
    description: '把边缘 AI、医学影像与生命体征监测装进一台可运行的设备，让算法真正抵达应用现场。',
    tags: ['边缘计算', '医学影像', '嵌入式'],
    icon: 'health',
  },
  {
    id: 'robot-arm',
    title: '智能机械臂',
    category: 'ROBOTICS · CONTROL',
    image: '/media/project-arm.jpg',
    description: '从机构搭建、驱动控制到动作编排，用可复现的工程链路完成抓取与交互。',
    tags: ['运动控制', '结构设计', '传感器'],
    icon: 'robot',
  },
  {
    id: 'balance-car',
    title: '车载平衡滚球运动控制系统',
    category: 'NUEDC · MOTION',
    image: '/media/balance-car.jpg',
    description: '融合视觉测量、闭环控制与机械结构，让小球在运动平台上稳定追踪目标。',
    tags: ['PID', '机器视觉', '电机控制'],
    icon: 'control',
  },
  {
    id: 'drone',
    title: '四轴飞行器',
    category: 'FLIGHT · EMBEDDED',
    image: '/media/project-drone.jpg',
    description: '理解姿态、动力与实时系统，在调参和试飞中建立真正的工程直觉。',
    tags: ['姿态解算', '飞控', '无线通信'],
    icon: 'flight',
  },
  {
    id: 'medicine-car',
    title: '自动送药小车',
    category: 'SERVICE ROBOT',
    image: '/media/project-medicine.png',
    description: '面向真实服务场景，完成环境感知、路径执行与人机信息提示。',
    tags: ['视觉识别', '自主移动', '交互'],
    icon: 'medicine',
  },
  {
    id: 'smart-home',
    title: '智能家居系统',
    category: 'IOT · PRODUCT',
    image: '/media/project-home.png',
    description: '连接传感、控制与终端界面，把一个功能原型打磨成完整的产品体验。',
    tags: ['物联网', '无线组网', '产品设计'],
    icon: 'home',
  },
];

const achievements: Achievement[] = [
  {
    id: 'nuedc-2026',
    year: '2026',
    title: '全国大学生电子设计竞赛信息科技前沿专题赛',
    level: '题赛全国三等奖',
    image: '/media/award-2026-national.jpg',
    accent: 'CYAN',
  },
  {
    id: 'nuedc-2025',
    year: '2025',
    title: '全国大学生电子设计竞赛',
    level: '全国二等奖',
    image: '/media/award-2025-national.jpg',
    accent: 'GOLD',
  },
  {
    id: 'bluebridge',
    year: '2025',
    title: '第十六届蓝桥杯大赛',
    level: '软件与电子赛道获奖',
    image: '/media/award-bluebridge.jpg',
    accent: 'BLUE',
  },
  {
    id: 'smarttech',
    year: '2025',
    title: '全国大学生智能技术应用大赛',
    level: '智能技术赛道获奖',
    image: '/media/award-smarttech.jpg',
    accent: 'ORANGE',
  },
];

const mediaItems: MediaItem[] = [
  {
    id: 'tech-video',
    type: 'video',
    title: '第一届科技节',
    subtitle: '把实验台搬到同学们身边',
    src: '/media/video-techfest.mp4',
    poster: '/media/activity-tech.jpg',
    captions: '/media/techfest-zh.vtt',
  },
  {
    id: 'contest-video',
    type: 'video',
    title: '2026 电赛现场',
    subtitle: '问题二 · 稳定完成',
    src: '/media/video-contest.mp4',
    poster: '/media/activity-contest.jpg',
    captions: '/media/contest-zh.vtt',
  },
];

const recruitmentLinks: RecruitmentLink[] = [
  { id: 'form', title: '填写报名问卷', note: '提交你的方向偏好与联系方式', image: '/media/qr-form.png' },
  { id: 'group', title: '加入咨询群', note: '和学长学姐面对面聊聊', image: '/media/qr-group.png' },
];

const projectIcons = {
  health: HeartPulse,
  robot: Cpu,
  control: Gauge,
  flight: Rocket,
  medicine: Radio,
  home: Zap,
};

export default function Home() {
  const projectRailRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeQr, setActiveQr] = useState<RecruitmentLink | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      root.style.setProperty('--mouse-x', `${x}px`);
      root.style.setProperty('--mouse-y', `${y}px`);
      frame = 0;
    };
    const onMove = (event: globalThis.PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const scrollProjects = (direction: number) => {
    projectRailRef.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.72, 520), behavior: 'smooth' });
  };

  const handleRailPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rail = projectRailRef.current;
    if (!rail) return;
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  };

  const handleRailPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = projectRailRef.current;
    if (!rail || !dragRef.current.active) return;
    rail.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX) * 1.15;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    projectRailRef.current?.classList.remove('is-dragging');
    if (projectRailRef.current?.hasPointerCapture(event.pointerId)) {
      projectRailRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const handleTilt = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty('--tilt-x', `${y * -7}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 8}deg`);
  };

  const resetTilt = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText('surui200708');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell">
      <div className="circuit-grid" aria-hidden="true" />
      <div className="pointer-glow" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="返回首页" onClick={closeMenu}>
          <img src="/media/association-logo.jpg" alt="广东药科大学创新实践协会会徽" />
          <span>
            <b>GDP·U 创新实践协会</b>
            <small>INNOVATION PRACTICE ASSOCIATION</small>
          </span>
        </a>
        <button className="menu-toggle" type="button" aria-label="打开导航" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>关于创协</a>
          <a href="#projects" onClick={closeMenu}>项目实验室</a>
          <a href="#awards" onClick={closeMenu}>竞赛战绩</a>
          <a href="#moments" onClick={closeMenu}>现场记录</a>
          <a href="#join" onClick={closeMenu} className="nav-cta">立即加入</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles /> 2026 AUTUMN RECRUITMENT</p>
          <h1>
            把想法
            <span>焊成现实</span>
          </h1>
          <p className="hero-lead">用代码创造世界。这里不围观未来，我们亲手把它做出来。</p>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#join">加入创协 <ArrowDownRight /></a>
            <a className="text-button" href="#projects">探索真实作品</a>
          </div>
          <dl className="hero-stats">
            <div><dt>2015</dt><dd>协会成立</dd></div>
            <div><dt>06+</dt><dd>实践方向</dd></div>
            <div><dt>全国奖项</dt><dd>赛场验证</dd></div>
          </dl>
        </div>

        <div className="hero-visual" aria-label="协会项目与团队实拍">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <figure className="hero-photo main-photo">
            <img src="/media/team-lab.jpg" alt="创新实践协会成员在实验室合影" />
            <figcaption>TEAM / 2025</figcaption>
          </figure>
          <figure className="hero-photo device-photo">
            <img src="/media/balance-car.jpg" alt="车载平衡滚球运动控制系统" />
            <figcaption>BUILD / 01</figcaption>
          </figure>
          <div className="signal-card"><CircuitBoard /><span>HARDWARE<br />ONLINE</span><i /></div>
          <div className="coordinate-tag">23.0440° N<br />112.0442° E</div>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ChevronDown /></a>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-index" data-reveal><span>01</span><i />ABOUT THE ASSOCIATION</div>
        <div className="about-grid">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">WHY CHUANGXIE</p>
            <h2>兴趣驱动，<br /><em>自主实践。</em></h2>
          </div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">创新实践协会成立于 2015 年。我们相信，最好的学习发生在“真的做一个东西”时。</p>
            <p>这里有愿意陪你查波形、改结构、跑代码的人，也有真实的竞赛、分享会和工程项目。你不需要带着满级技能来，只需要带上好奇心和把问题追到底的耐心。</p>
            <div className="principles">
              <span><Code2 /> 软件与算法</span>
              <span><Cpu /> 嵌入式系统</span>
              <span><CircuitBoard /> 硬件与电路</span>
              <span><Rocket /> 创意与产品</span>
            </div>
          </div>
        </div>
        <div className="manifesto" data-reveal aria-label="协会理念">
          <span>LEARN</span><i />
          <span>BUILD</span><i />
          <span>TEST</span><i />
          <span>SHARE</span>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-shell">
          <div className="section-index" data-reveal><span>02</span><i />PROJECT LAB</div>
          <div className="section-head-row" data-reveal>
            <div className="section-heading compact">
              <p className="eyebrow">REAL WORKS / 真实作品</p>
              <h2>从第一行代码，<br />到第一次上场。</h2>
            </div>
            <div className="rail-actions" aria-label="项目浏览控制">
              <Button variant="outline" size="icon-lg" aria-label="上一个项目" onClick={() => scrollProjects(-1)}><ArrowLeft /></Button>
              <Button variant="outline" size="icon-lg" aria-label="下一个项目" onClick={() => scrollProjects(1)}><ArrowRight /></Button>
            </div>
          </div>
        </div>
        <div
          className="project-rail"
          ref={projectRailRef}
          tabIndex={0}
          role="region"
          aria-label="可拖动的项目作品列表"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') scrollProjects(-1);
            if (event.key === 'ArrowRight') scrollProjects(1);
          }}
          onPointerDown={handleRailPointerDown}
          onPointerMove={handleRailPointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
        >
          {projects.map((project, index) => {
            const Icon = projectIcons[project.icon];
            return (
              <article className="project-card" key={project.id} onMouseMove={handleTilt} onMouseLeave={resetTilt}>
                <div className="project-image-wrap">
                  <img src={project.image} alt={project.title} loading={index > 1 ? 'lazy' : undefined} draggable="false" />
                  <span className="project-number">0{index + 1}</span>
                  <div className="project-scan" aria-hidden="true" />
                </div>
                <div className="project-content">
                  <p className="project-category"><Icon />{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="drag-hint"><ArrowLeft /> DRAG OR USE ARROW KEYS <ArrowRight /></p>
      </section>

      <section className="awards section-shell" id="awards">
        <div className="section-index" data-reveal><span>03</span><i />FIELD PROVEN</div>
        <div className="award-intro" data-reveal>
          <div className="section-heading compact">
            <p className="eyebrow">ACHIEVEMENTS / 竞赛战绩</p>
            <h2>不是简历上的装饰，<br /><em>是把作品跑通的证明。</em></h2>
          </div>
          <p>从校内实验台到全国赛场，每一张证书背后都有反复调试、通宵排错和团队协作。点击查看真实获奖材料。</p>
        </div>
        <div className="awards-grid">
          {achievements.map((item, index) => (
            <button className={`award-card accent-${item.accent.toLowerCase()}`} type="button" key={item.id} onClick={() => setActiveAchievement(item)} data-reveal>
              <span className="award-year">{item.year}</span>
              <div className="award-icon"><Award /></div>
              <div>
                <p>{item.title}</p>
                <h3>{item.level}</h3>
              </div>
              <span className="award-open"><Eye /> 查看证书</span>
              <span className="award-rank">NO. 0{index + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="reel-section" aria-labelledby="reel-title">
        <div className="section-shell">
          <div className="section-index" data-reveal><span>04</span><i />IN MOTION</div>
          <div className="section-head-row" data-reveal>
            <div className="section-heading compact">
              <p className="eyebrow">LIVE REEL / 活动影像</p>
              <h2 id="reel-title">项目会动起来，<br />人也会聚在一起。</h2>
            </div>
            <p className="section-side-copy">点击播放真实活动片段。<br />声音默认关闭，由你决定何时进入现场。</p>
          </div>
          <div className="video-grid">
            {mediaItems.map((item, index) => (
              <button className="video-card" type="button" key={item.id} onClick={() => setActiveMedia(item)} data-reveal>
                <img src={item.poster} alt="" loading="lazy" />
                <span className="video-shade" />
                <span className="play-button"><Play fill="currentColor" /></span>
                <span className="video-meta"><small>0{index + 1} / FILM</small><b>{item.title}</b><em>{item.subtitle}</em></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="moments section-shell" id="moments">
        <div className="section-index" data-reveal><span>05</span><i />PEOPLE & MOMENTS</div>
        <div className="moments-head" data-reveal>
          <div className="section-heading compact">
            <p className="eyebrow">WE BUILD TOGETHER</p>
            <h2>真正让作品发光的，<br />是一起做事的人。</h2>
          </div>
        </div>
        <div className="film-wall" data-reveal>
          <figure className="film film-a"><img src="/media/activity-team.jpg" alt="协会成员在竞赛期间交流协作" loading="lazy" /><figcaption>COMPETITION DAY</figcaption></figure>
          <figure className="film film-b"><img src="/media/activity-share.jpg" alt="创新实践协会技术分享会现场" loading="lazy" /><figcaption>SHARE & LEARN</figcaption></figure>
          <figure className="film film-c"><img src="/media/activity-tech.jpg" alt="协会科技节活动现场" loading="lazy" /><figcaption>TECH FESTIVAL</figcaption></figure>
          <figure className="film film-d"><img src="/media/team-lab.jpg" alt="创新实践协会成员实验室合影" loading="lazy" /><figcaption>ONE TEAM</figcaption></figure>
        </div>
        <blockquote data-reveal>“你可以从不会开始，但不会一个人卡在那里。”</blockquote>
      </section>

      <section className="join-section" id="join">
        <div className="join-grid-bg" aria-hidden="true" />
        <div className="join-orb" aria-hidden="true"><ScanLine /></div>
        <div className="section-shell join-shell">
          <div className="join-copy" data-reveal>
            <p className="eyebrow"><Radio /> SIGNAL FOUND · 2026</p>
            <h2>你的下一个作品，<br /><em>从这里开始。</em></h2>
            <p>不设“大神”门槛。欢迎对电子设计、嵌入式、AI、机器人、软件开发和产品创新保持好奇的你。</p>
            <div className="join-checks">
              <span><Check /> 零基础可加入</span>
              <span><Check /> 项目制学习</span>
              <span><Check /> 真实竞赛与分享</span>
            </div>
            <div className="wechat-panel">
              <span>负责人微信</span>
              <strong>surui200708</strong>
              <Button className="copy-button" onClick={copyWechat} aria-label="复制负责人微信号">
                {copied ? <Check /> : <Copy />}{copied ? '已复制' : '复制微信号'}
              </Button>
              <output aria-live="polite" className="sr-only">{copied ? '微信号已复制' : ''}</output>
            </div>
          </div>

          <div className="qr-stack" data-reveal>
            {recruitmentLinks.map((item, index) => (
              <button className="qr-card" key={item.id} type="button" onClick={() => setActiveQr(item)}>
                <div className="qr-image"><img src={item.image} alt={`${item.title}二维码`} /><span><Maximize2 /> 放大</span></div>
                <div><small>STEP 0{index + 1}</small><h3>{item.title}</h3><p>{item.note}</p></div>
                <ExternalLink className="qr-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/media/association-logo.jpg" alt="创新实践协会会徽" />
          <span><b>广东药科大学创新实践协会</b><small>兴趣驱动 · 自主实践 · 重在过程</small></span>
        </div>
        <p>© 2026 GDP·U INNOVATION PRACTICE ASSOCIATION</p>
        <a href="#top">BACK TO TOP <ArrowRight /></a>
      </footer>

      <Dialog open={Boolean(activeAchievement)} onOpenChange={(open) => !open && setActiveAchievement(null)}>
        <DialogContent className="media-dialog award-dialog" showCloseButton>
          <DialogTitle>{activeAchievement?.title}</DialogTitle>
          <DialogDescription>{activeAchievement?.year} · {activeAchievement?.level}</DialogDescription>
          {activeAchievement && <img src={activeAchievement.image} alt={`${activeAchievement.title} ${activeAchievement.level}证书`} />}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeMedia)} onOpenChange={(open) => !open && setActiveMedia(null)}>
        <DialogContent className="media-dialog video-dialog" showCloseButton>
          <DialogTitle>{activeMedia?.title}</DialogTitle>
          <DialogDescription>{activeMedia?.subtitle}</DialogDescription>
          {activeMedia && (
            <video src={activeMedia.src} poster={activeMedia.poster} controls autoPlay playsInline>
              <track kind="captions" src={activeMedia.captions} srcLang="zh-CN" label="中文场景说明" default />
            </video>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeQr)} onOpenChange={(open) => !open && setActiveQr(null)}>
        <DialogContent className="qr-dialog" showCloseButton>
          <DialogTitle>{activeQr?.title}</DialogTitle>
          <DialogDescription>{activeQr?.note}；手机端可长按保存二维码。</DialogDescription>
          {activeQr && <img src={activeQr.image} alt={`${activeQr.title}二维码大图`} />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
