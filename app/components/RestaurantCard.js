'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DealBadge from './DealBadge';

export default function RestaurantCard({ restaurant }) {
  // Get the best deal (highest discount)
  const bestDeal = restaurant.deals?.reduce((best, deal) => {
    const currentDiscount = parseInt(deal.discount);
    const bestDiscount = parseInt(best?.discount || 0);
    return currentDiscount > bestDiscount ? deal : best;
  }, null);

  // Determine deal type and timing
  const getDealText = (deal) => {
    if (!deal) return '';

    const isDineIn = deal.dineIn === 'true';

    let text = '';
    if (isDineIn) text = 'Dine In';

    // Check if deal has specific time
    if (deal.open && deal.close) {
      const timeText = `Arrive before ${deal.close}`;
      return text ? `${text} - ${timeText}` : timeText;
    } else if (deal.start && deal.end) {
      const timeText = `Arrive before ${deal.end}`;
      return text ? `${text} - ${timeText}` : timeText;
    } else {
      return text || 'Anytime today';
    }
  };

  const dealText = getDealText(bestDeal);

  return (
    <Link href={`/restaurant/${restaurant.objectId}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-full">
        {/* Image with deal badge overlay */}
        <div className="relative h-48 w-full">
          <motion.img
            layoutId={`restaurant-image-${restaurant.objectId}`}
            src={restaurant.imageLink}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
          {bestDeal && (
            <div className="absolute top-3 left-3">
              <DealBadge
                discount={bestDeal.discount}
                dealText={dealText}
              />
            </div>
          )}
        </div>

        {/* Restaurant info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors group">
              <Heart className="w-6 h-6 text-gray-400 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            0.5km Away, {restaurant.suburb}
          </p>

          <p className="text-sm text-gray-700 mb-2 font-bold">
            {restaurant.cuisines?.join(', ')}
          </p>

          <div className="flex gap-2 text-sm text-gray-600">
            <span>Dine In</span>
            <span>•</span>
            <span>Takeaway</span>
            <span>•</span>
            <span>Order Online</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
