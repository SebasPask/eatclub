'use client';

import { useState, useEffect } from 'react';

const API_ENDPOINT = '/api/local-restaurants';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);

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
        setRestaurants(data.restaurants || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}
