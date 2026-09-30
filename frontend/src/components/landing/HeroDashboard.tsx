import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { Sparkles, ArrowUpRight, CheckCircle2, Clock, TrendingUp, Bell } from "lucide-react";
import { heroOpportunities } from "../../data/landingData";
import FloatingNotification from "./FloatingNotification";

function MatchRing() {
  const [display, setDisplay] = useState(0);
  const target = 94;
  const circumference = 2 * Math.PI * 26;

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.6,
      delay: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, []);

  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#E4E8F5" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2E6BFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-mono text-xs font-semibold text-ink-900">
        {display}%
      </div>
    </div>
  );
}

const statusDot: Record<string, string> = {
  "closing-soon": "bg-amber-500",
  open: "bg-mint-500",
  upcoming: "bg-electric-500",
  closed: "bg-ink-300",
};

export default function HeroDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-40, 40], [3, -3]), { stiffness: 120, damping: 14 });
  const rotateY = useSpring(useTransform(x, [-40, 40], [-3, 3]), { stiffness: 120, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative flex items-center justify-center py-10 lg:py-0">
      {/* ambient glow + radar sweep behind the card */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-electric-500/10 blur-3xl" aria-hidden />
      <div
        className="absolute w-[320px] h-[320px] rounded-full opacity-30 motion-reduce:hidden animate-sweep"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(46,107,255,0.35) 40deg, transparent 90deg)",
        }}
        aria-hidden
      />

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-[380px]"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative bg-white rounded-xl2 shadow-card border border-mist-200 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-display font-semibold text-sm text-ink-900">
              <span className="grid place-items-center w-6 h-6 rounded-md bg-gradient-to-br from-electric-500 to-indigo-500 text-white">
                <Sparkles size={12} />
              </span>
              Nextora
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint-500" />
            </span>
          </div>

          <p className="text-xs text-ink-500 mb-1">Good morning,</p>
          <p className="font-display font-semibold text-lg text-ink-900 mb-5">Student</p>

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Recommended for you
            </p>
            <TrendingUp size={14} className="text-electric-500" />
          </div>

          <div className="space-y-2.5 mb-5">
            {heroOpportunities.map((op, i) => (
              <motion.div
                key={op.title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.18 }}
                className="rounded-lg border border-mist-200 p-3 bg-mist-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-ink-900">{op.title}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[op.status]}`} />
                </div>
                <p className="text-xs text-ink-500 mt-0.5">{op.category}</p>
                {op.status === "closing-soon" ? (
                  <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs font-mono font-medium">
                    <Clock size={12} />
                    {op.daysLeft} days
                  </div>
                ) : null}
                <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-electric-500">
                  View Opportunity <ArrowUpRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-mist-200">
            <MatchRing />
            <div>
              <p className="text-sm font-semibold text-ink-900">Profile Match</p>
              <p className="text-xs text-ink-500">Based on your saved goals</p>
            </div>
          </div>
        </motion.div>

        <FloatingNotification
          icon={CheckCircle2}
          text="New opportunity matched"
          tone="success"
          className="-top-6 -left-8 hidden sm:flex"
          delay={1.2}
          driftDuration={7}
        />
        <FloatingNotification
          icon={Clock}
          text="Deadline in 3 days"
          tone="warning"
          className="top-1/3 -right-10 hidden sm:flex"
          delay={1.5}
          driftDuration={8.5}
        />
        <FloatingNotification
          icon={Bell}
          text="+12 opportunities this week"
          className="-bottom-5 -left-6 hidden sm:flex"
          delay={1.8}
          driftDuration={9}
        />
      </motion.div>
    </div>
  );
}
