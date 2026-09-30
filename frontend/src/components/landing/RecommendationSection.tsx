import { motion } from "framer-motion";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { fadeUp, slideRight, slideLeft, viewportOnce } from "../../lib/motion";

const profileFields = [
  { label: "Education", value: "BBA" },
  { label: "Interests", value: "Finance · Management · Government Jobs" },
  { label: "Career Goal", value: "Public Sector" },
  { label: "Skills", value: "Communication · Excel · Management" },
];

const reasons = [
  "Management background",
  "Graduate eligible",
  "Finance interest",
];

export default function RecommendationSection() {
  return (
    <section className="section-py bg-navy-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 grid-bg-dark" aria-hidden />
      <div className="relative container-px max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-400 mb-3">
            Intelligent Recommendations
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Stop Searching. Start Getting Matched.
          </h2>
          <p className="mt-4 text-navy-100/70 text-ink-300 leading-relaxed">
            Nextora uses your profile to surface opportunities that actually make
            sense for your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideRight}
            className="rounded-xl2 border border-white/10 bg-white/5 backdrop-blur-sm p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-300 mb-5">
              Your Profile
            </p>
            <dl className="space-y-4">
              {profileFields.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-ink-300 mb-1">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* connecting flow indicator */}
          <div className="hidden lg:flex flex-col items-center gap-2 py-4" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
              />
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideLeft}
            className="rounded-xl2 border border-white/10 bg-white/5 backdrop-blur-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                Recommended for you
              </p>
              <span className="flex items-center gap-1 text-xs font-mono font-semibold text-amber-500">
                <Star size={12} fill="currentColor" /> 98% Match
              </span>
            </div>

            <h3 className="text-xl font-display font-semibold mb-0.5">IBPS PO</h3>
            <p className="text-sm text-ink-300 mb-5">Banking Examination</p>

            <p className="text-xs font-semibold text-ink-300 mb-2.5">Why this matches you:</p>
            <ul className="space-y-2 mb-6">
              {reasons.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-mint-500 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <p className="text-xs text-ink-300">Application closes</p>
                <p className="text-sm font-mono font-medium">18 September 2026</p>
              </div>
              <button className="flex items-center gap-1.5 bg-white text-ink-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-transform hover:-translate-y-0.5">
                Explore <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
