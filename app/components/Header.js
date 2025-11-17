'use client';

import { User, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="EatClub Logo"
            width={100}
            height={48}
            priority
          />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <SlidersHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
