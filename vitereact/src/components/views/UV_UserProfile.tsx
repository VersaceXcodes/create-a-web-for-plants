import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';
import axios from 'axios';
import { Link } from 'react-router-dom';

const fetchUserProfile = async (userId: string) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${userId}`);
  return data;
};

const UV_UserProfile: React.FC = () => {
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const logoutUser = useAppStore(state => state.logout_user);

  const { isLoading, data: userProfile, error } = useQuery(
    ['userProfile', currentUser?.id],
    () => fetchUserProfile(currentUser!.id),
    { enabled: !!currentUser }
  );

  useEffect(() => {
    if (!currentUser) {
      logoutUser();
    }
  }, [currentUser, logoutUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading profile. Please try again.</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={logoutUser}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome, {userProfile.name}!
                </h2>
                <p className="text-gray-600 mb-4">
                  Manage your profile and view your activity below.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    <strong>Member Since:</strong> {(new Date(userProfile.created_at)).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to="/forum"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View your forum posts
                  </Link>
                  <br />
                  <Link
                    to="/marketplace"
                    className="text-blue-600 hover:text-blue-800 mt-4"
                  >
                    View your marketplace activities
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UV_UserProfile;