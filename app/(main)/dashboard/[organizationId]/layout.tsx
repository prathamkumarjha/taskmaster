"use client";
import Sidebar from "@/app/(main)/dashboard/_components/sidebar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 min-h-screen text-stone-300 flex">
      <div className="hidden w-64 shrink-0 md:block">
        <Sidebar />
      </div>
      {/* we will work on it */}
      {children}
    </div>
  );
}
