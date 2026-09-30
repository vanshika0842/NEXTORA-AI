import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { personas } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

export default function PersonalizationSection() {
  return (
    <section id="about" className="section-py bg-mist-50">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-ink-900">
            Built Around You. Not Everyone Else.
          </h2>
        </motion.div>

        <div className="relative grid lg:grid-cols-3 gap-6 lg:gap-10 items-start">
          {/* central engine node, desktop only, positioned above middle card */}
          <div className="hidden lg:flex absolute -top-14 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500 to-indigo-500 grid place-items-center shadow-glow">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="text-xs font-mono font-semibold text-ink-500">Nextora Engine</span>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerChildren(0.12)}
            className="contents"
          >
            {personas.map((persona, i) => (
              <motion.div key={persona.label} variants={fadeUp} className="relative pt-10 lg:pt-16">
                {/* connector line to engine, desktop only */}
                <svg
                  className="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 w-px h-16"
                  aria-hidden
                >
                  <motion.line
                    x1="0" y1="0" x2="0" y2="64"
                    stroke="#2E6BFF" strokeWidth="1.5" strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  />
                </svg>

                <div className="rounded-xl2 border border-mist-200 bg-white p-6 shadow-soft h-full">
                  <h3 className="font-display font-semibold text-ink-900 mb-4">{persona.label}</h3>
                  <ul className="space-y-2">
                    {persona.paths.map((path) => (
                      <li
                        key={path}
                        className="text-sm text-ink-700 bg-mist-50 border border-mist-200 rounded-lg px-3 py-2"
                      >
                        {path}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
