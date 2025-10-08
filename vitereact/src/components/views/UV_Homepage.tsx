import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { Plant, ForumPost, CareGuide } from '@/DB/zodschemas';

// Fetch featured plants
const fetchFeaturedPlants = async (): Promise<Plant[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/plants`, {
    params: { limit: 10, sort_by: 'common_name' }
  });
  return data?.map((plant: any) => ({
    plant_id: plant.plant_id,
    common_name: plant.common_name,
    scientific_name: plant.scientific_name,
    photos: plant.photos
  }));
};

// Fetch recent forum discussions
const fetchRecentForumDiscussions = async (): Promise<ForumPost[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/forum`);
  return data?.map((post: any) => ({
    post_id: post.post_id,
    topic: post.topic,
    created_at: post.created_at
  }));
};

// Fetch care guide highlights
const fetchCareGuideHighlights = async (): Promise<CareGuide[]> => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/care-guides`);
  return data?.map((guide: any) => ({
    guide_id: guide.guide_id,
    plant_family: guide.plant_family,
    content: guide.content
  }));
};

const UV_Homepage: React.FC = () => {
  const { isLoading: isAuthLoading, authentication_state } = useAppStore(state => ({
    isLoading: state.authentication_state.authentication_status.is_loading,
    authentication_state: state.authentication_state,
  }));

  const { data: featuredPlants, isLoading: isPlantsLoading } = useQuery('featuredPlants', fetchFeaturedPlants);
  const { data: recentDiscussions, isLoading: isForumLoading } = useQuery('recentDiscussions', fetchRecentForumDiscussions);
  const { data: careGuides, isLoading: isGuidesLoading } = useQuery('careGuides', fetchCareGuideHighlights);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mt-12 mb-8">Welcome to PlantConnect</h1>
          {/* Search Bar */}
          <div className="mb-12">
            <input 
              type="text" 
              placeholder="Search for a plant..." 
              className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {/* Featured Plants Section */}
          <section className="my-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Plants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPlantsLoading ? (
                <div className="col-span-full text-center">Loading featured plants...</div>
              ) : (
                featuredPlants?.map((plant) => (
                  <div key={plant.plant_id} className="bg-white shadow-lg rounded-xl p-6">
                    <img src={plant.photos || 'default-placeholder.jpg'} alt={plant.common_name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">{plant.common_name}</h3>
                    <p className="text-sm text-gray-600 italic">{plant.scientific_name}</p>
                    <Link to={`/plants/${plant.plant_id}`} className="text-blue-600 hover:text-blue-800">View Details</Link>
                  </div>
                ))
              )}
            </div>
          </section>
          {/* Recent Forum Discussions Section */}
          <section className="my-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Forum Discussions</h2>
            {isForumLoading ? (
              <div className="text-center">Loading discussions...</div>
            ) : (
              <ul className="list-disc pl-6">
                {recentDiscussions?.map((post) => (
                  <li key={post.post_id}>
                    <Link to={`/forum`} className="text-blue-600 hover:text-blue-800">{post.topic}</Link>
                    <span className="text-gray-600 text-sm"> - {new Date(post.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Care Guide Highlights Section */}
          <section className="my-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Care Guide Highlights</h2>
            {isGuidesLoading ? (
              <div className="text-center">Loading care guides...</div>
            ) : (
              <div className="space-y-4">
                {careGuides?.map((guide) => (
                  <div key={guide.guide_id} className="bg-white shadow-lg rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.plant_family || 'General Care'}</h3>
                    <p className="text-gray-700">{guide.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default UV_Homepage;