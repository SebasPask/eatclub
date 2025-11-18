'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from './store/restaurantsSlice';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
import RestaurantCardSkeleton from './components/RestaurantCardSkeleton';
import FilterMenu from './components/FilterMenu';

export default function Home() {
  const dispatch = useDispatch();
  const { restaurants, loading, error, selectedCuisines, selectedSuburbs, selectedMinDiscount, selectedDiningType } = useSelector((state) => state.restaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  /**
   * Filter and sort restaurants based on multiple criteria
   * Filters are applied sequentially: search query → cuisines → suburbs → discount → dining type
   * Finally sorts by best deal (highest discount first)
   * Memoized to prevent unnecessary recalculations
   */
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Filter by search query (searches both restaurant name and cuisines)
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

    // Filter by selected cuisines
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisines?.some(cuisine => selectedCuisines.includes(cuisine))
      );
    }

    // Filter by selected suburbs
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

    // Sort by best deals (highest discount first)
    const sorted = [...filtered].sort((a, b) => {
      const getBestDiscount = (restaurant) => {
        if (!restaurant.deals || restaurant.deals.length === 0) return 0;
        return Math.max(...restaurant.deals.map(deal => parseInt(deal.discount) || 0));
      };

      return getBestDiscount(b) - getBestDiscount(a);
    });

    return sorted;
  }, [restaurants, searchQuery, selectedCuisines, selectedSuburbs, selectedMinDiscount, selectedDiningType]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
        />
        <div className={`transition-all duration-300 ${isFilterMenuOpen ? 'md:pr-[420px] md:pl-4' : 'max-w-7xl mx-auto'}`}>
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="e.g. chinese, pizza"
          />
          <div className="px-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
        <FilterMenu
          isOpen={isFilterMenuOpen}
          onClose={() => setIsFilterMenuOpen(false)}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
        />
        <div className={`transition-all duration-300 ${isFilterMenuOpen ? 'md:pr-[420px] md:pl-4' : 'max-w-7xl mx-auto'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">Error: {error}</div>
          </div>
        </div>
        <FilterMenu
          isOpen={isFilterMenuOpen}
          onClose={() => setIsFilterMenuOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        isFilterMenuOpen={isFilterMenuOpen}
        setIsFilterMenuOpen={setIsFilterMenuOpen}
      />
      <div className={`transition-all duration-300 ${isFilterMenuOpen ? 'md:pr-[420px] md:pl-4' : 'max-w-7xl mx-auto'}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.objectId} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
      <FilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setIsFilterMenuOpen(false)}
      />
    </div>
  );
}
