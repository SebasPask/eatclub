'use client';

import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleCuisine,
  toggleSuburb,
  setAllCuisines,
  clearAllCuisines,
  setAllSuburbs,
  clearAllSuburbs,
  setMinDiscount,
  setDiningType,
  resetFilters
} from '../store/restaurantsSlice';
import { X, Utensils, Coffee, ShoppingBag, Wine, Star, Infinity, Sun, MapPin, UtensilsCrossed, Beer, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterMenu({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('General');
  const [liveNow, setLiveNow] = useState(false);
  const tabs = ['General', 'Discount', 'Cuisine', 'Suburbs'];
  const dispatch = useDispatch();

  // Get restaurants and filter state from Redux
  const { restaurants, selectedCuisines, selectedSuburbs, selectedMinDiscount, selectedDiningType } = useSelector((state) => state.restaurants);

  // Extract unique cuisines from restaurants
  const cuisines = useMemo(() => {
    const cuisineSet = new Set();
    restaurants.forEach(restaurant => {
      restaurant.cuisines?.forEach(cuisine => cuisineSet.add(cuisine));
    });
    return Array.from(cuisineSet).sort();
  }, [restaurants]);

  // Extract unique suburbs from restaurants
  const suburbs = useMemo(() => {
    const suburbSet = new Set();
    restaurants.forEach(restaurant => {
      if (restaurant.suburb) suburbSet.add(restaurant.suburb);
    });
    return Array.from(suburbSet).sort();
  }, [restaurants]);

  // Calculate filtered restaurant count
  const filteredCount = useMemo(() => {
    let filtered = restaurants;

    // Filter by cuisines
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisines?.some(cuisine => selectedCuisines.includes(cuisine))
      );
    }

    // Filter by suburbs
    if (selectedSuburbs.length > 0) {
      filtered = filtered.filter(restaurant =>
        selectedSuburbs.includes(restaurant.suburb)
      );
    }

    // Filter by minimum discount
    if (selectedMinDiscount > 0) {
      filtered = filtered.filter(restaurant => {
        const bestDiscount = Math.max(...(restaurant.deals?.map(deal => parseInt(deal.discount) || 0) || [0]));
        return bestDiscount >= selectedMinDiscount;
      });
    }

    // Filter by dining type
    if (selectedDiningType !== 'Everything') {
      if (selectedDiningType === 'Dine-in') {
        filtered = filtered.filter(restaurant =>
          restaurant.deals?.some(deal => deal.dineIn === 'true')
        );
      } else if (selectedDiningType === 'Takeaway') {
        filtered = filtered.filter(restaurant =>
          restaurant.deals?.some(deal => deal.dineIn === 'false')
        );
      } else if (selectedDiningType === 'Drinks') {
        filtered = filtered.filter(restaurant =>
          restaurant.cuisines?.some(cuisine =>
            cuisine.toLowerCase().includes('drink') ||
            cuisine.toLowerCase().includes('bar') ||
            cuisine.toLowerCase().includes('beer') ||
            cuisine.toLowerCase().includes('wine')
          )
        );
      } else if (selectedDiningType === 'Venue of the Week') {
        filtered = filtered.filter(restaurant =>
          restaurant.deals?.some(deal => deal.lightning === 'true')
        );
      }
    }

    return filtered.length;
  }, [restaurants, selectedCuisines, selectedSuburbs, selectedMinDiscount, selectedDiningType]);

  // Handle Show All toggle for cuisines
  const handleShowAllCuisines = () => {
    if (selectedCuisines.length === cuisines.length) {
      dispatch(clearAllCuisines());
    } else {
      dispatch(setAllCuisines(cuisines));
    }
  };

  // Handle Show All toggle for suburbs
  const handleShowAllSuburbs = () => {
    if (selectedSuburbs.length === suburbs.length) {
      dispatch(clearAllSuburbs());
    } else {
      dispatch(setAllSuburbs(suburbs));
    }
  };

  // Handle Reset
  const handleReset = () => {
    dispatch(resetFilters());
  };

  const timeSlots = [
    { label: 'All', time: '', icon: Infinity },
    { label: 'Breakfast', time: '6am-11:30am', icon: Sun },
    { label: 'Brunch', time: '9am-12pm', icon: Coffee },
    { label: 'Lunch', time: '11am-4pm', icon: MapPin },
    { label: 'Dinner', time: '5pm-9pm', icon: UtensilsCrossed },
    { label: 'Late Night', time: '8:30pm-12am', icon: Beer }
  ];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop - only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 md:hidden!"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 md:top-[65px] md:bottom-0 right-0 z-51 md:z-40 bg-white w-full md:w-[400px] shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between px-4 py-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-gray-600">Filters</h2>
                <button
                  onClick={handleReset}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {activeTab === 'General' && (
                <div className="space-y-6">
                  {/* Dining Type */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Dining Type</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => dispatch(setDiningType('Everything'))}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          selectedDiningType === 'Everything' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Utensils className="w-6 h-6 text-gray-600" />
                        <span className="text-base text-gray-900">Everything</span>
                      </button>
                      <button
                        onClick={() => dispatch(setDiningType('Dine-in'))}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          selectedDiningType === 'Dine-in' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Coffee className="w-6 h-6 text-gray-600" />
                        <span className="text-base text-gray-900">Dine-in</span>
                      </button>
                      <button
                        onClick={() => dispatch(setDiningType('Takeaway'))}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          selectedDiningType === 'Takeaway' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <ShoppingBag className="w-6 h-6 text-gray-600" />
                        <span className="text-base text-gray-900">Takeaway</span>
                      </button>
                      <button
                        onClick={() => dispatch(setDiningType('Drinks'))}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          selectedDiningType === 'Drinks' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <Wine className="w-6 h-6 text-gray-600" />
                        <span className="text-base text-gray-900">Drinks</span>
                      </button>
                      <button
                        onClick={() => dispatch(setDiningType('Venue of the Week'))}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          selectedDiningType === 'Venue of the Week' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="w-6 h-6 bg-yellow-200 rounded-md flex items-center justify-center">
                          <Star className="w-4 h-4 text-gray-900" />
                        </div>
                        <span className="text-base text-gray-900">Venue of the Week</span>
                      </button>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Time</h3>

                    {/* Live now toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base text-gray-900">Live now</span>
                      <button
                        onClick={() => setLiveNow(!liveNow)}
                        className={`w-14 h-8 rounded-full relative transition-colors ${
                          liveNow ? 'bg-yellow-400' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                          liveNow ? 'right-1' : 'left-1'
                        }`}>
                          {liveNow && <span className="text-xs">✓</span>}
                        </div>
                      </button>
                    </div>

                    {/* Time slots */}
                    <div className="grid grid-cols-3 gap-4">
                      {timeSlots.map((slot) => {
                        const Icon = slot.icon;
                        return (
                          <button
                            key={slot.label}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <Icon className="w-8 h-8 text-gray-600" />
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{slot.label}</div>
                              {slot.time && <div className="text-xs text-gray-500">{slot.time}</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Discount' && (
                <div>
                  <div className="mb-6">
                    <span className="text-gray-500">Showing: </span>
                    <span className="font-semibold text-gray-900">
                      {selectedMinDiscount === 0 ? 'All' : `${selectedMinDiscount}% or more`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">All</span>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedMinDiscount}
                      onChange={(e) => dispatch(setMinDiscount(parseInt(e.target.value)))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer discount-slider"
                    />
                    <span className="text-sm text-gray-500">50%</span>
                  </div>
                </div>
              )}

              {activeTab === 'Cuisine' && (
                <div className="space-y-1">
                  {/* Show All */}
                  <div className="flex items-center justify-between py-4 border-b">
                    <span className="text-base font-medium text-gray-900">Show All</span>
                    <button
                      onClick={handleShowAllCuisines}
                      className={`w-14 h-8 rounded-full relative transition-colors ${
                        selectedCuisines.length === cuisines.length ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                        selectedCuisines.length === cuisines.length ? 'right-1' : 'left-1'
                      }`}>
                        {selectedCuisines.length === cuisines.length && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                  </div>

                  {/* Cuisine list */}
                  {cuisines.map((cuisine) => {
                    const isSelected = selectedCuisines.includes(cuisine);
                    return (
                      <div key={cuisine} className="flex items-center justify-between py-4 border-b">
                        <div className="flex items-center gap-3">
                          <Utensils className="w-5 h-5 text-gray-400" />
                          <span className="text-base text-gray-900">{cuisine}</span>
                        </div>
                        <button
                          onClick={() => dispatch(toggleCuisine(cuisine))}
                          className={`w-14 h-8 rounded-full relative transition-colors ${
                            isSelected ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                            isSelected ? 'right-1' : 'left-1'
                          }`}>
                            {isSelected && <span className="text-xs">✓</span>}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'Suburbs' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Richmond, West Melbourne"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    />
                  </div>

                  {/* Show All */}
                  <div className="flex items-center justify-between py-4 border-b">
                    <span className="text-base font-medium text-gray-900">Show All</span>
                    <button
                      onClick={handleShowAllSuburbs}
                      className={`w-14 h-8 rounded-full relative transition-colors ${
                        selectedSuburbs.length === suburbs.length ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                        selectedSuburbs.length === suburbs.length ? 'right-1' : 'left-1'
                      }`}>
                        {selectedSuburbs.length === suburbs.length && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                  </div>

                  {/* Suburbs list */}
                  {suburbs.map((suburb) => {
                    const isSelected = selectedSuburbs.includes(suburb);
                    return (
                      <div key={suburb} className="flex items-center justify-between py-4 border-b">
                        <span className="text-base text-gray-900">{suburb}</span>
                        <button
                          onClick={() => dispatch(toggleSuburb(suburb))}
                          className={`w-14 h-8 rounded-full relative transition-colors ${
                            isSelected ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transition-all ${
                            isSelected ? 'right-1' : 'left-1'
                          }`}>
                            {isSelected && <span className="text-xs">✓</span>}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={onClose}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 rounded-lg transition-colors"
              >
                View {filteredCount} {filteredCount === 1 ? 'venue' : 'venues'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
