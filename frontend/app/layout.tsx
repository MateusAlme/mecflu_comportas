import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "MecFlu — Simulador de Comporta Hidrostática",
  description: "Plataforma educacional para simulação e análise de experimentos de mecânica dos fluidos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0a0e1a] text-slate-100 min-h-screen">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 pt-16 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
