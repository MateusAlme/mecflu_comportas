"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface PressureChartProps {
  data: { altura_cm: number; pressao_pa: number }[];
}

export function PressureChart({ data }: PressureChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
        <XAxis dataKey="altura_cm" stroke="#475569" fontSize={11} label={{ value: "Altura H (cm)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#22d3ee" }}
        />
        <Line type="monotone" dataKey="pressao_pa" stroke="#22d3ee" strokeWidth={2} dot={false} name="Pressão (Pa)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ForceChartProps {
  data: { altura_cm: number; forca_n: number }[];
}

export function ForceChart({ data }: ForceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
        <XAxis dataKey="altura_cm" stroke="#475569" fontSize={11} label={{ value: "Altura H (cm)", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#3b82f6" }}
        />
        <Line type="monotone" dataKey="forca_n" stroke="#3b82f6" strokeWidth={2} dot={false} name="Força (N)" />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ComparisonChartProps {
  data: { label: string; teorico: number; experimental: number }[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
        <XAxis dataKey="label" stroke="#475569" fontSize={11} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="teorico" name="Teórico" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        <Bar dataKey="experimental" name="Experimental" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
