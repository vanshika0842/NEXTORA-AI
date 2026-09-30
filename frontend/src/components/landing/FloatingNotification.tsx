import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FloatingNotificationProps {
  icon: LucideIcon;
  text: string;
  tone?: "default" | "success" | "warning";
  className?: string;
  delay?: number;
  driftDuration?: number;
}

const toneStyles: Record<string, string> = {
  default: "text-ink-900",
  success: "text-mint-500",
  warning: "text-amber-500",
};

export default function FloatingNotification({
  icon: Icon,
  text,
  tone = "default",
  className = "",
  delay = 0,
  driftDuration = 8,
}: FloatingNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
        scale: 1,
        transition: {
          opacity: { duration: 0.6, delay },
          scale: { duration: 0.6, delay },
          y: { duration: driftDuration, repeat: Infinity, ease: "easeInOut", delay },
        },
      }}
      className={`absolute flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-mist-200 shadow-card rounded-xl px-3.5 py-2.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <Icon size={15} className={toneStyles[tone]} strokeWidth={2.2} />
      <span className="text-ink-700">{text}</span>
    </motion.div>
  );
}
