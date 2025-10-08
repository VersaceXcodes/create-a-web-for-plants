import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';
import { userFavoriteSchema, tradeRequestSchema } from '@/db/zodschemas';

const UV_UserDashboard: React.FC = () => {
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  // Fetch user's favorite plants
  const { data: favoritePlants, error: favoritesError, isLoading: favoritesLoading } = useQuery(['userFavorites', currentUser?.id], async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${currentUser?.id}/favorites`);
    return userFavoriteSchema.array().parse(response.data);
  }, {
    enabled: !!currentUser,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Fetch user's trade requests
  const { data: tradeRequests, error: tradeRequestsError, isLoading: tradeRequestsLoading } = useQuery(['userTradeRequests', currentUser?.id], async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${currentUser?.id}/trade-requests`);
    return tradeRequestSchema.array().parse(response.data);
  }, {
    enabled: !!currentUser,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Your Dashboard</h2>
          
          {favoritesLoading && <p>Loading favorite plants...</p>}
          {favoritesError && <p className="text-red-600">Error loading favorites: {favoritesError.message}</p>}
          {!favoritesLoading && !favoritesError && favoritePlants && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Favorite Plants</h3>
              <ul className="space-y-2">
                {favoritePlants.map(fav => (
                  <li key={fav.favorite_id} className="bg-white p-4 rounded-lg shadow-lg">
                    <Link to={`/plants/${fav.plant_id}`} className="text-blue-600 hover:underline">{fav.plant_id}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tradeRequestsLoading && <p>Loading trade requests...</p>}
          {tradeRequestsError && <p className="text-red-600">Error loading trade requests: {tradeRequestsError.message}</p>}
          {!tradeRequestsLoading && !tradeRequestsError && tradeRequests && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trade Requests</h3>
              <ul className="space-y-2">
                {tradeRequests.map(trade => (
                  <li key={trade.request_id} className="bg-white p-4 rounded-lg shadow-lg">
                    <p>Listing ID: {trade.listing_id}</p>
                    <p>Status: {trade.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link to="/marketplace" className="text-blue-600 hover:underline">Manage your trade requests</Link>
        </div>
      </div>
    </>
  );
};

export default UV_UserDashboard;