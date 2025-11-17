'use client';

import { Zap } from 'lucide-react';

export default function DealCard({ deal }) {
  const isLightning = deal.lightning === 'true';
  const discount = parseInt(deal.discount);

  // Get time range for the deal
  const getTimeRange = () => {
    if (deal.open && deal.close) {
      return `Between ${deal.open} - ${deal.close}`;
    } else if (deal.start && deal.end) {
      return `Between ${deal.start} - ${deal.end}`;
    }
    return 'Anytime today';
  };

  const timeRange = getTimeRange();
  const dealsLeft = parseInt(deal.qtyLeft);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isLightning && <Zap className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            <span className="text-2xl font-bold text-red-500">{discount}% Off</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{timeRange}</p>
          <p className="text-xs text-gray-500">{dealsLeft} Deals Left</p>
        </div>
        <button className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-full font-semibold hover:bg-red-50 transition-colors">
          Redeem
        </button>
      </div>
    </div>
  );
}
