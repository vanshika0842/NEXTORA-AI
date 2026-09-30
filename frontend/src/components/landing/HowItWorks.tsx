import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { processSteps } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

export default function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="section-py bg-mist-50">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-electric-500 mb-3">
            How Nextora Works
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-ink-900">
            From Confused to Career-Ready.
          </h2>
        </motion.div>

        <div ref={trackRef} className="relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-mist-200" />
          <motion.div
            style={{ scaleX: lineScale }}
            className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-electric-500 to-cyan-400 origin-left"
          />
          <div className="md:hidden absolute top-0 bottom-0 left-6 w-px bg-mist-200" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="md:hidden absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-electric-500 to-cyan-400 origin-top"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerChildren(0.15)}
            className="grid md:grid-cols-4 gap-10 md:gap-6"
          >
            {processSteps.map((step) => (
              <motion.div key={step.number} variants={fadeUp} className="relative pl-16 md:pl-0">
                <div className="md:mb-6 absolute md:relative top-0 left-0 w-12 h-12 rounded-full bg-white border-2 border-electric-500 grid place-items-center font-mono text-sm font-semibold text-electric-500 shadow-soft">
                  {step.number}
                </div>
                <h3 className="text-base font-display font-semibold text-ink-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
