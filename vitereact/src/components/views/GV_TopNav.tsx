import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

const GV_TopNav: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const logoutUser = useAppStore(state => state.logout_user);
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${useAppStore(state => state.authentication_state.auth_token)}`
        }
      });
      logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl text-blue-600 font-bold hover:text-blue-700">
              PlantConnect
            </Link>
            <Link to="/plants" className="text-gray-600 hover:text-gray-900 transition duration-150">Plant Database</Link>
            <Link to="/care-guides" className="text-gray-600 hover:text-gray-900 transition duration-150">Care Guides</Link>
            <Link to="/forum" className="text-gray-600 hover:text-gray-900 transition duration-150">Community Forums</Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 transition duration-150">Marketplace</Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {currentUser?.name}</span>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition duration-150">Profile</Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition duration-150">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition duration-150">Logout</button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-blue-600 hover:text-blue-700 transition duration-150">Login</Link>
                <Link to="/auth" className="text-blue-600 hover:text-blue-700 transition duration-150">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;