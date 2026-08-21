"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Bookmark, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-md lg:max-w-2xl xl:max-w-3xl">
      <div className="border-t border-gray-100 bg-white/95 px-6 pb-safe pt-2 backdrop-blur-md">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 transition-colors ${
                  isActive ? "text-[#3D9970]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-[#3D9970]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}