import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { fetchUnreadCount } from '@/store/slices/notificationsSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Leads from '@/pages/Leads';
import Contacts from '@/pages/Contacts';
import Companies from '@/pages/Companies';
import Deals from '@/pages/Deals';
import Tasks from '@/pages/Tasks';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';

export default function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      // Poll for unread count every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login data-icod-id="src_app_tsx_1762" />} />
        <Route path="/register" element={<Register data-icod-id="src_app_tsx_bbca" />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_b35d">
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_f731">
              <AppLayout data-icod-id="src_app_tsx_6fb4"><Dashboard data-icod-id="src_app_tsx_c709" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/leads"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_294f">
              <AppLayout data-icod-id="src_app_tsx_67e2"><Leads data-icod-id="src_app_tsx_35a2" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/contacts"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_e405">
              <AppLayout data-icod-id="src_app_tsx_bb10"><Contacts data-icod-id="src_app_tsx_e5dc" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/companies"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_e6f4">
              <AppLayout data-icod-id="src_app_tsx_408b"><Companies data-icod-id="src_app_tsx_a453" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/deals"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_c2ac">
              <AppLayout data-icod-id="src_app_tsx_4af6"><Deals data-icod-id="src_app_tsx_abd0" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tasks"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_e739">
              <AppLayout data-icod-id="src_app_tsx_f8fd"><Tasks data-icod-id="src_app_tsx_4a12" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_2ec9">
              <AppLayout data-icod-id="src_app_tsx_3180"><Reports data-icod-id="src_app_tsx_24f5" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_5c5d">
              <AppLayout data-icod-id="src_app_tsx_9b10"><Notifications data-icod-id="src_app_tsx_4df0" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute data-icod-id="src_app_tsx_e141">
              <AppLayout data-icod-id="src_app_tsx_edad"><Settings data-icod-id="src_app_tsx_8371" /></AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
