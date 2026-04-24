/**
 * Reusable Progress Bar Component
 * Replaces inline style={{ width: `${percentage}%` }} patterns
 */
"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  variant?: "primary" | "red" | "blue" | "orange" | "green" | "yellow" | "purple";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  percentage,
  variant = "blue",
  size = "md",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const variantClasses = {
    primary: "progress-bar-primary",
    red: "progress-bar-red",
    blue: "progress-bar-blue",
    orange: "progress-bar-orange",
    green: "progress-bar-green",
    yellow: "progress-bar-yellow",
    purple: "progress-bar-purple",
  };

  const sizeClasses = {
    sm: "progress-bar-container-sm",
    md: "progress-bar-container-md",
    lg: "progress-bar-container-lg",
  };

  return (
    <div className={cn("progress-bar-container", sizeClasses[size], className)}>
      <div
        className={cn("progress-bar-fill", variantClasses[variant])}
        style={{ "--progress-width": `${percentage}%` } as React.CSSProperties}
      >
        {showLabel && label && (
          <span className="flex items-center justify-end px-2 text-xs text-white font-semibold h-full">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
