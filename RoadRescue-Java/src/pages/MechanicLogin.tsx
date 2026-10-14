import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { Wrench, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function MechanicLogin() {
  const { login, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.show('Please fill in all fields.', 'error'); return; }
    setLoading(true);
    try {
      const u = await login(email, password);
      if (u.role !== 'MECHANIC') {
        await logout();
        throw new Error('This account is not registered as a mechanic.');
      }
      toast.show('Welcome back!', 'success');
      navigate('/mechanic/dashboard');
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold text-navy-900">Mechanic Login</h1>
          <p className="mt-2 text-navy-500">See and accept roadside jobs in your service area.</p>
        </div>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-8">
          <div>
            <label className="label-field">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input type="email" className="input-field pl-11" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input type="password" className="input-field pl-11" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In'}
          </button>
          <p className="text-center text-sm text-navy-500">
            New mechanic?{' '}
            <Link to="/mechanic/register" className="font-semibold text-accent-500 hover:text-accent-600">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
