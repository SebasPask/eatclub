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
  },
  reducers: {
    // You can add synchronous actions here if needed
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
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default restaurantsSlice.reducer;
