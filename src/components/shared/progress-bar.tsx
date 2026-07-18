"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedProgressBar({
  value,
  label,
  showPercentage = true,
  className,
  size = "md",
}: AnimatedProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <motion.span
              key={clampedValue}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="tabular-nums text-muted-foreground"
            >
              {Math.round(clampedValue)}%
            </motion.span>
          )}
        </div>
      )}
      <Progress
        value={clampedValue}
        className={cn(
          size === "sm" && "h-2",
          size === "md" && "h-3",
          size === "lg" && "h-4"
        )}
      />
    </div>
  );
}
