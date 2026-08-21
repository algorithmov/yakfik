"use client";

import YakFikLogo from "@/components/YakFikLogo";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="animate-pulse-soft">
        <YakFikLogo size={120} />
      </div>
      <p className="mt-6 text-lg font-medium text-[#3D9970]/70">Loading...</p>
    </div>
  );
}