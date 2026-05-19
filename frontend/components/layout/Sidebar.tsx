"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, FileText } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/simulator", icon: FlaskConical, label: "Simulador" },
  { href: "/reports", icon: FileText, label: "Relatórios" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 right-0 bottom-0 z-40 h-16 bg-[#0d1224] border-t border-cyan-500/10 px-3 py-2 md:top-16 md:right-auto md:bottom-0 md:h-auto md:w-64 md:border-t-0 md:border-r md:py-6 md:flex md:flex-col">
      <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <Icon size={18} />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block mt-auto px-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/10">
          <p className="text-xs text-cyan-400 font-medium mb-1">Fluido padrão</p>
          <p className="text-xs text-slate-400">Água — 1000 kg/m³</p>
          <p className="text-xs text-slate-400">g = 9,81 m/s²</p>
        </div>
      </div>
    </aside>
  );
}
