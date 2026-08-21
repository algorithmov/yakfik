"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react";
import YakFikLogo from "@/components/YakFikLogo";
import BottomNav from "@/components/BottomNav";

const messages = [
  {
    type: "bot",
    content: "Which medicine are you looking for, Chaikh ?",
  },
  {
    type: "user",
    content: "Panadol",
  },
  {
    type: "bot",
    content: "Here are Panadol alternatives and options, Chaikh .",
  },
];

const products = [
  {
    name: "Panorix 500",
    price: 8,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=150&fit=crop",
    variant: "Cold&Flu",
  },
  {
    name: "Panorix 500",
    price: 8,
    image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=200&h=150&fit=crop",
    variant: "Sinus",
  },
];

export default function MedicinePage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <YakFikLogo size={28} />
              <span className="text-base font-bold tracking-tight text-[#3D9970]">
                Yak<span className="text-[#2E7D5A]">Fik</span>
              </span>
            </div>
          </div>
          <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 px-5 pt-6">
        <div className="space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.type === "bot" && (
                <div className="flex-shrink-0">
                  <YakFikLogo size={32} />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.type === "user"
                    ? "bg-[#3D9970] text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-900">Search Results for Panadol</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-28 w-full bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                  <button className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#3D9970] text-white shadow-md transition hover:bg-[#2E7D5A]">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900">QAR {product.price}</p>
                  <p className="text-xs text-gray-500">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-16 px-5 py-3">
        <div className="flex items-center gap-3 rounded-full bg-[#3D9970] px-5 py-3.5 shadow-lg">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/70 outline-none"
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}