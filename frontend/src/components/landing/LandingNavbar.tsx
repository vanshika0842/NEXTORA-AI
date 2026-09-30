import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="top"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-soft border-b border-mist-200"
          : "bg-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between h-18 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#top");
          }}
          className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight text-ink-900"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-indigo-500 text-white">
            <Sparkles size={16} strokeWidth={2.4} />
          </span>
          NEXTORA
        </a>

        <ul className="hidden md:flex items-center gap-9 text-sm font-medium text-ink-700">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-electric-500 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-ink-700 hover:text-ink-900 px-4 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="text-sm font-semibold text-white bg-ink-900 hover:bg-navy-800 px-5 py-2.5 rounded-lg shadow-soft transition-all hover:-translate-y-0.5"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Link>
        </div>

        <button
          className="md:hidden grid place-items-center w-10 h-10 rounded-lg text-ink-900"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-b border-mist-200 shadow-soft"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="container-px py-4 flex flex-col gap-1"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.label}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="block py-3 text-base font-medium text-ink-700"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                className="flex gap-3 pt-3 border-t border-mist-200 mt-2"
              >
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-lg border border-mist-200 font-medium text-ink-900"
                >
                  Login
                </Link>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="flex-1 text-center py-2.5 rounded-lg bg-ink-900 text-white font-semibold"
                >
                  {isAuthenticated ? "Dashboard" : "Get Started"}
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
