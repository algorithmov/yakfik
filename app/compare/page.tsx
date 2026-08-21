"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Zap, Truck, Clock, BadgePercent } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const tabs = [
  { id: "best", label: "Best Match", icon: Zap },
  { id: "price", label: "Price", icon: BadgePercent },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "rating", label: "Rating", icon: Star },
];

const platforms = [
  {
    id: "talabat",
    name: "Talabat",
    letter: "T",
    color: "bg-orange-500",
    price: 24.5,
    originalPrice: 28.0,
    rating: 4.8,
    deliveryFee: 0,
    time: "18-24m",
    serviceFee: 1.5,
    badge: "CHEAPEST & BEST VALUE",
    stars: 3,
    isBest: true,
  },
  {
    id: "snoonu",
    name: "Snoonu",
    letter: "S",
    color: "bg-purple-500",
    price: 28.0,
    originalPrice: 32.0,
    rating: 4.5,
    deliveryFee: 5.0,
    time: "12-15m",
    serviceFee: 2.0,
    badge: "FASTEST",
    stars: 0,
    isBest: false,
  },
  {
    id: "keeta",
    name: "Keeta",
    letter: "K",
    color: "bg-green-500",
    price: 29.5,
    originalPrice: 35.0,
    rating: 4.2,
    deliveryFee: 3.0,
    time: "25-30m",
    serviceFee: 1.0,
    badge: null,
    stars: 0,
    isBest: false,
  },
  {
    id: "rafeeq",
    name: "Rafeeq",
    letter: "R",
    color: "bg-blue-500",
    price: 30.0,
    originalPrice: 30.0,
    rating: 4.9,
    deliveryFee: 0,
    time: "",
    serviceFee: 0,
    badge: "BEST RATED",
    stars: 0,
    isBest: false,
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/search" className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Compare your options</h1>
        </div>
      </header>

      {/* Item Summary */}
      <section className="px-5 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <Image
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop"
            alt="Chick-N-Roll"
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-sm font-bold text-gray-900">Chick-N-Roll</h3>
            <p className="text-xs text-gray-500">Spicy Zinger Combo Meal</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-4 px-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab.id === "best"
                  ? "bg-[#3D9970] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Platform Cards */}
      <section className="mt-5 space-y-3 px-5">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`relative overflow-hidden rounded-2xl border p-4 transition ${
              platform.isBest
                ? "border-[#3D9970]/30 bg-[#3D9970]/5"
                : "border-gray-100 bg-white"
            }`}
          >
            {platform.badge && (
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-[10px] font-bold tracking-wider ${platform.isBest ? "text-[#3D9970]" : "text-gray-500"}`}>
                  {platform.badge}
                </span>
                {platform.stars > 0 && (
                  <div className="flex gap-0.5">
                    {[...Array(platform.stars)].map((_, i) => (
                      <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${platform.color}`}>
                  {platform.letter}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{platform.name}</h4>
                  {platform.badge && platform.badge !== "CHEAPEST & BEST VALUE" && (
                    <span className="text-[10px] font-bold text-[#3D9970]">{platform.badge}</span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    {platform.rating} Rating
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-gray-900">
                  {platform.price.toFixed(2)}<span className="text-xs font-normal">QAR</span>
                </p>
                {platform.originalPrice > platform.price && (
                  <p className="text-xs text-gray-400 line-through">{platform.originalPrice.toFixed(2)} QAR</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Delivery</p>
                <p className="text-sm font-bold text-gray-900">
                  {platform.deliveryFee === 0 ? "FREE" : `${platform.deliveryFee} QAR`}
                </p>
              </div>
              {platform.time && (
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Time</p>
                  <p className="text-sm font-bold text-gray-900">{platform.time}</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Service</p>
                <p className="text-sm font-bold text-gray-900">
                  {platform.serviceFee === 0 ? "—" : `${platform.serviceFee} QAR`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-5 pt-4">
        <Link
          href="/order"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3D9970] py-4 text-sm font-bold text-white transition hover:bg-[#2E7D5A]"
        >
          Choose Talabat deal
          <ArrowLeft size={16} className="rotate-180" />
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}