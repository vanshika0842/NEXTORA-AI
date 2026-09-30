import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { deadlineTimeline } from "../../data/landingData";
import { fadeUp, staggerChildren, viewportOnce } from "../../lib/motion";

const statusMeta: Record<string, { label: string; dot: string; text: string }> = {
  open: { label: "Open", dot: "bg-mint-500", text: "text-mint-500" },
  upcoming: { label: "Upcoming", dot: "bg-electric-500", text: "text-electric-500" },
  "closing-soon": { label: "Closing Soon", dot: "bg-amber-500", text: "text-amber-500" },
  closed: { label: "Closed", dot: "bg-ink-300", text: "text-ink-300" },
};

export default function DeadlineSection() {
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
          <p className="text-xs font-semibold uppercase tracking-wide text-electric-500 mb-3">
            Deadline Intelligence
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-ink-900">
            Deadlines Should Never Surprise You.
          </h2>
        </motion.div>

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-ink-900" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wide text-ink-900">
              Today
            </span>
          </div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerChildren(0.12)}
            className="relative border-l-2 border-mist-200 ml-[5px] pl-8"
          >
            {deadlineTimeline.map((item) => {
              const meta = statusMeta[item.status];
              return (
                <motion.li key={item.title} variants={fadeUp} className="relative pb-9 last:pb-0">
                  <span
                    className={`absolute -left-[41px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${meta.dot}`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-ink-900">{item.title}</p>
                      <p className="text-sm text-ink-500">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
                      <span className="flex items-center gap-1 text-xs font-mono font-medium text-ink-500 bg-mist-50 border border-mist-200 rounded-full px-2.5 py-1">
                        <Clock size={11} />
                        {item.daysLeft}d remaining
                      </span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
