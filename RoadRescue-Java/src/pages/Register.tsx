import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { User, Mail, Lock, Phone, Loader2, Wrench } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', contactNumber: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.contactNumber || !form.password) {
      toast.show('Please fill in all required fields.', 'error');
      return;
    }
    if (form.password.length < 6) {
      toast.show('Password must be at least 6 characters.', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.show('Passwords do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        password: form.password,
      });
      if (res.needsConfirmation) {
        toast.show('Account created! Check your email to confirm, then log in.', 'success');
        navigate('/login');
      } else {
        toast.show('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
            <Wrench className="h-7 w-7 text-accent-500" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold text-navy-900">Create Account</h1>
          <p className="mt-2 text-navy-500">Register to request and track roadside assistance.</p>
        </div>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-8">
          <div>
            <label className="label-field">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input name="name" className="input-field pl-11" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="label-field">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input name="email" type="email" className="input-field pl-11" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="label-field">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input name="contactNumber" className="input-field pl-11" placeholder="9876543210" value={form.contactNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="password" type="password" className="input-field pl-11" placeholder="Min 6 chars" value={form.password} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="label-field">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="confirmPassword" type="password" className="input-field pl-11" placeholder="Repeat" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent-500 hover:text-accent-600">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
