import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_ENDPOINT = '/api/local-restaurants';

// Async thunk to fetch restaurants
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { getState }) => {
    // Check if we already have data - don't fetch again
    const { restaurants } = getState().restaurants;
    if (restaurants.length > 0) {
      return restaurants;
    }

    const response = await fetch(API_ENDPOINT, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.restaurants || [];
  }
);

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    restaurants: [],
    loading: false,
    error: null,
    selectedCuisines: [],
    selectedSuburbs: [],
    selectedMinDiscount: 0,
    selectedDiningType: 'Everything',
  },
  reducers: {
    toggleCuisine: (state, action) => {
      const cuisine = action.payload;
      const index = state.selectedCuisines.indexOf(cuisine);
      if (index > -1) {
        state.selectedCuisines.splice(index, 1);
      } else {
        state.selectedCuisines.push(cuisine);
      }
    },
    toggleSuburb: (state, action) => {
      const suburb = action.payload;
      const index = state.selectedSuburbs.indexOf(suburb);
      if (index > -1) {
        state.selectedSuburbs.splice(index, 1);
      } else {
        state.selectedSuburbs.push(suburb);
      }
    },
    setAllCuisines: (state, action) => {
      state.selectedCuisines = action.payload;
    },
    clearAllCuisines: (state) => {
      state.selectedCuisines = [];
    },
    setAllSuburbs: (state, action) => {
      state.selectedSuburbs = action.payload;
    },
    clearAllSuburbs: (state) => {
      state.selectedSuburbs = [];
    },
    setMinDiscount: (state, action) => {
      state.selectedMinDiscount = action.payload;
    },
    setDiningType: (state, action) => {
      state.selectedDiningType = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCuisines = [];
      state.selectedSuburbs = [];
      state.selectedMinDiscount = 0;
      state.selectedDiningType = 'Everything';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;

        // Select all cuisines by default on first load
        if (state.selectedCuisines.length === 0) {
          const cuisineSet = new Set();
          action.payload.forEach(restaurant => {
            restaurant.cuisines?.forEach(cuisine => cuisineSet.add(cuisine));
          });
          state.selectedCuisines = Array.from(cuisineSet);
        }

        // Select all suburbs by default on first load
        if (state.selectedSuburbs.length === 0) {
          const suburbSet = new Set();
          action.payload.forEach(restaurant => {
            if (restaurant.suburb) suburbSet.add(restaurant.suburb);
          });
          state.selectedSuburbs = Array.from(suburbSet);
        }
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  toggleCuisine,
  toggleSuburb,
  setAllCuisines,
  clearAllCuisines,
  setAllSuburbs,
  clearAllSuburbs,
  setMinDiscount,
  setDiningType,
  resetFilters
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
