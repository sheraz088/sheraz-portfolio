import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowUp, Github, Mail, Moon, Sun, Menu, X, Code2, Layers, BrainCircuit, Database, Wrench, Sparkles, CheckCheck, Zap, MapPin, Phone, Linkedin, FileText, GraduationCap, ShieldCheck, LockKeyhole, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projects, skills, softSkills } from '@/lib/portfolio';
import resume from '@/assets/resume.asset.json';
const PortfolioScene = lazy(() => import('@/components/PortfolioScene'));
const linkedin = 'https://www.linkedin.com/in/sheraz-dev/';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'sheraz-portfolio' },
    { name: 'description', content: 'Muhammad Sheraz Ajmal — full-stack developer and AI/ML engineer in Islamabad. Explore AI-powered products, real project results, skills, and experience.' },
    { property: 'og:title', content: 'Muhammad Sheraz Ajmal | Full-Stack & AI Developer' },
    { property: 'og:description', content: 'Full-stack web applications powered by AI. Working products, measurable results, and a developer ready for his next opportunity.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Portfolio,
});
const github = 'https://github.com/sheraz088';
const sections = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];
const icons = [Code2, Layers, BrainCircuit, Database, Wrench];
function Emphasis({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong className="metric" key={i}>{part.slice(2, -2)}</strong> : part)}</>;
}
function Label({ children }: { children: ReactNode }) { return <div className="section-label">{children}</div>; }
function ProjectVisual({ kind }: { kind: string }) {
  if (kind === 'voice') return <div className="project-visual" role="img" aria-label="Voice assistant audio waveform"><Mic size={22} className="text-primary"/><div className="voice-wave">{Array.from({length:32},(_,i)=><i key={i}/>)}</div></div>;
  if (kind === 'traffic') return <div className="project-visual traffic-visual" role="img" aria-label="Four-direction traffic monitoring illustration"><svg viewBox="0 0 180 114"><rect x="69" width="42" height="114" className="traffic-road"/><rect y="36" width="180" height="42" className="traffic-road"/>{[[76,8],[96,85],[12,43],[149,61],[39,43],[96,12]].map(([x,y],i)=><rect key={i} x={x} y={y} width="8" height="15" rx="2" className="traffic-car"/>)}<circle cx="117" cy="29" r="4" className="traffic-signal"/><circle cx="61" cy="85" r="4" className="traffic-signal"/></svg><div><strong className="metric">~33 FPS</strong><p className="text-xs text-muted-foreground mt-2">Live vehicle detection</p></div></div>;
  const Left = FileText; const Right = kind === 'quiz' ? GraduationCap : ShieldCheck;
  return <div className="project-visual" role="img" aria-label={kind==='quiz'?'Lecture documents become AI-generated quizzes':'Text passes through an NLP credibility analysis pipeline'}><div className="visual-block"><Left size={22}/><span>{kind==='quiz'?'Lecture notes':'Source text'}</span></div><Sparkles size={19} className="visual-arrow"/><ArrowRight size={16} className="visual-arrow"/><div className="visual-block"><Right size={22}/><span>{kind==='quiz'?'AI-generated quiz':'Credibility analysis'}</span></div></div>;
}
function Portfolio() {
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') !== 'light';
    setDark(saved); document.documentElement.classList.toggle('dark', saved);
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    const nav = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) setActive(entry.target.id); }), { rootMargin:'-15% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(el => nav.observe(el));
    return () => { reveal.disconnect(); nav.disconnect(); };
  }, []);
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('portfolio-theme', next ? 'dark' : 'light'); }
  return <>
    <header className="site-nav"><div className="container nav-inner">
      <a className="wordmark" href="#top" aria-label="Sheraz, back to top">sheraz<span>.</span></a>
      <nav className={`nav-links ${menu ? 'is-open' : ''}`} aria-label="Main navigation">{sections.map(s=><a key={s} href={`#${s.toLowerCase()}`} className={active===s.toLowerCase()?'active':''} onClick={()=>setMenu(false)}>{s}</a>)}</nav>
      <div className="nav-actions"><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dark?'Switch to light theme':'Switch to dark theme'} title={dark?'Light theme':'Dark theme'}>{dark?<Sun/>:<Moon/>}</Button><Button asChild className="nav-contact"><a href="mailto:sheraz.desk@gmail.com">Let's talk <ArrowUpRight/></a></Button><Button className="mobile-menu" variant="ghost" size="icon" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</Button></div>
    </div></header>
    <main id="top">
      <section className="hero container">
        <ClientOnly fallback={null}><Suspense fallback={null}><PortfolioScene dark={dark}/></Suspense></ClientOnly>
        <div className="hero-enter"><div className="availability"><span className="status-dot"/>Open to work · Ready for the next challenge</div><p className="hero-eyebrow">Full-Stack Developer · AI/ML Engineer · Islamabad, Pakistan</p>
        <h1>Hi, I'm Muhammad<br/><span>Sheraz Ajmal.</span><br/>I build web apps powered by AI.</h1></div>
        <div className="hero-enter hero-delay"><p className="hero-description">Computer Science graduate turning machine learning and LLMs into fast,<br className="hidden sm:block"/> user-friendly products — from real-time voice assistants to intelligent traffic systems.</p>
        <div className="hero-buttons"><Button asChild className="portfolio-button"><a href="#projects">View Projects <ArrowUpRight/></a></Button><Button asChild variant="outline" className="portfolio-button"><a href={github} target="_blank" rel="noreferrer"><Github/>GitHub</a></Button><Button asChild variant="outline" className="portfolio-button"><a href="#contact">Contact Me <ArrowUpRight/></a></Button><Button asChild variant="ghost" size="icon" title="LinkedIn profile"><a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin/></a></Button></div><p className="hero-note">Seeking Software Engineer, Full-Stack & AI Engineer roles</p></div>
        <div className="stat-strip hero-enter hero-delay"><div className="stat"><strong>3</strong><p>AI-powered projects shipped</p></div><div className="stat"><strong>Jul–Sep 2026</strong><p>Software Engineer Intern · Digital Scrap</p></div><div className="stat"><strong>React · Next.js · Flask · FastAPI</strong><p>Full-stack, from interface to deployment</p></div><div className="stat"><strong>LLMs · Computer Vision · NLP</strong><p>Applied AI, not just theory</p></div></div>
      </section>
      <section id="about" className="section container reveal"><div className="about-header"><div><Label>A little about me</Label><h2>A developer who connects<br/>the whole picture.</h2></div><p className="section-copy">I'm a Computer Science graduate specializing in full-stack, highly responsive web solutions. I enjoy turning messy, real-world problems into working products — owning the frontend, backend, AI model and deployment.</p></div>
        <div className="reason-grid">{[
          [Code2,'Full-stack + AI in one person','From React/Next.js interfaces to Flask/FastAPI backends and the AI layer.'],
          [CheckCheck,'Real, measurable results','**80%** less manual effort. **33 FPS** real-time detection. Products that work.'],
          [BrainCircuit,'Modern AI, put to work','Llama 3.3 **70B**, Groq, LangChain, Deepgram, OpenAI, OpenCV and SpaCy.'],
          [Zap,'Self-driven. Always learning.','Learned LLM orchestration, computer vision and NLP by building real solutions.'],
        ].map(([Icon,title,text])=>{ const I = Icon as typeof Code2; return <article className="reason" key={String(title)}><div className="reason-icon"><I size={18}/></div><h3>{String(title)}</h3><p><Emphasis text={String(text)}/></p></article>; })}</div>
      </section>
      <section id="skills" className="section skills-section"><div className="container reveal"><div className="section-top"><div><Label>My toolkit</Label><h2>The tools behind the work.</h2></div><p className="section-copy">A full-stack foundation. An applied AI mindset.</p></div><div className="skill-grid">{skills.map((group,i)=>{ const Icon=icons[i] ?? Code2; return <article key={group.label} className="skill-group"><h3><Icon size={16}/>{group.label}</h3><div className="tags">{group.items.map(item=><span className="tag" key={item}>{item}</span>)}</div></article>; })}</div><div className="soft-skills">{softSkills.map(([title,text])=><div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div><p className="coursework"><b>Core coursework</b> · Data Structures & Algorithms · Web Development · Artificial Intelligence · Machine Learning · Database Management · Software Engineering · Computer Networks</p></div></section>
      <section id="projects" className="section container"><div className="section-top reveal"><div><Label>Selected work</Label><h2>What I built.<br/>Why it mattered.</h2></div><p className="section-copy">Real problems. End-to-end solutions. Measurable impact.</p></div><div className="projects-list">{projects.map((project,i)=><article className="project reveal" key={project.name}><div className="project-summary"><div className="project-number"><span>0{i+1} / PROJECT</span><span className="project-type">{project.category}</span></div><h3>{project.name}</h3><p>{project.summary}</p><div className="tags">{project.stack.map(s=><span className="tag" key={s}>{s}</span>)}</div><ProjectVisual kind={project.visual}/>{project.private?<div className="private-label"><LockKeyhole size={13}/>Built at Digital Scrap · Private project</div>:<Button variant="outline" asChild className="portfolio-button"><a href={github} target="_blank" rel="noreferrer"><Github/>View on GitHub <ArrowUpRight/></a></Button>}</div><dl className="project-story">{(['situation','task','action','result'] as const).map(key=><div className={`star-row ${key==='result'?'star-result':''}`} key={key}><dt>{key.charAt(0).toUpperCase()+key.slice(1)}</dt><dd><Emphasis text={project[key]}/></dd></div>)}</dl></article>)}</div><div className="all-repos"><Button asChild variant="link"><a href={`${github}?tab=repositories`} target="_blank" rel="noreferrer">See all repositories on GitHub <ArrowUpRight/></a></Button></div></section>
      <section id="experience" className="section experience-section"><div className="container experience-layout reveal"><div><Label>The journey so far</Label><h2>Experience<br/>& education.</h2></div><div><article className="timeline-item"><span className="timeline-date">JUL 2026 — SEP 2026</span><h3>Software Engineer Intern</h3><h4>Digital Scrap</h4><p>Built a full-stack AI Voice Assistant with React.js and Flask. Delivered real-time speech-to-text with Deepgram and secure sessions with Firebase Authentication.</p></article><article className="timeline-item"><span className="timeline-date">2021 — 2025</span><h3>BS Computer Science</h3><h4>Bahria University · Islamabad</h4><p>A foundation in software engineering, algorithms, databases and applied artificial intelligence.</p></article></div></div></section>
      <section id="contact" className="section contact-section"><div className="container reveal"><div className="contact-heading"><Label>Let's connect</Label><h2>Let's build something together.</h2><p className="section-copy">I'm open to Software Engineer, Full-Stack and AI roles.<br/>Reach out and I'll reply quickly.</p></div><div className="contact-grid"><a className="contact-card" href="mailto:sheraz.desk@gmail.com"><Mail/><div><small>EMAIL ME</small><span>sheraz.desk@gmail.com</span></div><ArrowUpRight className="ml-auto"/></a><a className="contact-card" href="tel:+923005032088"><Phone/><div><small>GIVE ME A CALL</small><span>+92 300 5032088</span></div><ArrowUpRight className="ml-auto"/></a><a className="contact-card" href={github} target="_blank" rel="noreferrer"><Github/><div><small>EXPLORE MY CODE</small><span>github.com/sheraz088</span></div><ArrowUpRight className="ml-auto"/></a></div><div className="contact-extra"><span><MapPin/>Islamabad, Pakistan</span><a href={linkedin} target="_blank" rel="noreferrer"><Linkedin/>LinkedIn <ArrowUpRight/></a></div><div className="resume-note"><Button asChild variant="outline" className="portfolio-button"><a href={resume.url} download="Muhammad-Sheraz-Ajmal-CV.pdf" target="_blank" rel="noreferrer"><FileText/>Download Resume <ArrowUpRight/></a></Button></div></div></section>
    </main><footer><div className="container footer-inner"><span>© 2026 Muhammad Sheraz Ajmal</span><a href="#top">Back to top <ArrowUp size={12}/></a></div></footer>
  </>;
}
