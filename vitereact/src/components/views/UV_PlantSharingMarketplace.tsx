import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { PlantMarketplace } from '@/types';
import { plantMarketplaceSchema } from '@/zodschemas';
import { Link } from 'react-router-dom';

const fetchMarketplaceListings = async (): Promise<PlantMarketplace[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/marketplace`);
  return response.data.map((item: any) => ({
    listing_id: item.listing_id,
    user_id: item.user_id,
    plant_id: item.plant_id,
    condition: item.condition,
    desired_trade: item.desired_trade,
    status: item.status,
    created_at: item.created_at,
  }));
};

const UV_PlantSharingMarketplace: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  
  const { data: listings, isError, isLoading } = useQuery<PlantMarketplace[], Error>(
    ['marketplaceListings'],
    fetchMarketplaceListings,
    {
      staleTime: 60000,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Plant Sharing Marketplace</h1>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">Failed to load marketplace listings. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {listings?.length ? (
                listings.map(listing => (
                  <div key={listing.listing_id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{listing.condition}</h2>
                    <p className="text-gray-600">Desired Trade: {listing.desired_trade || 'Any'} </p>
                    <p className="text-gray-600">Status: {listing.status} </p>
                    <div className="mt-4">
                      <Link
                        to={`/plants/${listing.plant_id}`}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        View Plant Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No listings available at the moment.</div>
              )}
            </div>
          )}
          {isAuthenticated && (
            <div className="mt-8">
              <Link
                to="/profile"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Manage Your Trades
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_PlantSharingMarketplace;