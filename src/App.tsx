import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Orders } from '@/pages/Orders';
import { Products } from '@/pages/Products';
import { Customers } from '@/pages/Customers';
import { WhatsAppDemo } from '@/pages/WhatsAppDemo';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { useAppStore } from '@/hooks/useStore';
import { getSession, onAuthStateChange } from '@/lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, logout } = useAppStore();

  useEffect(() => {
    // Verify session on mount — if Zustand says authenticated but no Supabase session, force logout
    getSession().then((session) => {
      if (!session && isAuthenticated) {
        logout();
      }
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });

    // Listen for auth state changes (token refresh, sign out from another tab)
    const { data: { subscription } } = onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="whatsapp" element={<WhatsAppDemo />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
