import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Plant } from '@/zodschemas';

const fetchPlantDetails = async (plant_id: string) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/plants/${plant_id}`);
  return response.data;
};

const UV_PlantDetail: React.FC = () => {
  const { plant_id } = useParams<{ plant_id: string }>();
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  const { data: plant_info, error, isLoading } = useQuery<Plant, Error>(
    ['plant_details', plant_id],
    () => fetchPlantDetails(plant_id ?? ""),
    { enabled: !!plant_id }
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-600 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">Error loading plant details.</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="flex-shrink-0">
            {plant_info?.photos && <img src={plant_info.photos} alt={plant_info.common_name || plant_info.scientific_name} className="w-full h-64 object-cover rounded-xl shadow-md" />}
          </div>
          <div className="mt-4 lg:mt-0 lg:flex-grow">
            <h1 className="text-3xl font-bold text-gray-900">{plant_info?.common_name || 'Unknown Plant'}</h1>
            <h2 className="text-xl text-gray-700 italic">{plant_info?.scientific_name}</h2>
            <p className="mt-4 text-base text-gray-600">{plant_info?.description}</p>
            <h3 className="mt-6 text-2xl font-semibold text-gray-900">Care Guidelines</h3>
            <p className="mt-2 text-base text-gray-600">{plant_info?.care_guidelines}</p>
            <div className="mt-6 space-y-2">
              <p className="text-sm"><strong>Type:</strong> {plant_info?.type}</p>
              <p className="text-sm"><strong>Light Requirement:</strong> {plant_info?.light_requirement}</p>
              <p className="text-sm"><strong>Watering Needs:</strong> {plant_info?.watering_needs}</p>
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-gray-900">User Reviews</h3>
            <p className="mt-2 text-base text-gray-600">{plant_info?.user_reviews || "No reviews yet. Be the first to review this plant."}</p>
            {isAuthenticated && (
              <button
                className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
              >
                Add to Favorites
              </button>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Link to="/plants" className="text-blue-600 hover:text-blue-700">Back to Plant Database</Link>
        </div>
      </div>
    </>
  );
};

export default UV_PlantDetail;