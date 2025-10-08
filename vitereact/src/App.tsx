import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import GV_Notifications from '@/components/views/GV_Notifications.tsx';
import UV_Homepage from '@/components/views/UV_Homepage.tsx';
import UV_PlantDatabase from '@/components/views/UV_PlantDatabase.tsx';
import UV_PlantDetail from '@/components/views/UV_PlantDetail.tsx';
import UV_CareGuides from '@/components/views/UV_CareGuides.tsx';
import UV_Forum from '@/components/views/UV_Forum.tsx';
import UV_PlantSharingMarketplace from '@/components/views/UV_PlantSharingMarketplace.tsx';
import UV_UserDashboard from '@/components/views/UV_UserDashboard.tsx';
import UV_UserProfile from '@/components/views/UV_UserProfile.tsx';

const queryClient = new QueryClient();

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);
  const initializeAuth = useAppStore(state => state.initialize_auth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="App min-h-screen flex flex-col">
          <GV_TopNav />
          <GV_Notifications />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<UV_Homepage />} />
              <Route path="/plants" element={<UV_PlantDatabase />} />
              <Route path="/plants/:plant_id" element={<UV_PlantDetail />} />
              <Route path="/care-guides" element={<UV_CareGuides />} />
              <Route path="/forum" element={<UV_Forum />} />
              <Route path="/marketplace" element={<UV_PlantSharingMarketplace />} />
              <Route path="/auth" element={<UV_Login />} /> {/* Error in provided details, assuming auth is for login/register */}

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UV_UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UV_UserProfile />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <GV_Footer />
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;