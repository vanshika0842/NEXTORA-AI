import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Trophy,
  GraduationCap,
  BadgeCheck,
  Building2,
  Briefcase,
  BookOpen,
  TrendingUp,
  CalendarClock,
  Search,
  UserCheck,
  Target,
  Bell,
  LayoutDashboard,
  Compass,
  ShieldCheck,
} from "lucide-react";

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 10000, suffix: "+", label: "Students discovering opportunities" },
  { value: 500, suffix: "+", label: "Opportunities tracked" },
  { value: 50, suffix: "+", label: "Exam & scholarship sources" },
  { value: 24, suffix: "/7", label: "Deadline monitoring" },
];

export interface ProblemCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const problemCards: ProblemCard[] = [
  {
    icon: CalendarClock,
    title: "Missed Deadlines",
    description:
      "Important applications close before students even discover them.",
  },
  {
    icon: Search,
    title: "Too Much Information",
    description:
      "Students search through dozens of websites to find relevant opportunities.",
  },
  {
    icon: UserCheck,
    title: "Wrong Opportunities",
    description: "Not every exam or scholarship is relevant to every student.",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Build Your Profile",
    description: "Tell Nextora about your education, skills and career interests.",
  },
  {
    number: "02",
    title: "Discover Opportunities",
    description: "Nextora finds opportunities relevant to your profile.",
  },
  {
    number: "03",
    title: "Get Smart Recommendations",
    description:
      "See exams, scholarships and career paths you are most likely to benefit from.",
  },
  {
    number: "04",
    title: "Never Miss a Deadline",
    description: "Receive reminders before important applications close.",
  },
];

export interface Category {
  icon: LucideIcon;
  name: string;
  description: string;
  count: string;
}

export const categories: Category[] = [
  {
    icon: Landmark,
    name: "Government Exams",
    description: "Central & state-level recruitment exams.",
    count: "120+",
  },
  {
    icon: Trophy,
    name: "Competitive Exams",
    description: "National-level tests across streams.",
    count: "80+",
  },
  {
    icon: GraduationCap,
    name: "Scholarships",
    description: "Merit and need-based funding.",
    count: "95+",
  },
  {
    icon: BadgeCheck,
    name: "Certifications",
    description: "Industry-recognized skill credentials.",
    count: "60+",
  },
  {
    icon: Building2,
    name: "PSU Opportunities",
    description: "Public sector recruitment drives.",
    count: "40+",
  },
  {
    icon: Briefcase,
    name: "Internships",
    description: "Paid and academic-credit internships.",
    count: "70+",
  },
  {
    icon: BookOpen,
    name: "Entrance Exams",
    description: "College & university admissions.",
    count: "55+",
  },
  {
    icon: TrendingUp,
    name: "Career Opportunities",
    description: "Early-career roles and fellowships.",
    count: "45+",
  },
];

export interface Opportunity {
  title: string;
  category: string;
  status: "open" | "closing-soon" | "upcoming" | "closed";
  daysLeft: number;
  match?: number;
}

export const heroOpportunities: Opportunity[] = [
  { title: "GATE 2027", category: "Application closes", status: "closing-soon", daysLeft: 12 },
  { title: "IBPS PO", category: "Applications Open", status: "open", daysLeft: 34 },
];

export const deadlineTimeline: Opportunity[] = [
  { title: "IBPS PO", category: "Banking Examination", status: "closing-soon", daysLeft: 12 },
  { title: "GATE 2027", category: "Engineering Entrance", status: "open", daysLeft: 24 },
  { title: "SSC CGL", category: "Government Exam", status: "upcoming", daysLeft: 31 },
  { title: "Merit Scholarship", category: "Undergraduate Funding", status: "upcoming", daysLeft: 45 },
];

export interface Persona {
  label: string;
  paths: string[];
}

export const personas: Persona[] = [
  {
    label: "11th / 12th Student",
    paths: ["Entrance Exams", "Scholarships", "Career Exploration"],
  },
  {
    label: "College Student",
    paths: ["Internships", "Certifications", "Competitive Exams"],
  },
  {
    label: "Graduate",
    paths: ["Government Jobs", "Banking Exams", "PSU Opportunities", "Higher Studies"],
  },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Target,
    title: "Smart Recommendations",
    description: "Relevant opportunities based on your profile.",
  },
  {
    icon: CalendarClock,
    title: "Deadline Tracking",
    description: "Know what is closing soon.",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility Matching",
    description: "Understand whether you can apply.",
  },
  {
    icon: LayoutDashboard,
    title: "Personalized Dashboard",
    description: "Everything important in one place.",
  },
  {
    icon: Compass,
    title: "Opportunity Discovery",
    description: "Explore opportunities you may not know about.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Get reminders before important deadlines.",
  },
];

export interface FooterColumn {
  title: string;
  links: { label: string; to: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Opportunities", to: "/#opportunities" },
      { label: "How It Works", to: "/#how-it-works" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Guides", to: "/guides" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];
