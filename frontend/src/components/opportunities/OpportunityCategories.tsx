import {
  Award,
  Briefcase,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Layers,
  BookOpen,
  Trophy,
  Users,
  ScrollText,
} from "lucide-react";
import type { OpportunityType } from "../../types/opportunity";

const CATEGORIES: {
  label: string;
  value: OpportunityType | "ALL";
  icon: typeof Layers;
}[] = [
  { label: "All", value: "ALL", icon: Layers },
  { label: "Exams", value: "EXAM", icon: BookOpen },
  { label: "Scholarships", value: "SCHOLARSHIP", icon: GraduationCap },
  { label: "Courses", value: "COURSE", icon: ScrollText },
  { label: "Internships", value: "INTERNSHIP", icon: Briefcase },
  { label: "Certifications", value: "CERTIFICATION", icon: Award },
  { label: "Competitions", value: "COMPETITION", icon: Trophy },
  { label: "Research", value: "RESEARCH", icon: FlaskConical },
  { label: "Fellowships", value: "FELLOWSHIP", icon: Users },
  { label: "Career Programs", value: "CAREER_PROGRAM", icon: Compass },
  { label: "International", value: "INTERNATIONAL", icon: Globe },
];

interface OpportunityCategoriesProps {
  activeType: OpportunityType | "ALL";
  onSelect: (type: OpportunityType | "ALL") => void;
}

export function OpportunityCategories({
  activeType,
  onSelect,
}: OpportunityCategoriesProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const active = activeType === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onSelect(cat.value)}
            className={
              active
                ? "inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white"
                : "inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
