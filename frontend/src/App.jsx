import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HomeFeedPage } from './pages/HomeFeedPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Helpers
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

const WorkerRoute = ({ children }) => {
  const { isAuthenticated, isWorker, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || (!isWorker && !isAdmin)) return <Navigate to="/login" replace />;
  return children;
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="feed" element={<HomeFeedPage />} />
                <Route path="report" element={<ReportIssuePage />} />
                <Route path="issues/:id" element={<IssueDetailPage />} />
                <Route path="my-issues" element={<UserDashboardPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Admin Portals */}
                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="admin/analytics"
                  element={
                    <AdminRoute>
                      <AdminAnalyticsPage />
                    </AdminRoute>
                  }
                />

                {/* Worker Portal */}
                <Route
                  path="worker"
                  element={
                    <WorkerRoute>
                      <WorkerDashboardPage />
                    </WorkerRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
