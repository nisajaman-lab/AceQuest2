import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useGameStore } from './store/useGameStore';
import { initializeAudioSystem, playMusic, stopMusic } from './lib/audio';

import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubjectMapPage from './pages/SubjectMapPage';
import ChapterMapPage from './pages/ChapterMapPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useGameStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useGameStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return user?.role_id === 3 ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const { fetchMe, token } = useGameStore();
  const location = useLocation();

  useEffect(() => {
    initializeAudioSystem();
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/login' || path === '/register') {
      playMusic('title', { volume: 0.25 });
    } else if (path.startsWith('/dashboard') || path.startsWith('/subject-map') || path.startsWith('/chapter-map') || path.startsWith('/profile') || path.startsWith('/leaderboard') || path.startsWith('/admin')) {
      playMusic('academyHq', { volume: 0.16 });
    } else if (path.startsWith('/game')) {
      stopMusic();
    } else {
      playMusic('title', { volume: 0.25 });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminRegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/subject-map" element={
            <ProtectedRoute>
              <SubjectMapPage />
            </ProtectedRoute>
          } />
          <Route path="/chapter-map/:subjectId" element={
            <ProtectedRoute>
              <ChapterMapPage />
            </ProtectedRoute>
          } />
          <Route path="/game/:chapterId" element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboardPage view="overview" />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminDashboardPage view="users" />
            </AdminRoute>
          } />
          <Route path="/admin/questions" element={
            <AdminRoute>
              <AdminDashboardPage view="questions" />
            </AdminRoute>
          } />
          <Route path="/admin/subjects" element={
            <AdminRoute>
              <AdminDashboardPage view="subjects" />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <AdminDashboardPage view="analytics" />
            </AdminRoute>
          } />
          <Route path="/admin/badges" element={
            <AdminRoute>
              <AdminDashboardPage view="badges" />
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
