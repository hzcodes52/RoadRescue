import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { Shield, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.show('Please fill in all fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.role !== 'ADMIN') {
        await logout();
        throw new Error('This account does not have admin access.');
      }
      toast.show('Admin login successful.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-navy-900 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-navy-200">Restricted access — authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl bg-white p-8 shadow-2xl">
          <div>
            <label className="label-field">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                type="email"
                className="input-field pl-11"
                placeholder="admin@roadrescue.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input
                type="password"
                className="input-field pl-11"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
