import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

export default function OpportunityCategories() {
  return (
    <section id="opportunities" className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-ink-900">
            One Platform. Thousands of Possibilities.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren(0.08)}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              variants={fadeUp}
              className="group text-left p-6 rounded-xl2 border border-mist-200 bg-white transition-all hover:-translate-y-1 hover:border-electric-500/40 hover:shadow-card"
            >
              <div className="w-11 h-11 rounded-lg bg-electric-500/10 grid place-items-center mb-5 transition-transform group-hover:translate-x-0.5">
                <cat.icon size={20} className="text-electric-500" strokeWidth={2} />
              </div>
              <h3 className="font-display font-semibold text-ink-900 mb-1.5">{cat.name}</h3>
              <p className="text-sm text-ink-500 mb-5 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-ink-500">
                  {cat.count} opportunities
                </span>
                <ArrowRight
                  size={16}
                  className="text-electric-500 transition-transform group-hover:translate-x-1"
                />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
