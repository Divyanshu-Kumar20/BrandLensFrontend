import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGate from './components/RoleGate';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Knowledge from './pages/Knowledge';
import NewContent from './pages/NewContent';
import ReviewContent from './pages/ReviewContent';
import Insights from './pages/Insights';
import HealthCheck from './pages/HealthCheck';
import NotAllowed from './pages/NotAllowed';
import { ROLES } from './utils/constants';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/health" element={<HealthCheck />} />
      <Route path="/not-allowed" element={<NotAllowed />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            <Knowledge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/:id"
        element={
          <ProtectedRoute>
            <ReviewContent />
          </ProtectedRoute>
        }
      />

      {/* Role-gated protected routes */}
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <RoleGate allowedRoles={[ROLES.CREATOR, ROLES.ADMIN]}>
              <NewContent />
            </RoleGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <RoleGate allowedRoles={[ROLES.CREATOR, ROLES.REVIEWER, ROLES.MANAGER, ROLES.ADMIN]}>
              <Insights />
            </RoleGate>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
