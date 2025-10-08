import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

// Importing Zustand store
import { useAppStore } from '@/store/main';

// Zod schemas
const plantSchema = z.object({
  plant_id: z.string(),
  scientific_name: z.string(),
  common_name: z.string(),
  photos: z.string().nullable(),
});

const UV_PlantDatabase: React.FC = () => {
  const [type, setType] = useState<string | undefined>();
  const [lightRequirement, setLightRequirement] = useState<string | undefined>();
  const [wateringNeeds, setWateringNeeds] = useState<string | undefined>();

  // API Fetching function
  const fetchPlants = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/plants`, {
      params: {
        // params alignment with OpenAPI names
        type,
        light_requirement: lightRequirement,
        watering_needs: wateringNeeds,
      },
    });

    // Data mapping to frontend schema
    return response.data.map((plant: any) => ({
      plant_id: plant.plant_id,
      common_name: plant.common_name,
      scientific_name: plant.scientific_name,
      photos: plant.photos,
    }));
  };

  // Query for fetching plants
  const { data: plants = [], refetch, isError } = useQuery(['plants', type, lightRequirement, wateringNeeds], fetchPlants, {
    select: (data) => {
      // Ensure valid data transformation
      return data.map((item: any) => plantSchema.parse(item));
    },
    staleTime: 60000,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
  });

  const handleFilterChange = () => {
    // Trigger plant fetching on filter change
    refetch();
  };

  useEffect(() => {
    handleFilterChange();
  }, [type, lightRequirement, wateringNeeds]);

  const notificationState = useAppStore((state) => state.notification_state);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Plant Database</h1>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-300"
                value={type}
                onChange={(e) => setType(e.target.value || undefined)}
              >
                <option value="">All Types</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
              
              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-300"
                value={lightRequirement}
                onChange={(e) => setLightRequirement(e.target.value || undefined)}
              >
                <option value="">All Light</option>
                <option value="low_light">Low Light</option>
                <option value="medium_light">Medium Light</option>
                <option value="high_light">High Light</option>
              </select>

              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-300"
                value={wateringNeeds}
                onChange={(e) => setWateringNeeds(e.target.value || undefined)}
              >
                <option value="">All Watering</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {isError && (
            <div className="text-red-600 text-sm">Error fetching plants. Please try again.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant: any) => (
              <div key={plant.plant_id} className="bg-white rounded-lg shadow-md p-6">
                <img
                  src={plant.photos || 'https://via.placeholder.com/150'}
                  alt={`${plant.common_name}`}
                  className="h-40 w-full object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-semibold text-gray-900">{plant.common_name}</h2>
                <p className="text-gray-600 italic">{plant.scientific_name}</p>
                <Link to={`/plants/${plant.plant_id}`} className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                  View More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_PlantDatabase;