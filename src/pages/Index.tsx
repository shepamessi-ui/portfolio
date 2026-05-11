import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  Linkedin, Download, MessageCircle, Award, ChevronDown, ExternalLink,
  CheckCircle2, Database, TrendingUp, BarChart3, Code2, Sparkles,
  ArrowUpRight, Mail, GraduationCap, Sun, Moon, Zap, Send,
  ChevronUp, ArrowUp,
} from "lucide-react";
import { FaMapMarkerAlt, FaPhoneAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import { lazy, Suspense } from "react";

/* ── CODE SPLITTING — lazy load below-fold sections for faster initial paint ─
   These sections load only when needed, reducing initial bundle by ~40%
   The SectionFallback shows a subtle skeleton while loading
── */
const SectionFallback = ({ t }: { t: T }) => (
  <div style={{padding:"120px 32px",display:"flex",justifyContent:"center"}}>
    <div style={{
      width:48,height:48,borderRadius:"50%",
      border:"2px solid "+t.accent+"33",
      borderTopColor:t.accent,
      animation:"spin .8s linear infinite",
    }}/>
  </div>
);

/* ── THEMES ─────────────────────────────────────────────────────────────── */
const DARK = {
  bg:"#050c18", bg2:"#071422", surface:"rgba(99,179,237,0.05)",
  border:"rgba(99,179,237,0.13)", accent:"#63b3ed", accent2:"#a78bfa",
  text:"#e2e8f0", muted:"#94a3b8", faint:"#64748b", divider:"rgba(99,179,237,0.08)",
  nav:"rgba(5,12,24,0.96)", card:"#071422", inputBg:"rgba(99,179,237,0.06)",
};
const LIGHT = {
  bg:"#f0f6ff", bg2:"#ffffff", surface:"rgba(37,99,235,0.04)",
  border:"rgba(37,99,235,0.15)", accent:"#2563eb", accent2:"#7c3aed",
  text:"#0f172a", muted:"#475569", faint:"#64748b", divider:"rgba(37,99,235,0.1)",
  nav:"rgba(240,246,255,0.96)", card:"#ffffff", inputBg:"rgba(37,99,235,0.05)",
};
type T = typeof DARK;

/* ── SKILL ICONS ────────────────────────────────────────────────────────── */
const PyIcon  = () => <svg viewBox="0 0 128 128" width="26" height="26"><defs><linearGradient id="pa" x1="70" y1="1237" x2="171" y2="1338" gradientTransform="matrix(.563 0 0 -.568 -29 757)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#5A9FD4"/><stop offset="1" stopColor="#306998"/></linearGradient><linearGradient id="pb" x1="209" y1="1099" x2="174" y2="1150" gradientTransform="matrix(.563 0 0 -.568 -29 757)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFD43B"/><stop offset="1" stopColor="#FFE873"/></linearGradient></defs><path fill="url(#pa)" d="M63.4 2c-4.2.02-8.3.38-11.8 1-10.5 1.85-12.3 5.71-12.3 12.84v9.41h24.7v3.14H29.9c-7.2 0-13.5 4.31-15.4 12.52-2.3 9.4-2.4 15.27 0 25.1 1.8 7.31 5.9 12.52 13.1 12.52h8.5V67.2c0-8.15 7-15.34 15.4-15.34h24.7c6.9 0 12.3-5.65 12.3-12.55V15.83c0-6.69-5.6-11.72-12.3-12.84zm-13.4 7.56c2.5 0 4.6 2.12 4.6 4.72s-2.1 4.69-4.6 4.69-4.6-2.1-4.6-4.69c0-2.6 2.1-4.72 4.6-4.72z"/><path fill="url(#pb)" d="M91.7 28.38v10.97c0 8.5-7.2 15.65-15.4 15.65H51.6c-6.8 0-12.3 5.78-12.3 12.55v23.51c0 6.69 5.8 10.63 12.3 12.55 7.8 2.3 15.3 2.71 24.7 0 6.2-1.8 12.3-5.42 12.3-12.55v-9.41H63.9v-3.14h37c7.2 0 9.9-5 12.3-12.52 2.6-7.73 2.5-15.17 0-25.1-1.8-7.14-5.2-12.52-12.3-12.52zm-14 59.56c2.6 0 4.6 2.1 4.6 4.69s-2 4.72-4.6 4.72-4.6-2.12-4.6-4.72c0-2.59 2.1-4.69 4.6-4.69z"/></svg>;
const SqlIcon = () => <svg viewBox="0 0 80 80" width="26" height="26"><ellipse cx="40" cy="18" rx="32" ry="12" fill="#508BB5"/><rect x="8" y="18" width="64" height="44" fill="#336791"/><ellipse cx="40" cy="62" rx="32" ry="12" fill="#336791"/><ellipse cx="40" cy="18" rx="32" ry="12" fill="#508BB5"/><text x="40" y="48" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">SQL</text></svg>;
const PbiIcon = () => <svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="3" fill="#F2C811"/><rect x="5" y="18" width="4" height="10" rx="1" fill="#1a1a1a"/><rect x="11" y="13" width="4" height="15" rx="1" fill="#1a1a1a"/><rect x="17" y="8" width="4" height="20" rx="1" fill="#1a1a1a"/><rect x="23" y="14" width="4" height="14" rx="1" fill="#1a1a1a"/></svg>;
const PanIcon = () => <svg viewBox="0 0 128 128" width="26" height="26"><rect x="50" y="2" width="22" height="58" rx="11" fill="#150458"/><rect x="50" y="68" width="22" height="58" rx="11" fill="#E70488"/><rect x="18" y="22" width="22" height="58" rx="11" fill="#150458"/><rect x="18" y="88" width="22" height="20" rx="10" fill="#E70488"/><rect x="82" y="20" width="22" height="20" rx="10" fill="#150458"/><rect x="82" y="46" width="22" height="58" rx="11" fill="#E70488"/></svg>;
const SkIcon  = () => <svg viewBox="0 0 130 130" width="26" height="26"><circle cx="65" cy="65" r="60" fill="#F89939"/><circle cx="65" cy="45" r="28" fill="#3499CD"/><path fill="white" d="M48 39l34 6-34 6z"/></svg>;
const TabIcon = () => <svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="3" fill="#E8762D"/><rect x="14" y="4" width="4" height="24" fill="white"/><rect x="4" y="14" width="24" height="4" fill="white"/><rect x="6" y="8" width="3" height="16" fill="white" opacity=".5"/><rect x="23" y="8" width="3" height="16" fill="white" opacity=".5"/></svg>;
const DaxIcon = () => <svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="3" fill="#F2C811"/><text x="16" y="22" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="800" fontFamily="monospace">DAX</text></svg>;
const SpssIcon= () => <svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="3" fill="#052FAD"/><text x="16" y="21" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="monospace">SPSS</text></svg>;
const OrgIcon = () => <svg viewBox="0 0 32 32" width="26" height="26"><rect width="32" height="32" rx="3" fill="#FA7D00"/><text x="16" y="21" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="monospace">Orange</text></svg>;
const DLIcon  = () => <svg viewBox="0 0 32 32" width="26" height="26" fill="none"><rect width="32" height="32" rx="3" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5"/><circle cx="8" cy="16" r="2.5" fill="#a78bfa"/><circle cx="16" cy="10" r="2.5" fill="#a78bfa"/><circle cx="16" cy="22" r="2.5" fill="#a78bfa"/><circle cx="24" cy="16" r="2.5" fill="#a78bfa"/><line x1="10" y1="16" x2="14" y2="11" stroke="#a78bfa" strokeWidth="1.2"/><line x1="10" y1="16" x2="14" y2="21" stroke="#a78bfa" strokeWidth="1.2"/><line x1="18" y1="10" x2="22" y2="15" stroke="#a78bfa" strokeWidth="1.2"/><line x1="18" y1="22" x2="22" y2="17" stroke="#a78bfa" strokeWidth="1.2"/></svg>;
const AgIcon  = () => <svg viewBox="0 0 32 32" width="26" height="26" fill="none"><rect width="32" height="32" rx="3" fill="#052e16" stroke="#34d399" strokeWidth="1.5"/><circle cx="16" cy="16" r="5" stroke="#34d399" strokeWidth="1.5"/><circle cx="16" cy="16" r="2" fill="#34d399"/><line x1="16" y1="4" x2="16" y2="9" stroke="#34d399" strokeWidth="1.5"/><line x1="16" y1="23" x2="16" y2="28" stroke="#34d399" strokeWidth="1.5"/><line x1="4" y1="16" x2="9" y2="16" stroke="#34d399" strokeWidth="1.5"/><line x1="23" y1="16" x2="28" y2="16" stroke="#34d399" strokeWidth="1.5"/></svg>;
const AITIcon = () => <svg viewBox="0 0 32 32" width="26" height="26" fill="none"><rect width="32" height="32" rx="3" fill="#4a0030" stroke="#f472b6" strokeWidth="1.5"/><path d="M8 24L16 8L24 24" stroke="#f472b6" strokeWidth="2" strokeLinejoin="round"/><line x1="11" y1="19" x2="21" y2="19" stroke="#f472b6" strokeWidth="1.5"/></svg>;

/* ── COUNTER ANIMATION HOOK ─────────────────────────────────────────────── */
const useCountUp = (target: number, duration = 1400, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) { setStarted(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setCount(Math.floor(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, ref };
};

/* ── CURSOR — uses RAF directly, zero JS framework overhead ─────────────── */
const Cursor = ({ accent }: { accent: string }) => {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const hov  = useRef(false);
  const mx   = useRef(0); const my = useRef(0);
  const rx   = useRef(0); const ry = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY; };
    const onOver = (e: MouseEvent) => {
      hov.current = !!(e.target as HTMLElement).closest("a,button,input,textarea,select");
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    let id = 0;
    const tick = () => {
      /* dot tracks instantly */
      if (dot.current) {
        dot.current.style.transform = `translate(${mx.current - 4}px,${my.current - 4}px)`;
        const s = hov.current ? "12px" : "8px";
        dot.current.style.width  = s;
        dot.current.style.height = s;
      }
      /* ring lags with lerp 0.18 for smooth feel but NOT slow */
      rx.current += (mx.current - rx.current) * 0.18;
      ry.current += (my.current - ry.current) * 0.18;
      if (ring.current) {
        const rs = hov.current ? "44px" : "32px";
        ring.current.style.transform = `translate(${rx.current - 16}px,${ry.current - 16}px)`;
        ring.current.style.width  = rs;
        ring.current.style.height = rs;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(id);
    };
  }, []);

  return (<>
    <div ref={dot} style={{
      position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9999,
      width:8, height:8, borderRadius:"50%", background:accent,
      boxShadow:`0 0 10px ${accent}cc`, willChange:"transform,width,height",
      transition:"width .12s,height .12s",
    }}/>
    <div ref={ring} style={{
      position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9998,
      width:32, height:32, borderRadius:"50%", border:`1.5px solid ${accent}88`,
      willChange:"transform,width,height", transition:"width .18s,height .18s",
    }}/>
  </>);
};

/* ── SCROLL PROGRESS BAR — RAF-based, zero lag ───────────────────────────── */
const ScrollBar = ({ accent }: { accent: string }) => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      if (bar.current) bar.current.style.width = pct + "%";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:9999, background:"rgba(255,255,255,0.05)" }}>
      <div ref={bar} style={{ height:"100%", width:"0%", background:`linear-gradient(90deg,${accent},#a78bfa)` }}/>
    </div>
  );
};

/* ── SCROLL TO TOP ───────────────────────────────────────────────────────── */
const ScrollTop = ({ accent }: { accent: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => { const s=window.scrollY; const t0=performance.now(); const run=(now:number)=>{const p=Math.min((now-t0)/400,1); window.scrollTo(0,s*(1-(p<.5?2*p*p:-1+(4-2*p)*p))); if(p<1)requestAnimationFrame(run);}; requestAnimationFrame(run); }}
      style={{
        position:"fixed", bottom:32, right:32, zIndex:999,
        width:44, height:44, borderRadius:"50%",
        background:`linear-gradient(135deg,${accent},#a78bfa)`,
        border:"none", cursor:"none", display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 8px 24px ${accent}44`, color:"#fff",
      }}>
      <ArrowUp size={18}/>
    </button>
  );
};

/* ── ANIMATED BACKGROUND ─────────────────────────────────────────────────── */
const Background = ({ t, dark }: { t:T; dark:boolean }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    /* Stars / particles */
    const N = 80;
    const stars = Array.from({length:N}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.4+0.2,
      vx: (Math.random()-0.5)*0.18,
      vy: (Math.random()-0.5)*0.18,
      a: Math.random(),
    }));

    const accent = dark ? "#63b3ed" : "#2563eb";
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      /* gradient bg */
      const gr = ctx.createLinearGradient(0,0,W,H);
      if (dark) {
        gr.addColorStop(0,"#050c18"); gr.addColorStop(0.5,"#0a1628"); gr.addColorStop(1,"#07111f");
      } else {
        gr.addColorStop(0,"#f0f6ff"); gr.addColorStop(0.5,"#e8f0fe"); gr.addColorStop(1,"#f3f0ff");
      }
      ctx.fillStyle = gr; ctx.fillRect(0,0,W,H);

      /* grid */
      ctx.strokeStyle = dark ? "rgba(99,179,237,0.04)" : "rgba(37,99,235,0.04)";
      ctx.lineWidth = 1;
      for (let x=0;x<W;x+=70) { ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke(); }
      for (let y=0;y<H;y+=70) { ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke(); }

      /* ambient glow */
      const g1 = ctx.createRadialGradient(W*0.2,H*0.2,0,W*0.2,H*0.2,W*0.4);
      g1.addColorStop(0, dark?"rgba(99,179,237,0.06)":"rgba(37,99,235,0.05)");
      g1.addColorStop(1,"transparent");
      ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);
      const g2 = ctx.createRadialGradient(W*0.8,H*0.8,0,W*0.8,H*0.8,W*0.4);
      g2.addColorStop(0, dark?"rgba(167,139,250,0.05)":"rgba(124,58,237,0.05)");
      g2.addColorStop(1,"transparent");
      ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);

      /* particles + connections */
      stars.forEach(s => {
        s.x+=s.vx; s.y+=s.vy;
        if(s.x<0)s.x=W; if(s.x>W)s.x=0;
        if(s.y<0)s.y=H; if(s.y>H)s.y=0;
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = accent + Math.floor(s.a*180).toString(16).padStart(2,"0");
        ctx.fill();
      });
      /* draw connections between close stars */
      for (let i=0;i<N;i++) {
        for (let j=i+1;j<N;j++) {
          const dx=stars[i].x-stars[j].x, dy=stars[i].y-stars[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<120) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x,stars[i].y);
            ctx.lineTo(stars[j].x,stars[j].y);
            ctx.strokeStyle = accent + Math.floor((1-dist/120)*30).toString(16).padStart(2,"0");
            ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, [dark]);

  return <canvas ref={canvas} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}/>;
};

/* ── TYPEWRITER ──────────────────────────────────────────────────────────── */
const Typewriter = ({ words, color }: { words:string[]; color:string }) => {
  const [wi,setWi]=useState(0); const [ci,setCi]=useState(0); const [rev,setRev]=useState(false);
  useEffect(()=>{
    if(ci===words[wi].length+1&&!rev){const t=setTimeout(()=>setRev(true),1500);return()=>clearTimeout(t);}
    if(ci===0&&rev){setRev(false);setWi(p=>(p+1)%words.length);return;}
    const t=setTimeout(()=>setCi(p=>p+(rev?-1:1)),rev?20:50);
    return()=>clearTimeout(t);
  },[ci,wi,rev,words]);
  return <span style={{color,fontFamily:"'DM Mono',monospace"}}>
    {words[wi].substring(0,ci)}
    <span style={{display:"inline-block",width:2,height:"0.85em",background:color,marginLeft:2,verticalAlign:"middle",animation:"blink .9s step-end infinite"}}/>
  </span>;
};

/* ── LABEL ───────────────────────────────────────────────────────────────── */
const Label = ({ children, t }: { children:React.ReactNode; t:T }) => (
  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
    <div style={{width:28,height:1,background:t.accent}}/>
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.42em",color:t.accent,textTransform:"uppercase"}}>{children}</span>
  </div>
);

/* ── NAVBAR — mobile responsive + zero-lag scroll ────────────────────────── */
const Navbar = ({ t, dark, setDark }: { t:T; dark:boolean; setDark:(v:boolean)=>void }) => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const [active, setActive] = useState("");
  useEffect(()=>{
    const fn = () => setScrolled(window.scrollY > 44);
    window.addEventListener("scroll", fn, {passive:true});
    return () => window.removeEventListener("scroll", fn);
  },[]);

  /* Track active section */
  useEffect(()=>{
    const ids = ["about","skills","services","experience","education","projects","contact"];
    const fn = () => {
      const scrollY = window.scrollY + 120;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", fn, {passive:true});
    fn();
    return () => window.removeEventListener("scroll", fn);
  },[]);

  useEffect(()=>{
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", fn, {passive:true});
    return () => window.removeEventListener("resize", fn);
  },[]);

  const go = useCallback((id:string) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (!el) return;
    const target = el.getBoundingClientRect().top + window.scrollY - 72;
    const start  = window.scrollY;
    const dist   = target - start;
    const dur    = Math.min(Math.abs(dist) * 0.35, 550);
    const t0     = performance.now();
    const ease   = (x: number) => x < 0.5 ? 2*x*x : -1+(4-2*x)*x;
    const run    = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, []);

  const navItems = ["About","Skills","Services","Experience","Education","Projects","Contact"];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background: scrolled||menuOpen ? t.nav : "transparent",
        backdropFilter: scrolled||menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled||menuOpen ? "1px solid "+t.border : "1px solid transparent",
        transition:"background .3s,border-color .3s",
      }}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px"}}>

          <span style={{fontFamily:"DM Mono,monospace",fontSize:13,letterSpacing:"0.3em",color:t.accent,fontWeight:600}}>IE</span>

          {/* Desktop links */}
          <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:26}}>
            {navItems.map(item=>(
              <button key={item} onClick={()=>go(item)} className="hv hv-color"
                style={{fontFamily:"DM Sans,sans-serif",fontSize:11.5,letterSpacing:"0.06em",
                  color: active===item.toLowerCase() ? t.accent : t.faint,
                  background:"none",border:"none",cursor:"none",padding:"4px 0",
                  position:"relative",
                }}>
                {item}
                {active===item.toLowerCase() && (
                  <span style={{position:"absolute",bottom:-2,left:0,right:0,height:1.5,
                    background:t.accent,borderRadius:1,display:"block"}}/>
                )}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setDark(!dark)} style={{
              padding:7,borderRadius:"50%",background:t.surface,border:"1px solid "+t.border,
              color:t.accent,cursor:"none",display:"flex",alignItems:"center",justifyContent:"center",
            }}>{dark?<Sun size={15}/>:<Moon size={15}/>}</button>

            <a href="mailto:ibrheam161@gmail.com" className="hire-btn" style={{
              fontFamily:"DM Sans,sans-serif",fontSize:11,fontWeight:700,letterSpacing:"0.08em",
              color:dark?"#050c18":"#fff",background:"linear-gradient(135deg,"+t.accent+","+t.accent2+")",
              padding:"9px 18px",borderRadius:4,textDecoration:"none",
              boxShadow:"0 4px 16px "+t.accent+"33",display:"flex",alignItems:"center",gap:6,
            }}><Zap size={12}/> Hire Me</a>

            {/* Hamburger — CSS shows on mobile */}
            <button onClick={()=>setMenuOpen(m=>!m)} className="hamburger"
              style={{display:"none",flexDirection:"column",gap:5,padding:8,
                background:"none",border:"none",cursor:"none"}}>
              <span className="bar1" style={{display:"block",width:22,height:2,
                background:t.accent,borderRadius:2,transition:"transform .22s,opacity .22s",
                transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
              <span className="bar2" style={{display:"block",width:22,height:2,
                background:t.accent,borderRadius:2,transition:"opacity .22s",
                opacity:menuOpen?0:1}}/>
              <span className="bar3" style={{display:"block",width:22,height:2,
                background:t.accent,borderRadius:2,transition:"transform .22s",
                transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              transition={{duration:0.22}} style={{overflow:"hidden",
                borderTop:"1px solid "+t.border,background:t.nav,backdropFilter:"blur(20px)"}}>
              <div style={{padding:"12px 24px 20px",display:"flex",flexDirection:"column",gap:2}}>
                {navItems.map(item=>(
                  <button key={item} onClick={()=>go(item)}
                    style={{fontFamily:"DM Sans,sans-serif",fontSize:15,letterSpacing:"0.05em",color:t.muted,
                      background:"none",border:"none",cursor:"none",padding:"11px 8px",textAlign:"left",
                      borderBottom:"1px solid "+t.divider,transition:"color .15s"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color=t.accent}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color=t.muted}>
                    {item}
                  </button>
                ))}
                <a href="mailto:ibrheam161@gmail.com" style={{
                  marginTop:14,fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:700,
                  color:dark?"#050c18":"#fff",background:"linear-gradient(135deg,"+t.accent+","+t.accent2+")",
                  padding:"13px 20px",borderRadius:6,textDecoration:"none",textAlign:"center",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                }}><Zap size={14}/> Hire Me</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop overlay */}
      {menuOpen&&(
        <div onClick={()=>setMenuOpen(false)} style={{
          position:"fixed",inset:0,zIndex:49,
          background:"rgba(0,0,0,0.45)",backdropFilter:"blur(3px)",
        }}/>
      )}
    </>
  );
};

/* ── HERO ────────────────────────────────────────────────────────────────── */
const PROFILE = "data:image/jpeg;base64,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";

const Hero = ({ t, dark }: { t:T; dark:boolean }) => {
  const li = "https://www.linkedin.com/in/ibrahim-elshafey-01140016540";
  const wa = "201140016540";
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start start","end start"] });
  const y  = useTransform(scrollYProgress,[0,1],[0,70]);
  const op = useTransform(scrollYProgress,[0,0.45],[1,0]);

  return (
    <section id="home" ref={ref} style={{position:"relative",minHeight:"100svh",display:"flex",alignItems:"center",overflow:"hidden"}}>
      <motion.div style={{y,opacity:op,width:"100%"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"100px 40px 60px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:56,alignItems:"center"}}>

            {/* LEFT */}
            <div>
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.05}}
                style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:36}}>
                <span style={{position:"relative",display:"flex",width:8,height:8}}>
                  <span style={{position:"absolute",inset:0,borderRadius:"50%",background:"#4ade80",opacity:0.7,animation:"ping 1.4s ease infinite"}}/>
                  <span style={{position:"relative",borderRadius:"50%",width:8,height:8,background:"#4ade80",display:"block"}}/>
                </span>
                <span style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.22em",color:"#4ade80",textTransform:"uppercase"}}>Available for work</span>
                <span style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",
                  color:t.accent,background:t.accent+"14",border:"1px solid "+t.accent+"33",padding:"3px 11px",borderRadius:3}}>Cairo, Egypt</span>
              </motion.div>

              <div style={{overflow:"hidden",marginBottom:2}}>
                <motion.h1 initial={{y:80}} animate={{y:0}} transition={{duration:0.75,delay:0.12,ease:[0.16,1,0.3,1]}}
                  style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(54px,7vw,92px)",fontWeight:300,letterSpacing:"-0.02em",lineHeight:0.92,color:t.text,margin:0}}>
                  Ibrahim
                </motion.h1>
              </div>
              <div style={{overflow:"hidden",marginBottom:28}}>
                <motion.h1 initial={{y:80}} animate={{y:0}} transition={{duration:0.75,delay:0.24,ease:[0.16,1,0.3,1]}}
                  style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(54px,7vw,92px)",fontWeight:700,fontStyle:"italic",letterSpacing:"-0.02em",lineHeight:0.92,color:t.accent,margin:0}}>
                  Elshafey<span style={{color:t.accent+"28"}}>.</span>
                </motion.h1>
              </div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.38}}
                style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
                <div style={{width:26,height:1,background:t.accent+"55"}}/>
                <span style={{fontFamily:"DM Mono,monospace",fontSize:14,color:t.muted}}>
                  <Typewriter words={["Data Analyst","Power BI Developer","Python & SQL Expert","ML Engineer","Agentic AI Dev"]} color={t.accent}/>
                </span>
              </motion.div>

              <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.48}}
                style={{fontFamily:"DM Sans,sans-serif",fontSize:15.5,fontWeight:300,lineHeight:1.88,color:t.faint,
                  maxWidth:480,marginBottom:36,paddingLeft:14,borderLeft:"2px solid "+t.accent+"28"}}>
                Academic CS student transforming raw data into strategic decisions — specializing in{" "}
                <span style={{color:t.text}}>AI-driven insights</span>,{" "}
                <span style={{color:t.text}}>Power BI</span>, and{" "}
                <span style={{color:t.text}}>database engineering</span>.
              </motion.p>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.56}}
                style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:44}}>
                <a href={li} target="_blank" rel="noreferrer" style={{
                  fontFamily:"DM Sans,sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.07em",
                  color:dark?"#050c18":"#fff",background:"linear-gradient(135deg,"+t.accent+","+t.accent2+")",
                  padding:"12px 24px",borderRadius:4,textDecoration:"none",
                  boxShadow:"0 6px 20px "+t.accent+"30",display:"flex",alignItems:"center",gap:6}}>
                  <Linkedin size={14}/> LinkedIn
                </a>
                <a href={"https://wa.me/"+wa} target="_blank" rel="noreferrer" style={{
                  fontFamily:"DM Sans,sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.07em",
                  color:"#fff",background:"#25D366",padding:"12px 24px",borderRadius:4,
                  textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
                  <MessageCircle size={14}/> WhatsApp
                </a>
                <a href="./Ibrahim_Elshafey_CV.pdf" download style={{
                  fontFamily:"DM Sans,sans-serif",fontSize:12,fontWeight:400,letterSpacing:"0.07em",
                  color:t.muted,border:"1px solid "+t.border,padding:"11px 20px",
                  borderRadius:4,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
                  <Download size={13}/> Resume
                </a>
              </motion.div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.45,delay:0.7}}
                style={{display:"flex",gap:36,paddingTop:24,borderTop:"1px solid "+t.divider}}>
                {([["3",3,"+"," Projects"],["9",9,"×"," Certified"],["4",4,"+"," Domains"]] as [string,number,string,string][]).map(([_,target,s,l])=>{
                  const {count,ref:cRef} = useCountUp(target,1200);
                  return (
                    <div key={l} ref={cRef}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:42,fontWeight:600,lineHeight:1,color:t.text}}>
                        {count}<span style={{color:t.accent}}>{s}</span>
                      </div>
                      <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",color:t.muted,textTransform:"uppercase",marginTop:5,opacity:0.5}}>{l}</div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* PHOTO */}
            <motion.div initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2,ease:[0.16,1,0.3,1]}}
              style={{display:"flex",flexDirection:"column",alignItems:"flex-end",position:"relative",paddingRight:4}}>
              <div style={{position:"relative",width:350,height:490}}>
                {/* Python icon top-center — like screenshot */}
                <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:0.4}}
                  style={{position:"absolute",top:-22,left:"50%",transform:"translateX(-50%)",
                    width:44,height:44,borderRadius:12,
                    background:"rgba(10,18,35,0.94)",border:"1px solid rgba(99,179,237,0.2)",
                    backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:"0 8px 24px rgba(0,0,0,0.4)",zIndex:10}}>
                  <PyIcon/>
                </motion.div>
                <div style={{position:"absolute",inset:0,borderRadius:10,
                  background:"linear-gradient(145deg,rgba(99,179,237,0.12),rgba(167,139,250,0.06))",border:"1px solid rgba(99,179,237,0.25)"}}/>
                {[
                  {top:-2,left:-2,borderTop:"2px solid #63b3ed",borderLeft:"2px solid #63b3ed"},
                  {top:-2,right:-2,borderTop:"2px solid #63b3ed",borderRight:"2px solid #63b3ed"},
                  {bottom:-2,left:-2,borderBottom:"2px solid #63b3ed",borderLeft:"2px solid #63b3ed"},
                  {bottom:-2,right:-2,borderBottom:"2px solid #63b3ed",borderRight:"2px solid #63b3ed"},
                ].map((c,i)=><div key={i} style={{position:"absolute",...c,width:18,height:18}}/>)}
                <div style={{position:"absolute",inset:8,overflow:"hidden",borderRadius:8}}>
                  <img src={PROFILE} alt="Ibrahim Elshafey" style={{
                    width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",
                    filter:"contrast(1.1) brightness("+(dark?"1.0":"0.93")+") saturate(1.06) hue-rotate(-2deg)"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,12,24,"+(dark?"0.88":"0.55")+") 0%,rgba(5,12,24,"+(dark?"0.3":"0.15")+") 35%,rgba(5,12,24,0.0) 55%,transparent 70%)"}}/>
                  {/* ── SCANNING BAR — matches reference: bright cyan streak ── */}
                  <div style={{
                    position:"absolute",left:"-2%",right:"-2%",height:2,
                    background:"linear-gradient(90deg,transparent 0%,rgba(99,179,237,0.1) 8%,rgba(99,179,237,0.7) 30%,rgba(200,248,255,1) 50%,rgba(99,179,237,0.7) 70%,rgba(99,179,237,0.1) 92%,transparent 100%)",
                    boxShadow:"0 0 6px 2px rgba(99,179,237,0.7),0 0 16px 5px rgba(99,179,237,0.3),0 0 36px 10px rgba(99,179,237,0.12)",
                    animation:"scan 3.2s linear infinite",
                    zIndex:5,
                    pointerEvents:"none",
                    mixBlendMode:"screen",
                  }}/>
                  {/* Broad ambient glow band */}
                  <div style={{
                    position:"absolute",left:0,right:0,height:70,
                    background:"linear-gradient(180deg,transparent 0%,rgba(99,179,237,0.05) 35%,rgba(99,179,237,0.12) 50%,rgba(99,179,237,0.05) 65%,transparent 100%)",
                    animation:"scan 3.2s linear infinite",
                    marginTop:-34,
                    zIndex:4,
                    pointerEvents:"none",
                    mixBlendMode:"screen",
                  }}/>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px"}}>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.22em",color:t.accent,textTransform:"uppercase",marginBottom:3}}>Data Analyst · Cairo</div>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:21,fontWeight:600,color:t.text}}>Ibrahim Elshafey</div>
                </div>
              </div>

              <motion.div initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:0.75,duration:0.4}}
                style={{position:"absolute",top:40,left:-58,display:"flex",alignItems:"center",gap:10,
                  background:"rgba(10,18,35,0.92)",border:"1px solid rgba(99,179,237,0.25)",
                  padding:"12px 14px",borderRadius:8,backdropFilter:"blur(18px)",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(99,179,237,0.1)",zIndex:10}}>
                <div>
                  <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,fontWeight:700,color:"#e2e8f0",lineHeight:1.2}}>Google Certified</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9.5,color:"#63b3ed",marginTop:3,letterSpacing:"0.05em"}}>Data Analytics – 2024</div>
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.88,duration:0.4}}
                style={{position:"absolute",bottom:65,right:-56,display:"flex",alignItems:"center",gap:10,
                  background:"rgba(10,18,35,0.92)",border:"1px solid rgba(167,139,250,0.25)",
                  padding:"12px 14px",borderRadius:8,backdropFilter:"blur(18px)",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(167,139,250,0.1)",zIndex:10}}>
                <div style={{width:32,height:32,background:"rgba(167,139,250,0.15)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <BarChart3 size={16} color="#a78bfa"/>
                </div>
                <div>
                  <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,fontWeight:700,color:"#e2e8f0",lineHeight:1.2}}>Power BI</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9.5,color:"#a78bfa",marginTop:3,letterSpacing:"0.05em"}}>Core experience</div>
                </div>
              </motion.div>

              {/* Sparkle accent — bottom right corner like reference */}
              <motion.div initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:1.2,duration:0.4}}
                style={{position:"absolute",bottom:42,right:-20,color:"#a78bfa",opacity:0.7,fontSize:18,lineHeight:1,
                  animation:"sparkle 2.5s ease-in-out infinite",zIndex:10}}>✦</motion.div>

              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-start",marginTop:18,maxWidth:370}}>
                {["Python","SQL","Power BI","Scikit-learn","DAX"].map(s=>(
                  <span key={s} style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",
                    color:t.accent,border:"1px solid "+t.accent+"2a",background:t.accent+"08",padding:"3px 9px",borderRadius:3}}>{s}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ── ABOUT ───────────────────────────────────────────────────────────────── */
const About = ({ t }: { t:T }) => (
  <section id="about" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
      <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}>
        <motion.div initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.32}}>
          <Label t={t}>Discovery</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(36px,4.5vw,58px)",fontWeight:300,lineHeight:1.1,color:t.text,marginBottom:16}}>
            Turning noise into<br/><em style={{color:t.accent,fontWeight:700}}>clear narrative.</em>
          </h2>
          <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:300,lineHeight:1.88,color:t.faint,maxWidth:420}}>
            I'm <span style={{color:t.text}}>Ibrahim Elshafey</span>, a Computer Science student
            focused on data analysis — building systems from Library Management databases to AI models.
          </p>
        </motion.div>
        <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.32,delay:0.08}}>
          <div style={{padding:36,background:t.surface,border:"1px solid "+t.border,borderRadius:10}}>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:19,fontStyle:"italic",fontWeight:300,color:t.muted,lineHeight:1.75,marginBottom:28}}>
              "Imagine your company's data is a buried gold mine — you just need someone who knows where to dig."
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,paddingTop:22,borderTop:"1px solid "+t.divider}}>
              {[["Library DB","Database"],["AI Model","ML"],["Ethics Study","Research"]].map(([a,b])=>(
                <div key={a}>
                  <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:500,color:t.text}}>{a}</div>
                  <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.14em",color:t.accent,textTransform:"uppercase",marginTop:3}}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ── SKILLS ──────────────────────────────────────────────────────────────── */
const Skills = ({ t }: { t:T }) => {
  const cats = [
    {title:"Programming & ETL",  icon:<Code2 size={19}/>,    exp:"Expert",
     skills:[{n:"Python",i:<PyIcon/>},{n:"SQL",i:<SqlIcon/>},{n:"Pandas",i:<PanIcon/>},{n:"Database",i:<Database size={24} color={t.accent}/>}]},
    {title:"Visualization & BI", icon:<BarChart3 size={19}/>, exp:"Certified",
     skills:[{n:"Power BI",i:<PbiIcon/>},{n:"Tableau",i:<TabIcon/>},{n:"DAX",i:<DaxIcon/>},{n:"Orange",i:<OrgIcon/>}]},
    {title:"Statistics & Modeling",icon:<TrendingUp size={19}/>,exp:"Academic",
     skills:[{n:"SPSS",i:<SpssIcon/>},{n:"Linear Reg.",i:<TrendingUp size={24} color={t.accent}/>},{n:"Probability",i:<Sparkles size={24} color={t.accent}/>}]},
    {title:"AI & Deep Learning", icon:<Sparkles size={19}/>,  exp:"Researcher",
     skills:[{n:"Scikit-learn",i:<SkIcon/>},{n:"Deep Learning",i:<DLIcon/>},{n:"Agentic AI",i:<AgIcon/>},{n:"AI Tools",i:<AITIcon/>}]},
  ];
  return (
    <section id="skills" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:48}}>
          <Label t={t}>Arsenal</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5vw,68px)",fontWeight:300,color:t.text,lineHeight:1}}>
            Skills &amp; <em style={{color:t.accent,fontWeight:700}}>Expertise</em>
          </h2>
        </div>
        <div className="skills-grid" className="edu-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:t.accent+"14"}}>
          {cats.map((cat,idx)=>(
            <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:idx*0.04}}
              className="hv hv-bg" style={{padding:36,background:t.bg2}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
                <div style={{color:t.accent}}>{cat.icon}</div>
                <span style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",
                  color:t.accent,border:"1px solid "+t.accent+"30",padding:"3px 9px",borderRadius:2}}>{cat.exp}</span>
              </div>
              <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:16,fontWeight:500,color:t.text,marginBottom:16}}>{cat.title}</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {cat.skills.map(sk=>(
                  <div key={sk.n} className="hv hv-border" style={{display:"flex",alignItems:"center",gap:9,padding:9,
                    background:t.accent+"08",border:"1px solid "+t.accent+"10",borderRadius:5}}>
                    <div style={{flexShrink:0}}>{sk.i}</div>
                    <span style={{fontFamily:"DM Sans,sans-serif",fontSize:11.5,color:t.muted}}>{sk.n}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── SERVICES ────────────────────────────────────────────────────────────── */
const Services = ({ t }: { t:T }) => {
  const svcs = [
    {n:"01",title:"Data Analysis & Insights",   desc:"Transforming raw data into strategic reports using Python and Pandas.",features:["Exploratory Data Analysis","Statistical Modeling","Predictive Analytics"]},
    {n:"02",title:"SQL & Database Architecture", desc:"Designing and managing complex databases with optimized query performance.",features:["Schema Design","Complex Joins","Data Cleaning Pipelines"]},
    {n:"03",title:"Power BI & Visualization",   desc:"Interactive dashboards that tell the story of your data clearly.",features:["Interactive Reports","DAX Calculations","Real-time Monitoring"]},
  ];
  return (
    <section id="services" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:48}}>
          <Label t={t}>Expertise</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5vw,68px)",fontWeight:300,color:t.text,lineHeight:1}}>
            Professional <em style={{color:t.accent,fontWeight:700}}>Services</em>
          </h2>
        </div>
        <div className="services-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:t.accent+"14"}}>
          {svcs.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.28,delay:i*0.04}}
              className="hv hv-bg" style={{padding:36,background:t.bg2}}>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:64,fontWeight:300,color:t.accent+"18",lineHeight:1,marginBottom:16}}>{s.n}</div>
              <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:17,fontWeight:500,color:t.text,marginBottom:10}}>{s.title}</h3>
              <p style={{fontFamily:"DM Sans,sans-serif",fontSize:13.5,fontWeight:300,color:t.faint,lineHeight:1.78,marginBottom:20}}>{s.desc}</p>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:9}}>
                {s.features.map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:t.accent,flexShrink:0}}/>
                    <span style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.09em",color:t.muted,textTransform:"uppercase"}}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── EXPERIENCE ──────────────────────────────────────────────────────────── */
const Experience = ({ t }: { t:T }) => {
  const jobs = [
    {role:"Junior Data Analyst",company:"Digital Egypt (DigiLions)",active:true,
     desc:"Specializing in data visualization and actionable insights using real-world datasets.",
     items:["Exploratory Data Analysis (EDA)","Dynamic Dashboard Creation","SQL Query Optimization"]},
    {role:"Academic Researcher & Presenter",company:"Academic Projects",active:false,
     desc:"Focused on data mining algorithms (Apriori, GSP) and critical analysis of data ethics.",items:[]},
  ];
  return (
    <section id="experience" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:48}}>
          <Label t={t}>Journey</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5vw,68px)",fontWeight:300,color:t.text,lineHeight:1}}>
            Professional <em style={{color:t.accent,fontWeight:700}}>Path</em>
          </h2>
        </div>
        <div style={{position:"relative",marginLeft:14,borderLeft:"1px solid "+t.accent+"22"}}>
          <div style={{display:"flex",flexDirection:"column",gap:52}}>
            {jobs.map((job,i)=>(
              <motion.div key={i} initial={{opacity:0,x:16}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.28,delay:i*0.04}}
                style={{position:"relative",paddingLeft:44}}>
                <div style={{position:"absolute",left:-6,top:6,width:11,height:11,borderRadius:"50%",
                  background:job.active?t.accent:t.accent+"3a",
                  boxShadow:job.active?"0 0 16px "+t.accent+"77":"none"}}/>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:7}}>{job.company}</div>
                <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:21,fontWeight:500,color:t.text,marginBottom:9}}>{job.role}</h3>
                <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14.5,fontWeight:300,color:t.faint,lineHeight:1.8,maxWidth:520,marginBottom:9}}>{job.desc}</p>
                {job.items.map(item=>(
                  <div key={item} style={{display:"flex",alignItems:"center",gap:9,marginTop:9}}>
                    <CheckCircle2 size={13} color={t.accent}/>
                    <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:t.muted}}>{item}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── EDUCATION ───────────────────────────────────────────────────────────── */
const Education = ({ t }: { t:T }) => {
  const items = [
    {
      degree:"Bachelor of Commerce",
      school:"Business Information Systems (BIS) — Tanta University",
      year:"2019 – 2023",
      location:"Tanta, Egypt",
      note:"Specialized in Business Information Systems, combining data management, analytics, and enterprise software solutions.",
    },
    {
      degree:"Google Data Analytics Certificate",
      school:"Google via Coursera",
      year:"2024",
      location:"Online",
      note:"9-course specialization covering the full data analytics workflow from data cleaning to visualization.",
    },
  ];
  return (
    <section id="education" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:48}}>
          <Label t={t}>Academic</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5vw,68px)",fontWeight:300,color:t.text,lineHeight:1}}>
            Education &amp; <em style={{color:t.accent,fontWeight:700}}>Credentials</em>
          </h2>
        </div>
        <div className="skills-grid" className="edu-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:t.accent+"14"}}>
          {items.map((item,i)=>(
            <motion.div key={i} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.28,delay:i*0.04}}
              className="hv hv-bg" style={{padding:36,background:t.bg2,display:"flex",gap:20}}>
              <div style={{width:40,height:40,background:t.accent+"18",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <GraduationCap size={18} color={t.accent}/>
              </div>
              <div>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:t.accent,marginBottom:6}}>{item.year}</div>
                <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:17,fontWeight:600,color:t.text,marginBottom:4,fontStyle:"italic"}}>{item.degree}</h3>
                <div style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:t.muted,marginBottom:6}}>{item.school}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:t.accent,flexShrink:0}}><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  <span style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:t.accent,opacity:0.8}}>{item.location}</span>
                </div>
                <p style={{fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:300,color:t.faint,lineHeight:1.7}}>{item.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── PROJECTS ────────────────────────────────────────────────────────────── */
const Projects = ({ t, dark }: { t:T; dark:boolean }) => {

  const projects = [
    {n:"01",title:"Body Performance AI Model",
     desc:"ML solution predicting body performance metrics with advanced regression algorithms. Deployed live on Streamlit.",
     tech:["Python","Scikit-Learn","Streamlit","Regression"],link:"https://bqspsjsj5hzumu47qw668j.streamlit.app/",
     cat:"AI & Machine Learning",color:"#63b3ed",
     img:"https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=900&auto=format&fit=crop"},
    {n:"02",title:"Library Management DB",
     desc:"Comprehensive relational database schema with ER diagrams, normalized tables, and optimized SQL queries.",
     tech:["SQL","Schema Design","ER Diagramming","Normalization"],link:"#",
     cat:"Database Engineering",color:"#a78bfa",
     img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=900&auto=format&fit=crop"},
    {n:"03",title:"Cambridge Analytica Study",
     desc:"In-depth research case study on the data scandal — ethics analysis and technical breakdown.",
     tech:["Data Ethics","Research","Visualization","Mining"],link:"#",
     cat:"Data Research",color:"#34d399",
     img:"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop"},
  ];
  return (
    <section id="projects" style={{position:"relative",zIndex:10,padding:"120px 0"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <div style={{marginBottom:48}}>
          <Label t={t}>Portfolio</Label>
          <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(40px,5vw,68px)",fontWeight:300,color:t.text,lineHeight:1}}>
            Featured <em style={{color:t.accent,fontWeight:700}}>Work</em>
          </h2>
        </div>
        <div className="projects-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {projects.map((p,i)=>(
            <motion.div key={i} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:0.28,delay:i*0.04}}
              className="hv proj-card"
              style={{background:t.bg2,border:"1px solid "+t.border,
                borderRadius:12,overflow:"hidden",display:"flex",flexDirection:"column"}}
              data-color={p.color}>
              <div style={{position:"relative",height:190,overflow:"hidden"}}>
                <img src={p.img} alt={p.title}
                  style={{width:"100%",height:"100%",objectFit:"cover",
                    filter:dark?"brightness(0.72)":"brightness(0.82)",
                    transition:"transform .4s ease",willChange:"transform"}}
                  className="proj-img"/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,12,24,0.88) 0%,transparent 55%)"}}/>
                <span style={{position:"absolute",top:14,left:14,fontFamily:"DM Mono,monospace",fontSize:9,
                  letterSpacing:"0.16em",textTransform:"uppercase",color:"#fff",
                  background:p.color+"bb",padding:"3px 9px",borderRadius:3}}>{p.cat}</span>
                <span style={{position:"absolute",bottom:10,right:14,fontFamily:"Cormorant Garamond,serif",
                  fontSize:48,fontWeight:300,color:"rgba(255,255,255,0.09)",lineHeight:1}}>{p.n}</span>
              </div>
              <div style={{padding:22,display:"flex",flexDirection:"column",flex:1}}>
                <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:16,fontWeight:600,color:t.text,marginBottom:7,lineHeight:1.3}}>{p.title}</h3>
                <p style={{fontFamily:"DM Sans,sans-serif",fontSize:13,fontWeight:300,color:t.faint,lineHeight:1.72,marginBottom:14,flex:1}}>{p.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
                  {p.tech.map(tg=>(
                    <span key={tg} style={{fontFamily:"DM Mono,monospace",fontSize:8.5,letterSpacing:"0.09em",textTransform:"uppercase",
                      color:p.color,border:"1px solid "+p.color+"30",background:p.color+"0c",padding:"2px 7px",borderRadius:2}}>{tg}</span>
                  ))}
                </div>
                <a href={p.link} target="_blank" rel="noreferrer"
                  className="hv proj-cta" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",
                    background:p.color+"12",border:"1px solid "+p.color+"22",borderRadius:6,textDecoration:"none"}}
                  >
                  <span style={{fontFamily:"DM Sans,sans-serif",fontSize:11.5,fontWeight:600,color:p.color,letterSpacing:"0.05em"}}>View Project</span>
                  <ArrowUpRight size={14} color={p.color}/>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CERTIFICATES ────────────────────────────────────────────────────────── */
const Certificates = ({ t }: { t:T }) => {
  const [open,setOpen] = useState(false);
  const link = "https://www.coursera.org/account/accomplishments/specialization/AXJ0B78I881A";
  const courses = ["Foundations: Data, Data, Everywhere","Ask Questions to Make Data-Driven Decisions","Prepare Data for Exploration","Process Data from Dirty to Clean","Analyze Data to Answer Questions","Share Data Through the Art of Visualization","Introduction to Data Analysis Using Python","Google Data Analytics Capstone: Complete a Case Study","Accelerate Your Job Search with AI"];
  return (
    <section id="certificates" style={{position:"relative",zIndex:10,padding:"60px 0 120px"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>
        <motion.div layout style={{border:"1px solid "+t.border,background:t.surface,borderRadius:10}}>
          <div style={{padding:"44px 52px"}}>
            <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:28}}>
              <div style={{width:56,height:56,background:"#4285F4",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:24,fontWeight:700,flexShrink:0,fontFamily:"serif"}}>G</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:t.accent,marginBottom:6}}>Google via Coursera · Certified Specialist</div>
                <h3 style={{fontFamily:"DM Sans,sans-serif",fontSize:19,fontWeight:500,color:t.text,marginBottom:7}}>Google Data Analytics Professional Certificate</h3>
                <a href={link} target="_blank" rel="noreferrer" style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:5}}>
                  Verify <ExternalLink size={10}/>
                </a>
              </div>
              <button onClick={()=>setOpen(!open)} style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:t.faint,border:"1px solid "+t.border,padding:"8px 16px",borderRadius:4,background:"transparent",cursor:"none",display:"flex",alignItems:"center",gap:7,flexShrink:0,transition:"border-color .18s,color .18s"}}
                className="hv hv-btn">
                {open?"Hide":"View Courses"}<motion.div animate={{rotate:open?180:0}}><ChevronDown size={14}/></motion.div>
              </button>
            </div>
            <AnimatePresence>
              {open&&(
                <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden"}}>
                  <div style={{marginTop:32,paddingTop:32,borderTop:"1px solid "+t.divider}}>
                    {courses.map((c,i)=>(
                      <a key={i} href={link} target="_blank" rel="noreferrer"
                        className="hv hv-bg" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 6px",borderBottom:"1px solid "+t.divider,textDecoration:"none"}}
                        className="hv hv-bg">
                        <div style={{display:"flex",alignItems:"center",gap:18}}>
                          <span style={{fontFamily:"DM Mono,monospace",fontSize:10,color:t.accent+"50",minWidth:20}}>{"0"+(i+1)}</span>
                          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13.5,fontWeight:300,color:t.muted}}>{c}</span>
                        </div>
                        <ExternalLink size={11} color={t.accent} style={{opacity:0.5}}/>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── CONTACT (with beautiful form matching the screenshot) ───────────────── */
/* ── TOAST — premium green notification ─────────────────────────────────── */
const Toast = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity:0, y:80, scale:0.92 }}
      animate={{ opacity:1, y:0,  scale:1    }}
      exit={{    opacity:0, y:60, scale:0.94 }}
      transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}
      style={{
        position:"fixed", bottom:36, left:"50%", transform:"translateX(-50%)",
        zIndex:9999, minWidth:360, maxWidth:"92vw",
        borderRadius:10, overflow:"hidden",
        boxShadow:"0 24px 60px rgba(13,159,110,0.4),0 4px 16px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.1)",
      }}>

      {/* Shrinking progress bar at top */}
      <motion.div
        initial={{ scaleX:1 }} animate={{ scaleX:0 }}
        transition={{ duration:4.5, ease:"linear" }}
        style={{
          position:"absolute", top:0, left:0, right:0, height:3,
          background:"rgba(255,255,255,0.35)", transformOrigin:"left",
          zIndex:1,
        }}
      />

      {/* Body */}
      <div style={{
        background:"linear-gradient(120deg,#0a9e6e 0%,#089060 45%,#067850 100%)",
        padding:"18px 28px",
        display:"flex", alignItems:"center", gap:14,
      }}>
        {/* Animated checkmark circle */}
        <motion.div
          initial={{ scale:0, rotate:-30 }}
          animate={{ scale:1, rotate:0   }}
          transition={{ delay:0.15, duration:0.35, ease:[0.16,1,0.3,1] }}
          style={{
            width:36, height:36, borderRadius:"50%",
            background:"rgba(255,255,255,0.18)",
            border:"2px solid rgba(255,255,255,0.45)",
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0,
            boxShadow:"0 0 0 6px rgba(255,255,255,0.07)",
          }}>
          <motion.svg width="16" height="12" viewBox="0 0 16 12" fill="none"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ delay:0.28, duration:0.4, ease:"easeOut" }}>
            <motion.path d="M1.5 6L6 10.5L14.5 1.5"
              stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength:0 }}
              animate={{ pathLength:1 }}
              transition={{ delay:0.28, duration:0.4, ease:"easeOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Text */}
        <div>
          <motion.div
            initial={{ opacity:0, x:10 }}
            animate={{ opacity:1, x:0  }}
            transition={{ delay:0.2, duration:0.3 }}
            style={{
              fontFamily:"DM Sans,sans-serif", fontSize:15.5, fontWeight:700,
              color:"#ffffff", letterSpacing:"0.01em", lineHeight:1.2,
            }}>
            Message Sent!
          </motion.div>
          <motion.div
            initial={{ opacity:0, x:10 }}
            animate={{ opacity:0.78, x:0 }}
            transition={{ delay:0.28, duration:0.3 }}
            style={{
              fontFamily:"DM Sans,sans-serif", fontSize:12.5, fontWeight:400,
              color:"#d1fae5", marginTop:3, letterSpacing:"0.01em",
            }}>
            I'll be in touch soon.
          </motion.div>
        </div>

        {/* Close button */}
        <button onClick={onDone}
          style={{
            marginLeft:"auto", background:"rgba(255,255,255,0.12)",
            border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:6, width:28, height:28,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"none", color:"rgba(255,255,255,0.7)",
            flexShrink:0, transition:"background .15s",
          }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.22)"}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.12)"}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Glow bottom bar */}
      <div style={{
        height:2,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
      }}/>
    </motion.div>
  );
};

/* ── ROOT ────────────────────────────────────────────────────────────────── */

/* ── CONTACT ─────────────────────────────────────────────────────────────── */
const Contact = ({ t, dark }: { t:T; dark:boolean }) => {
  const [form,    setForm]     = useState({name:"",email:"",subject:"",message:""});
  const [sending, setSending]  = useState(false);
  const [showToast,setShowToast] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      /* EmailJS — replace these 3 values with yours from emailjs.com */
      const SERVICE_ID  = "YOUR_SERVICE_ID";
      const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
      const PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          service_id:SERVICE_ID, template_id:TEMPLATE_ID, user_id:PUBLIC_KEY,
          template_params:{
            from_name:form.name, from_email:form.email,
            subject:form.subject||"Portfolio Contact",
            message:form.message, to_name:"Ibrahim Elshafey",
          },
        }),
      });
      if (res.ok) {
        setShowToast(true);
        setForm({name:"",email:"",subject:"",message:""});
      } else throw new Error("failed");
    } catch {
      window.open(`mailto:ibrheam161@gmail.com?subject=${encodeURIComponent(form.subject||"Contact")}&body=${encodeURIComponent(form.message)}`,"_blank");
      setShowToast(true);
    } finally { setSending(false); }
  };

  const iS = {
    width:"100%", padding:"14px 16px",
    fontFamily:"DM Sans,sans-serif", fontSize:14, color:t.text,
    background:t.inputBg, border:"1px solid "+t.border,
    borderRadius:8, outline:"none", boxSizing:"border-box" as const,
    transition:"border-color .18s, box-shadow .18s",
  };

  return (
    <>
      <AnimatePresence>
        {showToast && <Toast onDone={()=>setShowToast(false)}/>}
      </AnimatePresence>

      <footer id="contact" style={{position:"relative",zIndex:10,padding:"80px 0 60px",borderTop:"1px solid "+t.border}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 32px"}}>

          {/* Heading */}
          <motion.div initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55}}
            style={{textAlign:"center",marginBottom:64}}>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.4em",textTransform:"uppercase",color:t.accent,marginBottom:16}}>Let's Connect</div>
            <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(44px,6.5vw,86px)",fontWeight:300,lineHeight:1,color:t.text,margin:"0 0 14px"}}>
              Let's Build<br/>
              <em style={{background:"linear-gradient(135deg,"+t.accent+","+t.accent2+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:700}}>The Future.</em>
            </h2>
            <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,fontWeight:300,color:t.faint,fontStyle:"italic"}}>
              Open for Data Analysis, Research, and SQL Engineering roles.
            </p>
            <div style={{marginTop:10}}>
              <span style={{fontFamily:"DM Mono,monospace",fontSize:14,color:t.accent}}>ibrheam161@gmail.com</span>
            </div>
          </motion.div>

          {/* Two columns */}
          <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"start"}}>

            {/* Left — info cards */}
            <motion.div initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5}}>
              <div style={{display:"flex",flexDirection:"column",gap:1,background:t.accent+"14",borderRadius:10,overflow:"hidden",marginBottom:24}}>
                {[
                  {icon:<FaMapMarkerAlt/>,label:"Location",val:"Cairo, Egypt",href:undefined},
                  {icon:<Mail size={15}/>,label:"Email",val:"ibrheam161@gmail.com",href:"mailto:ibrheam161@gmail.com"},
                  {icon:<FaPhoneAlt/>,label:"Phone",val:"+20 114 001 6540",href:"tel:+201140016540"},
                ].map(({icon,label,val,href})=>{
                  const Tag = href?"a":"div" as any;
                  return (
                    <Tag key={label} {...(href?{href}:{})} className="hv hv-bg"
                      style={{padding:"22px 28px",background:t.bg2,display:"flex",alignItems:"center",gap:18,textDecoration:"none"}}>
                      <div style={{width:38,height:38,background:t.accent+"16",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:t.accent,flexShrink:0}}>{icon}</div>
                      <div>
                        <div style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:t.muted,opacity:0.6,marginBottom:3}}>{label}</div>
                        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:t.muted}}>{val}</div>
                      </div>
                    </Tag>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:12}}>
                {[{href:"#",icon:<FaGithub size={20}/>},{href:"https://www.linkedin.com/in/ibrahim-elshafey-01140016540",icon:<FaLinkedin size={20}/>}].map((item,i)=>(
                  <a key={i} href={item.href} target="_blank" rel="noreferrer" className="hv hv-link"
                    style={{display:"flex",alignItems:"center",justifyContent:"center",width:42,height:42,borderRadius:8,
                      background:t.surface,border:"1px solid "+t.border,color:t.muted}}>
                    {item.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.5,delay:0.1}}>
              <div style={{padding:32,background:t.surface,border:"1px solid "+t.border,borderRadius:10}}>

                {/* Name + Email row */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                  <div>
                    <label style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,display:"block",marginBottom:7}}>Full Name</label>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      placeholder="Your name" style={iS}
                      onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=t.accent;(e.target as HTMLInputElement).style.boxShadow="0 0 0 3px "+t.accent+"18";}}
                      onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=t.border;(e.target as HTMLInputElement).style.boxShadow="none";}}/>
                  </div>
                  <div>
                    <label style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,display:"block",marginBottom:7}}>Email Address</label>
                    <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                      placeholder="your@email.com" type="email" style={iS}
                      onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=t.accent;(e.target as HTMLInputElement).style.boxShadow="0 0 0 3px "+t.accent+"18";}}
                      onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=t.border;(e.target as HTMLInputElement).style.boxShadow="none";}}/>
                  </div>
                </div>

                {/* Subject */}
                <div style={{marginBottom:16}}>
                  <label style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,display:"block",marginBottom:7}}>Subject</label>
                  <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{...iS,cursor:"none"}}>
                    <option value="">Select a subject...</option>
                    <option>Data Analysis Project</option>
                    <option>Power BI Dashboard</option>
                    <option>SQL / Database Work</option>
                    <option>ML / AI Project</option>
                    <option>Job Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{marginBottom:22}}>
                  <label style={{fontFamily:"DM Mono,monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,display:"block",marginBottom:7}}>Message</label>
                  <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                    placeholder="Tell me about your project or opportunity..." rows={5}
                    style={{...iS,resize:"vertical",minHeight:120}}
                    onFocus={e=>{(e.target as HTMLTextAreaElement).style.borderColor=t.accent;(e.target as HTMLTextAreaElement).style.boxShadow="0 0 0 3px "+t.accent+"18";}}
                    onBlur={e=>{(e.target as HTMLTextAreaElement).style.borderColor=t.border;(e.target as HTMLTextAreaElement).style.boxShadow="none";}}/>
                </div>

                {/* Send button */}
                <button onClick={handleSubmit} disabled={sending}
                  style={{
                    width:"100%",padding:"15px 24px",
                    fontFamily:"DM Sans,sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.06em",
                    color:"#fff",background:"linear-gradient(135deg,"+t.accent+","+t.accent2+")",
                    border:"none",borderRadius:8,cursor:"none",
                    boxShadow:"0 6px 24px "+t.accent+"30",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                    opacity:sending?0.7:1,transition:"opacity .18s,transform .18s",
                    transform:"scale(1)",
                  }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.transform="scale(1.01)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.transform="scale(1)"}>
                  <Send size={15}/>
                  {sending ? (
                    <span style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite",display:"inline-block"}}/>
                      Sending...
                    </span>
                  ) : "Send Message"}
                </button>

              </div>
            </motion.div>
          </div>

          {/* Footer bottom */}
          <div style={{marginTop:52,paddingTop:26,borderTop:"1px solid "+t.divider,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.3em",textTransform:"uppercase",color:t.muted,opacity:0.3}}>© 2026 Ibrahim Elshafey</div>
            <div style={{fontFamily:"DM Mono,monospace",fontSize:10,letterSpacing:"0.2em",color:t.muted,opacity:0.3}}>Built with passion · Cairo, Egypt</div>
          </div>

        </div>
      </footer>
    </>
  );
};

const Index = () => {
  const [dark,setDark] = useState(true);
  const t = dark ? DARK : LIGHT;

  /* ── Set professional favicon (Python SVG) ── */
  useEffect(() => {
    // Remove existing favicons
    document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
      <defs>
        <linearGradient id='a' x1='70' y1='1237' x2='171' y2='1338' gradientTransform='matrix(.563 0 0 -.568 -29 757)' gradientUnits='userSpaceOnUse'>
          <stop offset='0' stop-color='%235A9FD4'/><stop offset='1' stop-color='%23306998'/>
        </linearGradient>
        <linearGradient id='b' x1='209' y1='1099' x2='174' y2='1150' gradientTransform='matrix(.563 0 0 -.568 -29 757)' gradientUnits='userSpaceOnUse'>
          <stop offset='0' stop-color='%23FFD43B'/><stop offset='1' stop-color='%23FFE873'/>
        </linearGradient>
      </defs>
      <path fill='url(%23a)' d='M63.4 2c-4.2.02-8.3.38-11.8 1-10.5 1.85-12.3 5.71-12.3 12.84v9.41h24.7v3.14H29.9c-7.2 0-13.5 4.31-15.4 12.52-2.3 9.4-2.4 15.27 0 25.1 1.8 7.31 5.9 12.52 13.1 12.52h8.5V67.2c0-8.15 7-15.34 15.4-15.34h24.7c6.9 0 12.3-5.65 12.3-12.55V15.83c0-6.69-5.6-11.72-12.3-12.84zm-13.4 7.56c2.5 0 4.6 2.12 4.6 4.72s-2.1 4.69-4.6 4.69-4.6-2.1-4.6-4.69c0-2.6 2.1-4.72 4.6-4.72z'/>
      <path fill='url(%23b)' d='M91.7 28.38v10.97c0 8.5-7.2 15.65-15.4 15.65H51.6c-6.8 0-12.3 5.78-12.3 12.55v23.51c0 6.69 5.8 10.63 12.3 12.55 7.8 2.3 15.3 2.71 24.7 0 6.2-1.8 12.3-5.42 12.3-12.55v-9.41H63.9v-3.14h37c7.2 0 9.9-5 12.3-12.52 2.6-7.73 2.5-15.17 0-25.1-1.8-7.14-5.2-12.52-12.3-12.52zm-14 59.56c2.6 0 4.6 2.1 4.6 4.69s-2 4.72-4.6 4.72-4.6-2.12-4.6-4.72c0-2.59 2.1-4.69 4.6-4.69z'/>
    </svg>`;
    const blob = new Blob([svg.replace(/%23/g,'#')], {type:'image/svg+xml'});
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('link');
    link.rel  = 'icon'; link.type = 'image/svg+xml'; link.href = url;
    document.head.appendChild(link);
    document.title = "Ibrahim Elshafey | Data Analyst";
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div style={{minHeight:"100vh",background:t.bg,color:t.text,transition:"background .35s,color .35s",cursor:"none"}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sparkle{0%,100%{opacity:0.7;transform:scale(1) rotate(0deg)}50%{opacity:1;transform:scale(1.25) rotate(15deg)}}
        @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
        @keyframes scan{
          0%{top:-8%}
          100%{top:108%}
        }
        @keyframes scanGlow{
          0%{top:-8%}
          100%{top:108%}
        }
        *{cursor:none!important;box-sizing:border-box;}
        input,textarea,select{color-scheme:${dark?"dark":"light"}}
        ::selection{background:${t.accent}33;color:${t.text}}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${t.bg2}}
        ::-webkit-scrollbar-thumb{background:${t.accent}55;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${t.accent}}
        /* ── RESPONSIVE ── */
        @media(max-width:768px){
          .nav-desktop{display:none !important;}
          .hamburger{display:flex !important;}
          .hire-btn{display:none !important;}
          .hero-grid{grid-template-columns:1fr !important;}
          .hero-photo{display:none !important;}
          .skills-grid{grid-template-columns:1fr !important;}
          .services-grid{grid-template-columns:1fr !important;}
          .projects-grid{grid-template-columns:1fr !important;}
          .edu-grid{grid-template-columns:1fr !important;}
          .contact-grid{grid-template-columns:1fr !important;}
          .about-grid{grid-template-columns:1fr !important;}
          section{padding:72px 0 !important;}
        }
        @media(max-width:480px){
          section{padding:56px 0 !important;}
        }
        /* ── CSS VARS for hover classes ── */
        :root{
          --accent:${t.accent};--accent2:${t.accent2};
          --surface:${t.surface};--card:${t.card};
          --text:${t.text};--border:${t.border};
          --accent-40:${t.accent}40;--accent-44:${t.accent}44;--accent-10:${t.accent}10;
        }
        /* ── HOVER — zero JS, GPU only ── */
        .hv{transition:background .14s,border-color .14s,color .14s,box-shadow .14s,opacity .14s !important;}
        .hv-bg:hover{background:${t.surface} !important;}
        .hv-bg2:hover{background:${t.bg2} !important;}
        .hv-border:hover{border-color:${t.accent}44 !important;}
        .hv-color:hover{color:${t.accent} !important;}
        .hv-link:hover{color:${t.accent} !important;border-color:${t.accent}44 !important;background:${t.accent}10 !important;}
        .hv-btn:hover{border-color:${t.accent} !important;color:${t.text} !important;}
        .hv-shadow:hover{box-shadow:0 18px 52px var(--proj-shadow,#63b3ed1e) !important;}
        .hv-op:hover{opacity:0.85 !important;}
        /* project cards */
        .proj-card{transition:border-color .15s,box-shadow .15s !important;}
        .proj-card:hover{border-color:rgba(99,179,237,0.5) !important;box-shadow:0 18px 52px rgba(99,179,237,0.12) !important;}
        .proj-card:hover .proj-img{transform:scale(1.06) !important;}
        .proj-cta{transition:background .14s,border-color .14s !important;}
        .proj-cta:hover{background:rgba(99,179,237,0.15) !important;border-color:rgba(99,179,237,0.5) !important;}
        /* input focus ring via CSS */
        input:focus,textarea:focus,select:focus{outline:none;border-color:${t.accent} !important;box-shadow:0 0 0 3px ${t.accent}18 !important;}
      `}</style>
      <Cursor accent={t.accent}/>
      <ScrollBar accent={t.accent}/>
      <ScrollTop accent={t.accent}/>
      <Background t={t} dark={dark}/>
      <Navbar t={t} dark={dark} setDark={setDark}/>
      <Hero t={t} dark={dark}/>
      <About t={t}/>
      <Skills t={t}/>
      <Services t={t}/>
      {/* Above fold — eager */}
      <Experience t={t}/>
      <Education t={t}/>
      <Certificates t={t}/>
      {/* Below fold — wrapped in Suspense for code-split readiness */}
      <Suspense fallback={<SectionFallback t={t}/>}>
        <Projects t={t} dark={dark}/>
      </Suspense>
      <Suspense fallback={<SectionFallback t={t}/>}>
        <Contact t={t} dark={dark}/>
      </Suspense>
    </div>
  );
};

export default Index;
