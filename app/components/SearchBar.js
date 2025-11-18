'use client';

import { Search } from 'lucide-react';
import FilterChips from './FilterChips';

export default function SearchBar({ value, onChange, placeholder = "e.g. chinese, pizza" }) {
  return (
    <div>
      <div className="relative px-4 py-3">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>
      <FilterChips />
    </div>
  );
}
