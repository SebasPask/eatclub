'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from './store/restaurantsSlice';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
import RestaurantCardSkeleton from './components/RestaurantCardSkeleton';

export default function Home() {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurants);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Filter by search query (name or cuisines)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant => {
        const nameMatch = restaurant.name.toLowerCase().includes(query);
        const cuisineMatch = restaurant.cuisines?.some(cuisine =>
          cuisine.toLowerCase().includes(query)
        );
        return nameMatch || cuisineMatch;
      });
    }

    // Sort by best deals (highest discount first)
    const sorted = [...filtered].sort((a, b) => {
      const getBestDiscount = (restaurant) => {
        if (!restaurant.deals || restaurant.deals.length === 0) return 0;
        return Math.max(...restaurant.deals.map(deal => parseInt(deal.discount) || 0));
      };

      return getBestDiscount(b) - getBestDiscount(a);
    });

    return sorted;
  }, [restaurants, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <SearchBar
          value=""
          onChange={() => {}}
          placeholder="e.g. chinese, pizza"
        />
        <div className="px-4 pb-6">
          {[1, 2, 3, 4].map((i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="e.g. chinese, pizza"
      />

      <div className="px-4 pb-6">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            No restaurants found. Try a different search.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.objectId} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
