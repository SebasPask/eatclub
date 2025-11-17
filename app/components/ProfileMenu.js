'use client';

import { ArrowLeft, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProfileMenu({ isOpen, onClose }) {
  const menuItems = [
    { section: 'SETTINGS', items: [
      'Change region',
      'See how EatClub works',
      'Terms of service',
      'Privacy policy',
      'Refer your mates and earn $60',
      'Contact',
      'Feedback'
    ]}
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-[51] bg-white w-full md:w-96 md:max-w-md shadow-xl overflow-y-auto"
          >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200">
        <div className="flex items-center justify-center px-4 py-4 relative">
          <button
            onClick={onClose}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <Image
            src="/logo.svg"
            alt="EatClub Logo"
            width={100}
            height={48}
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">PROFILE</h2>
          <button
            onClick={onClose}
            className="flex items-center gap-4 w-full py-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-lg font-semibold text-gray-900">Sebas Pask</div>
              <div className="text-sm text-gray-500">sebaspask@gmail.com</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings Section */}
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">{section.section}</h2>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={onClose}
                  className="flex items-center justify-between w-full py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <span className="text-base text-gray-700">{item}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <div className="mt-12 mb-8">
          <button
            onClick={onClose}
            className="text-red-500 font-semibold text-lg"
          >
            Sign out
          </button>
        </div>
      </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
