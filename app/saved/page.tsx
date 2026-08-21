"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search, Bookmark, ArrowRight, Star, X } from "lucide-react";
import YakFikLogo from "@/components/YakFikLogo";
import BottomNav from "@/components/BottomNav";

const recentSearches = [
  { query: "Burger under 30 QAR", result: "23.50", time: "2 DAYS AGO" },
  { query: "Healthy Salads", result: "32.00", time: "YESTERDAY" },
];

const savedRestaurants = [
  {
    name: "Chick-N-Roll",
    category: "American • Burgers",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&h=200&fit=crop",
  },
  {
    name: "Sushi Hub",
    category: "Japanese • Sushi",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop",
  },
];

const previousComparisons = [
  {
    item: "Spicy Zinger Combo",
    apps: 3,
    bestDeal: "24.50 QAR",
    date: "OCT 12",
    platforms: [
      { color: "bg-green-500", name: "Talabat" },
      { color: "bg-gray-900", name: "Snoonu" },
      { color: "bg-blue-500", name: "Keeta" },
    ],
  },
  {
    item: "Family Margherita Pizza",
    apps: 2,
    bestDeal: "45.00 QAR",
    date: "OCT 10",
    platforms: [
      { color: "bg-green-500", name: "Talabat" },
      { color: "bg-gray-900", name: "Snoonu" },
    ],
  },
];

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 px-5 pt-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <YakFikLogo size={32} />
            <span className="text-lg font-bold tracking-tight text-[#3D9970]">
              Yak<span className="text-[#2E7D5A]">Fik</span>
            </span>
          </div>
          <button className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      {/* Recent Searches */}
      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent searches</h2>
          <button className="text-xs font-medium text-gray-400 hover:text-gray-600">Clear all</button>
        </div>
        <div className="mt-3 space-y-2">
          {recentSearches.map((search) => (
            <Link
              key={search.query}
              href="/search"
              className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Search size={15} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{search.query}</p>
                <p className="text-[10px] font-medium text-gray-400">{search.time}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Best found</p>
                <p className="text-sm font-bold text-[#3D9970]">QAR {search.result}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Saved Restaurants */}
      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Saved restaurants</h2>
          <button className="text-xs font-medium text-[#3D9970]">View all</button>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {savedRestaurants.map((restaurant) => (
            <div
              key={restaurant.name}
              className="relative flex-shrink-0 w-40 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              <div className="relative h-24 w-full">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                <button className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#3D9970] text-white">
                  <Bookmark size={12} className="fill-white" />
                </button>
              </div>
              <div className="p-2.5">
                <h3 className="text-sm font-bold text-gray-900">{restaurant.name}</h3>
                <p className="text-[10px] text-gray-500">{restaurant.category}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">{restaurant.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Comparisons */}
      <section className="mt-6 px-5">
        <h2 className="text-lg font-bold text-gray-900">Previous comparisons</h2>
        <div className="mt-3 space-y-3">
          {previousComparisons.map((comp) => (
            <Link
              key={comp.item}
              href="/compare"
              className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{comp.item}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {comp.platforms.map((p) => (
                    <div
                      key={p.name}
                      className={`h-5 w-5 rounded-full ${p.color}`}
                      title={p.name}
                    />
                  ))}
                  <span className="text-[10px] text-gray-400">{comp.apps} apps compared</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">{comp.date}</p>
                <p className="text-[10px] font-bold text-[#3D9970]">BEST DEAL</p>
                <p className="text-sm font-bold text-gray-900">{comp.bestDeal}</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}