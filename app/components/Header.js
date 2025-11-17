'use client';

import { useState } from 'react';
import { User, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileMenu from './ProfileMenu';

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsProfileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <User className="w-6 h-6 text-gray-600" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="EatClub Logo"
              width={100}
              height={48}
              priority
            />
          </Link>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <SlidersHorizontal className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <ProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
      />
    </>
  );
}
