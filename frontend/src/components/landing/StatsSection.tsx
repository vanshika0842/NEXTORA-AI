import { useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useRef } from "react";
import { stats } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative border-y border-mist-200 bg-mist-50">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren(0.1)}
        className="container-px max-w-7xl mx-auto py-14 grid grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} className="text-center lg:text-left">
            <p className="text-3xl md:text-4xl font-display font-semibold text-ink-900">
              <StatValue value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1.5 text-sm text-ink-500">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
