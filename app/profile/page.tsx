"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import YakFikLogo from "@/components/YakFikLogo";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: Settings, label: "Account Settings", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Shield, label: "Privacy & Security", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Profile</h1>
        </div>
      </header>

      <section className="px-5 pt-4">
        <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[#3D9970]/10 to-[#3D9970]/5 p-5">
          <div className="h-16 w-16 overflow-hidden rounded-full border-3 border-white shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
              alt="Profile"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chaikh</h2>
            <p className="text-sm text-gray-500">Doha, Qatar</p>
            <p className="mt-1 text-xs font-medium text-[#3D9970]">Premium Member</p>
          </div>
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Searches", value: "24" },
            { label: "Saved", value: "12" },
            { label: "Saved QAR", value: "186" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <item.icon size={18} />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-4 px-5">
        <button className="flex w-full items-center gap-3 rounded-xl p-3 text-red-500 transition hover:bg-red-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </section>

      <BottomNav />
    </div>
  );
}