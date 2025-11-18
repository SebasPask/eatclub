'use client';

import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleCuisine,
  setMinDiscount,
  setDiningType,
  clearAllCuisines,
} from '../store/restaurantsSlice';

export default function FilterChips() {
  const dispatch = useDispatch();
  const { selectedCuisines, selectedMinDiscount, selectedDiningType } = useSelector(
    (state) => state.restaurants
  );

  // Get all unique cuisines to compare against selected
  const { restaurants } = useSelector((state) => state.restaurants);
  const allCuisines = Array.from(
    new Set(restaurants.flatMap((r) => r.cuisines || []))
  ).sort();

  const hasActiveFilters =
    selectedCuisines.length < allCuisines.length ||
    selectedMinDiscount > 0 ||
    selectedDiningType !== 'Everything';

  if (!hasActiveFilters) {
    return null;
  }

  const handleRemoveCuisine = (cuisine) => {
    dispatch(toggleCuisine(cuisine));
  };

  const handleClearAllCuisines = () => {
    dispatch(clearAllCuisines());
  };

  const handleRemoveDiscount = () => {
    dispatch(setMinDiscount(0));
  };

  const handleRemoveDiningType = () => {
    dispatch(setDiningType('Everything'));
  };

  // Format cuisine chips
  const getCuisineChips = () => {
    if (selectedCuisines.length === allCuisines.length) return [];

    const MAX_DISPLAY = 3;
    const displayedCuisines = selectedCuisines.slice(0, MAX_DISPLAY);
    const remainingCount = selectedCuisines.length - MAX_DISPLAY;

    const chips = displayedCuisines.map((cuisine) => ({
      label: cuisine,
      onRemove: () => handleRemoveCuisine(cuisine),
    }));

    if (remainingCount > 0) {
      chips.push({
        label: `+${remainingCount} cuisine${remainingCount > 1 ? 's' : ''}`,
        onRemove: handleClearAllCuisines,
      });
    }

    return chips;
  };

  const chips = [
    ...getCuisineChips(),
    selectedMinDiscount > 0 && {
      label: `Above ${selectedMinDiscount}%`,
      onRemove: handleRemoveDiscount,
    },
    selectedDiningType !== 'Everything' && {
      label: selectedDiningType,
      onRemove: handleRemoveDiningType,
    },
  ].filter(Boolean);

  return (
    <div className="px-4 pb-2">
      <div className="max-w-2xl mx-auto flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-900 transition-colors"
          >
            <span>{chip.label}</span>
            <button
              onClick={chip.onRemove}
              className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
