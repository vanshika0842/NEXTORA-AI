import { motion } from "framer-motion";
import { features } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

export default function FeaturesSection() {
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-ink-900">
            Everything You Need to Stay Ahead.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren(0.08)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group flex items-start gap-4 p-6 rounded-xl2 border border-mist-200 bg-white transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-electric-500/10 grid place-items-center transition-colors group-hover:bg-electric-500 group-hover:text-white text-electric-500">
                <f.icon size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 mb-1">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
