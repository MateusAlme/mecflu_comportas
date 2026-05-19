"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, FileText, BookOpen } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/simulator", icon: FlaskConical, label: "Simulador" },
  { href: "/reports", icon: FileText, label: "Relatórios" },
  { href: "/theory", icon: BookOpen, label: "Área Teórica" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0d1224] border-r border-cyan-500/10 flex flex-col py-6 px-3">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
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

      <div className="mt-auto px-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/10">
          <p className="text-xs text-cyan-400 font-medium mb-1">Fluido padrão</p>
          <p className="text-xs text-slate-400">Água — 1000 kg/m³</p>
          <p className="text-xs text-slate-400">g = 9,81 m/s²</p>
        </div>
      </div>
    </aside>
  );
}
