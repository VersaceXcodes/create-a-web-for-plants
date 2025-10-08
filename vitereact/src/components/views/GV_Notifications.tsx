import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: string;
  reference: string | null;
  date: string;
}

const fetchNotifications = async (userId: string | null, token: string | null) => {
  if (!userId || !token) return [];
  
  const response = await axios.get<Notification[]>(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${userId}/notifications`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

const GV_Notifications: React.FC = () => {
  const userId = useAppStore(state => state.authentication_state.current_user?.id);
  const authToken = useAppStore(state => state.authentication_state.auth_token);

  const { data: notifications = [], isLoading, isError } = useQuery(
    ['notifications', userId],
    () => fetchNotifications(userId, authToken),
    { 
      enabled: !!userId && !!authToken, // only fetch if user is authenticated
      staleTime: 60000, 
      refetchOnWindowFocus: false 
    }
  );

  return (
    <>
      <div className="relative">
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl px-4 py-6">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          {isLoading ? (
            <div className="flex items-center justify-center mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="text-red-500 text-sm text-center mt-4">
              Failed to load notifications. Please try again.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 mt-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{notification.type}</span>
                    <span className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</span>
                  </div>
                  {notification.reference && (
                    <Link
                      to={`/details/${notification.reference}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default GV_Notifications;