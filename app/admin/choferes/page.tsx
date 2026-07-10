"use client";

import dynamic from "next/dynamic";

const ChoferesDashboard = dynamic(
  () => import("@/components/admin/ChoferesDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse" />
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse delay-75" />
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    ),
  }
);

export default function ChoferesPage() {
  return <ChoferesDashboard />;
}
