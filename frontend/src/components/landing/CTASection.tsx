import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fadeUp, viewportOnce } from "../../lib/motion";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-24 md:py-32 bg-navy-950 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-electric-500/20 blur-[140px]"
        aria-hidden
      />
      <div className="absolute inset-0 grid-bg-dark [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_75%)]" aria-hidden />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative container-px max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white leading-tight">
          Your Next Opportunity Could Change Everything.
        </h2>
        <p className="mt-5 text-ink-300 text-lg">
          Create your profile and let Nextora help you discover what comes next.
        </p>

        <Link
          to={isAuthenticated ? "/dashboard" : "/register"}
          className="group mt-9 inline-flex items-center gap-2 bg-white text-ink-900 font-semibold text-sm px-7 py-4 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-5 text-xs text-ink-300/70">
          No complicated setup. Start discovering opportunities.
        </p>
      </motion.div>
    </section>
  );
}
