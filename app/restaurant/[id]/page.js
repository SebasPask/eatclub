'use client';

import { useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from '../../store/restaurantsSlice';
import { ArrowLeft, BookOpen, Phone, MapPin, Heart, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import DealCard from '../../components/DealCard';

export default function RestaurantDetail({ params }) {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);

  // Unwrap the params Promise
  const unwrappedParams = use(params);
  const restaurantId = unwrappedParams.id;

  useEffect(() => {
    // Fetch restaurants if not already loaded
    if (restaurants.length === 0) {
      dispatch(fetchRestaurants());
    }
  }, [dispatch, restaurants.length]);

  // Find the specific restaurant from Redux state
  const restaurant = useMemo(() => {
    return restaurants.find(r => r.objectId === restaurantId);
  }, [restaurants, restaurantId]);

  // Sort deals by highest discount
  const sortedDeals = restaurant?.deals ?
    [...restaurant.deals].sort((a, b) => parseInt(b.discount) - parseInt(a.discount))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!loading && !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Restaurant not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="bg-white px-4 py-3 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to restaurants</span>
          </Link>
        </div>

        {/* Image Carousel */}
        <div className="relative">
          <div className="relative h-64 md:h-96 w-full">
          <motion.img
            layoutId={`restaurant-image-${restaurant.objectId}`}
            src={restaurant.imageLink}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />

          {/* New Badge */}
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 font-semibold">
            <Star className="w-4 h-4 fill-white" />
            <span>New</span>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${dot === 0 ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-b border-gray-200">
        <div className="grid grid-cols-4 gap-2 px-4 py-4">
          <button className="flex flex-col items-center gap-2 text-gray-600">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-gray-600">
            <Phone className="w-6 h-6" />
            <span className="text-xs">Call us</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-gray-600">
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Location</span>
          </button>
          <button className="flex flex-col items-center gap-2 text-gray-600 group">
            <Heart className="w-6 h-6 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
            <span className="text-xs">Favourite</span>
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 py-4 mb-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">{restaurant.name}</h1>

        {/* Cuisines */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-gray-600 mb-4">
          {restaurant.cuisines?.map((cuisine, index) => (
            <span key={index} className="flex items-center gap-2 whitespace-nowrap">
              {cuisine}
              {index < restaurant.cuisines.length - 1 && <span>•</span>}
            </span>
          ))}
        </div>

        {/* Hours */}
        <div className="flex items-center gap-3 text-gray-700 mb-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <span>Hours: {restaurant.open} - {restaurant.close}</span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span>{restaurant.address1} {restaurant.suburb} • 1.0km Away</span>
        </div>
      </div>

        {/* Deals Section */}
        <div className="px-4 pb-6">
          {sortedDeals.map((deal) => (
            <DealCard key={deal.objectId} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
}
