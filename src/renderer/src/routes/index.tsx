import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { Register } from '../pages/auth/Register';
import { Dashboard } from '../pages/Dashboard';
import { ExamEntry } from '../pages/ExamEntry';
import { ExamInterface } from '../pages/ExamInterface';
import { ExamList } from '../pages/ExamList';
import { ExamSummary } from '../pages/ExamSummary';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam-entry/:examId" element={<ExamEntry />} />
        <Route path="/exam/:examId" element={<ExamInterface />} />
        <Route path="/exams" element={<ExamList />} />
        <Route path="/exam-summary/:examId" element={<ExamSummary />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};