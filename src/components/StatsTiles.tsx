import React from "react";
import { IconType } from "react-icons";

interface Props {
  Icon: IconType;
  title: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
}

export default function StatsTiles({ Icon, title, value, hint, loading }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-line shadow-surface p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">{title}</span>
        <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
          <Icon className="text-xl text-brand" />
        </div>
      </div>
      {loading ? (
        <div className="h-9 w-24 rounded-lg bg-canvas animate-pulse" />
      ) : (
        <p className="text-3xl font-semibold tracking-tight text-ink">{value}</p>
      )}
      {hint && <p className="text-xs !text-ink-muted -mt-2">{hint}</p>}
    </div>
  );
}
