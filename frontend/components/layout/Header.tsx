"use client";
import Link from "next/link";
import { Waves } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0d1224] border-b border-cyan-500/10 flex items-center px-4 sm:px-6 gap-3 sm:gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <Waves size={16} className="text-white" />
        </div>
        <Link href="/" className="text-base sm:text-lg font-bold text-white tracking-tight">
          Mec<span className="text-cyan-400">Flu</span>
        </Link>
        <span className="text-slate-500 text-sm hidden sm:block">Simulador de Comporta Hidrostática</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          v1.0 — MVP
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="API online" />
      </div>
    </header>
  );
}
