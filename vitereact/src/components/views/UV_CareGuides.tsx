import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { careGuideSchema } from '@/db/schemas';
import { CareGuide } from '@/db/zodschemas';
import { Link } from 'react-router-dom';

const fetchCareGuides = async (): Promise<CareGuide[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/care-guides`
  );
  return response.data.map((guide: any) => careGuideSchema.parse({
    guide_id: guide.guide_id,
    plant_family: guide.plant_family,
    content: guide.content,
  }));
};

const UV_CareGuides: React.FC = () => {
  const [careGuides, setCareGuides] = useState<CareGuide[]>([]);

  const { data, isLoading, error } = useQuery(['careGuides'], fetchCareGuides, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      setCareGuides(data);
    }
  }, [data]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">Care Guides</h1>
          <p className="text-lg text-gray-600 mt-4">
            Discover professional and community-contributed guides for plant care.
            Browse through categories like indoor and outdoor plants, and find seasonal tips to enhance your gardening skills.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center mt-8">
              <p>Error loading care guides. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {careGuides.map((guide) => (
                <div key={guide.guide_id} className="p-6 bg-white shadow-lg rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {guide.plant_family || 'General Care Guide'}
                  </h2>
                  <p className="text-gray-700 mt-2">
                    {guide.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/guides/${guide.guide_id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_CareGuides;