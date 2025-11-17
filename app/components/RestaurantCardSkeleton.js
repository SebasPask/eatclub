'use client';

export default function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4 animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 w-full bg-gray-300">
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3 bg-gray-400 rounded-md w-24 h-16"></div>
      </div>

      {/* Restaurant info skeleton */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          {/* Restaurant name skeleton */}
          <div className="h-6 bg-gray-300 rounded w-2/3"></div>
          {/* Heart icon skeleton */}
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>

        {/* Distance/location skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

        {/* Cuisines skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Service options skeleton */}
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
