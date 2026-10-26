import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HealthCheck from './pages/HealthCheck';
import Login from './pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HealthCheck />} />
      <Route path="/health" element={<HealthCheck />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
