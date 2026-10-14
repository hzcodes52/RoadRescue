import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/lib/toast';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RequestService from '@/pages/RequestService';
import TrackRequest from '@/pages/TrackRequest';
import CustomerDashboard from '@/pages/CustomerDashboard';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Contact from '@/pages/Contact';
import MechanicLogin from '@/pages/MechanicLogin';
import MechanicRegister from '@/pages/MechanicRegister';
import MechanicDashboard from '@/pages/MechanicDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/track" element={<TrackRequest />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/mechanic/login" element={<MechanicLogin />} />
              <Route path="/mechanic/register" element={<MechanicRegister />} />
              <Route path="/mechanic/dashboard" element={<ProtectedRoute mechanicOnly><MechanicDashboard /></ProtectedRoute>} />
              <Route path="/request" element={
                <ProtectedRoute><RequestService /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><CustomerDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
