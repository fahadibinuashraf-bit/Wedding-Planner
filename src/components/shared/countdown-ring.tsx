"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCountdown, getPlanningProgress, WEDDING_DATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CountdownRingProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CountdownRing({
  size = 180,
  strokeWidth = 10,
  className,
}: CountdownRingProps) {
  const [countdown, setCountdown] = useState(getCountdown());
  const planningProgress = getPlanningProgress();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (planningProgress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#countdownGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          key={countdown.days}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-4xl font-bold text-emerald-dark dark:text-emerald-light"
        >
          {countdown.days}
        </motion.span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Days Left
        </span>
        <div className="mt-2 flex gap-2 text-xs tabular-nums text-muted-foreground">
          <span>{String(countdown.hours).padStart(2, "0")}h</span>
          <span>{String(countdown.minutes).padStart(2, "0")}m</span>
          <span>{String(countdown.seconds).padStart(2, "0")}s</span>
        </div>
      </div>
    </div>
  );
}

export function CountdownBanner() {
  const [countdown, setCountdown] = useState(getCountdown());

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  const weddingDateFormatted = WEDDING_DATE.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{weddingDateFormatted}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold text-gradient-gold">
          {countdown.days}
        </span>
        <span className="text-muted-foreground">days until the celebration</span>
      </div>
    </div>
  );
}
