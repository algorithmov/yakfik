"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ChevronDown,
  Mic,
  ArrowRight,
  Flame,
  Coffee,
  Leaf,
} from "lucide-react";
import YakFikLogo from "@/components/YakFikLogo";
import BottomNav from "@/components/BottomNav";

const trendingItems = [
  { icon: Flame, label: "Shawarma Platter", price: "~35 QAR avg.", color: "bg-orange-50 text-orange-500" },
  { icon: Coffee, label: "Karak & Paratha", price: "~15 QAR avg.", color: "bg-blue-50 text-blue-500" },
  { icon: Leaf, label: "Vegan Bowl", price: "~45 QAR avg.", color: "bg-green-50 text-green-500" },
];

const quickSearches = [
  "Best burger under 25 QAR",
  "Pizza for two under 60",
  "Healthy lunch deals",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 px-5 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <YakFikLogo size={36} />
            <span className="text-lg font-bold tracking-tight text-[#3D9970]">
              Yak<span className="text-[#2E7D5A]">Fik</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              <MapPin size={14} className="text-[#3D9970]" />
              Doha, QA
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#3D9970]/20">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                alt="Profile"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3D9970]/10 to-[#3D9970]/5 p-6">
          <div className="absolute -right-4 -top-4 opacity-10">
            <YakFikLogo size={120} />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
            Find the best deal.
            <span className="block text-[#3D9970]">Automatically.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Tell Yakfik what you&apos;re craving and we&apos;ll compare your options across all delivery apps.
          </p>
        </div>
      </section>

      {/* Trending Now */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-lg font-bold text-gray-900">Trending Now</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {trendingItems.map((item) => (
            <button
              key={item.label}
              className="flex-shrink-0 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-[#3D9970]/20"
            >
              <div className={`inline-flex rounded-lg p-2 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.price}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Searches */}
      <section className="mt-5 px-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickSearches.map((query) => (
            <Link
              key={query}
              href="/search"
              className="flex-shrink-0 rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#3D9970]/10 hover:text-[#3D9970]"
            >
              {query}
            </Link>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="mt-4 px-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-1 ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-[#3D9970]/30">
          <button className="ml-3 rounded-full p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600">
            <Mic size={18} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="fries & drink under 30 QAR..."
            className="flex-1 bg-transparent py-3 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D9970] text-white transition hover:bg-[#2E7D5A]"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Medicine Quick Link */}
      <section className="mt-5 px-5">
        <Link
          href="/medicine"
          className="flex items-center gap-3 rounded-xl bg-[#3D9970]/5 p-4 transition hover:bg-[#3D9970]/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3D9970]/10 text-[#3D9970]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Looking for medicine?</p>
            <p className="text-xs text-gray-500">Compare pharmacy prices instantly</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-400" />
        </Link>
      </section>

      {/* Recent Activity Preview */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <Link href="/saved" className="text-xs font-medium text-[#3D9970]">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          <Link href="/compare" className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Flame size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Burger under 30 QAR</p>
              <p className="text-xs text-gray-500">Best found: 23.50 QAR</p>
            </div>
            <span className="text-xs font-semibold text-[#3D9970]">2 days ago</span>
          </Link>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}