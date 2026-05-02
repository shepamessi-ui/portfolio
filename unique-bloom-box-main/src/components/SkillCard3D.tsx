import { useRef, useState, useCallback, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, BarChart3, FlaskConical, Sparkles, type LucideIcon } from "lucide-react";

export type SkillGroup = {
  category: string;
  items: string[];
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  years?: string;
  icon: LucideIcon;
};

export const SKILL_ICONS = { Code2, BarChart3, FlaskConical, Sparkles };

const levelColor: Record<SkillGroup["level"], string> = {
  Beginner: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  Intermediate: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Advanced: "bg-primary/15 text-primary border-primary/40",
};

interface Props {
  group: SkillGroup;
  index: number;
}

const SkillCard3D = memo(({ group, index }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const Icon = group.icon;

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 10; // rotateX
      const ry = (px - 0.5) * 12; // rotateY
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    },
    [reduceMotion]
  );

  const handleLeave = useCallback(() => {
    setHovering(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="[perspective:1200px] group relative"
    >
      {/* Soft gradient glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary) / 0.25), transparent 70%)",
        }}
      />
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleLeave}
        style={{
          transform:
            "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
        className="relative h-full rounded-2xl border border-primary/20 bg-[hsl(220_25%_8%/0.7)] backdrop-blur-md p-6 transition-all duration-300 ease-out will-change-transform shadow-[0_10px_30px_-15px_hsl(var(--primary)/0.25)] hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_hsl(var(--primary)/0.5)] hover:border-primary/40 motion-reduce:transform-none"
      >
        {/* Cursor-tracking glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), hsl(var(--primary) / 0.18), transparent 60%)",
          }}
        />
        {/* Top gradient border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        <div
          className="relative flex flex-col h-full"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                <Icon size={18} />
              </div>
              <h3 className="font-mono text-primary text-xs tracking-wider uppercase">
                {group.category}
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${levelColor[group.level]}`}
            >
              {group.level}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {group.items.map((item, i) => (
              <span
                key={item}
                style={{ animationDelay: `${index * 120 + i * 70}ms` }}
                className="skill-pill inline-flex items-center gap-1.5 text-xs md:text-sm px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] text-foreground/90 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-105 hover:bg-primary/15 hover:border-primary/70 hover:text-primary hover:shadow-[0_0_18px_-2px_hsl(var(--primary)/0.55)] motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_hsl(var(--primary))]" />
                {item}
              </span>
            ))}
          </div>

          {/* Reveal panel */}
          <div
            className={`mt-auto overflow-hidden transition-all duration-300 ease-out ${
              hovering && !reduceMotion
                ? "max-h-40 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 translate-y-2 motion-reduce:max-h-40 motion-reduce:opacity-100 motion-reduce:translate-y-0"
            }`}
          >
            <div className="pt-3 border-t border-border/50">
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2">
                {group.description}
              </p>
              {group.years && (
                <p className="font-mono text-[11px] text-primary/80">
                  {group.years}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
SkillCard3D.displayName = "SkillCard3D";

export default SkillCard3D;
