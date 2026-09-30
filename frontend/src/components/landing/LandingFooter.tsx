import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { footerColumns } from "../../data/landingData";

export default function LandingFooter() {
  return (
    <footer className="bg-navy-950 text-ink-300 pt-16 pb-8">
      <div className="container-px max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1.4fr_repeat(4,1fr)] gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-display font-semibold text-lg text-white mb-3">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-indigo-500 text-white">
                <Sparkles size={16} />
              </span>
              NEXTORA
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Helping students discover what comes next.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="pt-6 text-xs text-ink-300/60">
          © 2026 Nextora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
