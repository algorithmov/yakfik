"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Truck, Clock, Percent, ExternalLink } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const bestDeal = {
  restaurant: "Chick-N-Roll",
  item: "Spicy Zinger Combo Meal",
  price: 24.5,
  originalPrice: 28.0,
  rating: 4.8,
  delivery: "Free Delivery",
  time: "18-24 min",
  discount: "20% OFF",
  platform: "Talabat",
  platformColor: "bg-orange-500",
  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
};

const otherPlatforms = [
  {
    restaurant: "The Burger Lab",
    platform: "SNOONU",
    platformColor: "bg-purple-500",
    price: 28.0,
    originalPrice: 32.0,
    rating: 4.5,
    deliveryFee: 5.0,
    time: "30m",
    save: 4.0,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop",
  },
  {
    restaurant: "Firehouse Burgers",
    platform: "KEETA",
    platformColor: "bg-green-500",
    price: 29.5,
    originalPrice: 35.0,
    rating: 4.2,
    deliveryFee: 3.0,
    time: "25m",
    save: 5.5,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100&h=100&fit=crop",
  },
  {
    restaurant: "Spice Route Burger",
    platform: "RAFEEQ",
    platformColor: "bg-blue-500",
    price: 30.0,
    originalPrice: 30.0,
    rating: 4.9,
    deliveryFee: 0,
    time: "40m",
    save: 0,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=100&h=100&fit=crop",
  },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Best matches</h1>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#3D9970]/5 px-4 py-2.5">
          <span className="text-[#3D9970]">✨</span>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Spicy chicken burger + fries + drink</span>
          </p>
          <span className="ml-auto text-xs text-gray-500">Budget: Under 30 QAR</span>
          <ExternalLink size={14} className="text-gray-400" />
        </div>
      </header>

      {/* Best Deal */}
      <section className="px-5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Best Deal</h2>
          <span className="rounded-full bg-[#3D9970]/10 px-3 py-1 text-xs font-bold text-[#3D9970]">
            RECOMMENDED
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <Image
              src={bestDeal.image}
              alt={bestDeal.item}
              width={400}
              height={220}
              className="h-48 w-full object-cover"
            />
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-900 backdrop-blur">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              {bestDeal.rating}
            </div>
            <div className="absolute bottom-3 right-3 rounded-full bg-[#3D9970] px-3 py-1 text-xs font-bold text-white">
              BEST VALUE
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">{bestDeal.restaurant}</h3>
                <p className="text-sm text-gray-500">{bestDeal.item}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-gray-900">{bestDeal.price} <span className="text-sm font-normal">QAR</span></p>
                <p className="text-xs text-gray-400 line-through">{bestDeal.originalPrice} QAR</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Truck size={13} className="text-gray-400" />
                {bestDeal.delivery}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-gray-400" />
                {bestDeal.time}
              </span>
              <span className="flex items-center gap-1 font-semibold text-orange-500">
                <Percent size={13} />
                {bestDeal.discount}
              </span>
            </div>
            <Link
              href="/order"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#3D9970] py-3 text-sm font-semibold text-white transition hover:bg-[#2E7D5A]"
            >
              Order on {bestDeal.platform}
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Other Platforms */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-bold text-gray-900">Other platforms</h2>
        <div className="space-y-3">
          {otherPlatforms.map((platform) => (
            <div
              key={platform.restaurant}
              className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:shadow-sm"
            >
              <Image
                src={platform.image}
                alt={platform.restaurant}
                width={60}
                height={60}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{platform.restaurant}</h4>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${platform.platformColor}`}>
                    {platform.platform}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-gray-500">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    {platform.rating}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <Truck size={11} />
                    {platform.deliveryFee === 0 ? "Free" : `${platform.deliveryFee} QAR`}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={11} />
                    {platform.time}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-gray-900">{platform.price.toFixed(2)}<span className="text-xs font-normal">QAR</span></p>
                {platform.save > 0 && (
                  <p className="text-[10px] font-semibold text-[#3D9970]">SAVE {platform.save.toFixed(2)} QAR</p>
                )}
                {platform.save === 0 && platform.rating >= 4.9 && (
                  <p className="text-[10px] font-semibold text-yellow-500">Best rated overall</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare Button */}
      <section className="px-5 pt-4">
        <Link
          href="/compare"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#3D9970]/20 py-3 text-sm font-semibold text-[#3D9970] transition hover:bg-[#3D9970]/5"
        >
          Compare all options side by side
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}