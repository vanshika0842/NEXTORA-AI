import { motion } from "framer-motion";
import { problemCards } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

export default function ProblemSection() {
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
            Opportunities Are Everywhere. Knowing Which Ones Matter Is Hard.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren(0.12)}
          className="grid md:grid-cols-3 gap-6"
        >
          {problemCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="p-7 rounded-xl2 border border-mist-200 bg-white hover:shadow-card transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-electric-500/10 grid place-items-center mb-5">
                <card.icon size={20} className="text-electric-500" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-display font-semibold text-ink-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
