import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  Compass,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export type AppNavKey = "dashboard" | "profile" | "opportunities";

interface AppShellProps {
  activeNav: AppNavKey;
  breadcrumb: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

function navClass(active: boolean) {
  return active
    ? "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium"
    : "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium";
}

function initials(name?: string | null) {
  if (!name?.trim()) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function AppShell({
  activeNav,
  breadcrumb,
  children,
  title,
  subtitle,
}: AppShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 md:flex">
        <div>
          <div className="mb-6 flex items-center gap-2 px-3 py-2">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">Nextora</span>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className={navClass(activeNav === "dashboard")}>
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/profile" className={navClass(activeNav === "profile")}>
              <UserCheck className="h-5 w-5" />
              Academic Profile
            </Link>
            <Link
              to="/opportunities"
              className={navClass(activeNav === "opportunities")}
            >
              <Compass className="h-5 w-5" />
              Opportunities
            </Link>
            <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-slate-400">
              <Award className="h-5 w-5" />
              Scholarships
            </span>
          </nav>
        </div>

        <div className="space-y-1 border-t border-slate-200 pt-4">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Nextora</span>
            <span>/</span>
            <span className="font-medium text-slate-800">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 md:pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {initials(user?.name)}
              </div>
              <div className="hidden text-xs sm:block">
                <p className="font-semibold text-slate-800">
                  {user?.name || "Student"}
                </p>
                <p className="text-slate-500">{user?.email || ""}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
