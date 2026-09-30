import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroDashboard from "./HeroDashboard";
import { fadeUp, staggerChildren } from "../../lib/motion";

export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div
        className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_75%)]"
        aria-hidden
      />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-electric-500/10 blur-[120px]"
        aria-hidden
      />

      <div className="relative container-px grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren(0.14)}
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-electric-500 bg-electric-500/10 px-3 py-1.5 rounded-full mb-6"
          >
            Opportunity Intelligence, for students
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-semibold leading-[1.08] tracking-tight text-ink-900"
          >
            Your Future Starts With{" "}
            <span className="text-gradient">Knowing What's Next.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-ink-500 max-w-xl leading-relaxed"
          >
            Nextora helps students discover the right exams, scholarships,
            certifications and career opportunities — before they miss them.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-ink-900 text-white font-semibold text-sm px-6 py-3.5 rounded-lg shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              Explore Opportunities
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 text-ink-900 font-semibold text-sm px-6 py-3.5 rounded-lg border border-mist-200 hover:border-ink-300 transition-colors"
            >
              See How It Works
            </a>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-xs text-ink-500 tracking-wide">
            Trusted by students preparing for exams, scholarships and government roles nationwide.
          </motion.p>
        </motion.div>

        <HeroDashboard />
      </div>
    </section>
  );
}
