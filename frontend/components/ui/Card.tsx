import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-[#111827] border border-slate-800 rounded-xl p-5",
        glow && "border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  details?: string[];
  color?: "cyan" | "blue" | "green" | "amber" | "red";
  icon?: React.ReactNode;
}

const colorMap = {
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function MetricCard({ label, value, unit, description, details, color = "cyan", icon }: MetricCardProps) {
  const hasDetails = Boolean(details?.length);

  return (
    <details className={clsx("group rounded-xl border p-4 min-w-0", colorMap[color])}>
      <summary className={clsx("list-none [&::-webkit-details-marker]:hidden", hasDetails && "cursor-pointer")}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
          <span className="flex items-center gap-1 opacity-70 shrink-0">
            {icon}
            {hasDetails && <ChevronDown size={14} className="transition-transform group-open:rotate-180" />}
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono break-all">
            {typeof value === "number" ? value.toFixed(4) : value}
          </span>
          {unit && <span className="text-sm opacity-70">{unit}</span>}
        </div>
        {description && <p className="text-xs opacity-60 mt-1">{description}</p>}
        {hasDetails && <p className="mt-2 text-[11px] text-slate-400/80">Cálculo</p>}
      </summary>
      {hasDetails && (
        <div className="mt-3 border-t border-current/15 pt-3 space-y-1.5 text-xs text-slate-300/90 leading-relaxed">
          {details?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )}
    </details>
  );
}
