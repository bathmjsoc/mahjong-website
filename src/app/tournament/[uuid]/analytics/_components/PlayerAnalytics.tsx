import type { ReactNode } from "react";

type AnalyticsCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function AnalyticsCard({
  title,
  children,
  className,
}: AnalyticsCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-primary p-2">
      <span className="text-secondary">{title}</span>
      <div className={className}>{children}</div>
    </div>
  );
}
