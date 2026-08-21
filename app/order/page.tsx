"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, MapPin, Check, ArrowRight, HelpCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <Image
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop"
          alt="Chick-N-Roll Burger"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link
          href="/compare"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Restaurant Info */}
      <div className="relative -mt-6 rounded-t-3xl bg-white px-5 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Chick-N-Roll</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={14} className="fill-yellow-400" />
                4.8 (2.4k+)
              </span>
              <span>•</span>
              <span>American • Burgers</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
            <MapPin size={13} className="text-[#3D9970]" />
            2.4 km
          </div>
        </div>

        {/* Selected Meal */}
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Selected Meal</p>
          <div className="mt-2 flex items-center gap-3">
            <Image
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop"
              alt="Spicy Zinger Combo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Spicy Zinger Combo Meal</h3>
              <p className="text-xs text-gray-500">Regular, includes fries & drink</p>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Item price</span>
              <span className="font-medium text-gray-900">28.00 QAR</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Exclusive Discount</span>
              <span className="font-medium text-[#3D9970]">- 5.00 QAR</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Delivery fee</span>
              <span className="font-bold text-[#3D9970]">FREE</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Service fee</span>
              <span className="font-medium text-gray-900">1.50 QAR</span>
            </div>
            <div className="border-t border-gray-100 pt-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total via Talabat</p>
                  <p className="text-2xl font-extrabold text-gray-900">24.50 QAR</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Est. Arrival</p>
                  <p className="text-sm font-bold text-gray-900">18-24 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Yakfik Recommends */}
        <div className="mt-5 rounded-xl bg-[#3D9970]/5 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3D9970]/10 text-[#3D9970]">
              <HelpCircle size={14} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Why Yakfik recommends this</h3>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              "Lowest total price available across all apps",
              "Free delivery promotion active for your location",
              "Extra 15% discount applied automatically",
              "Highly rated restaurant for this specific item",
            ].map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-xs text-gray-600">
                <Check size={14} className="mt-0.5 flex-shrink-0 text-[#3D9970]" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-5 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D9970] py-4 text-sm font-bold text-white transition hover:bg-[#2E7D5A]">
            Continue to order
            <ArrowRight size={16} />
          </button>
          <Link
            href="/compare"
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Compare other options
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}