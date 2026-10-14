import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router-compat';
import { User, Mail, Lock, Phone, MapPin, Loader2, Wrench } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { SERVICE_LABELS, type ServiceCategory } from '@/lib/types';

const ALL = Object.keys(SERVICE_LABELS) as ServiceCategory[];

export default function MechanicRegister() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', contactNumber: '', serviceArea: '', password: '', confirmPassword: '' });
  const [cats, setCats] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (c: ServiceCategory) => setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.contactNumber || !form.serviceArea || !form.password) {
      toast.show('Please fill in all required fields.', 'error'); return;
    }
    if (!/^[0-9+ -]{7,20}$/.test(form.contactNumber)) { toast.show('Enter a valid contact number.', 'error'); return; }
    if (cats.length === 0) { toast.show('Select at least one service you provide.', 'error'); return; }
    if (form.password.length < 8) { toast.show('Password must be at least 8 characters.', 'error'); return; }
    if (form.password !== form.confirmPassword) { toast.show('Passwords do not match.', 'error'); return; }
    setLoading(true);
    try {
      const res = await register({
        name: form.name, email: form.email, contactNumber: form.contactNumber, password: form.password,
        accountType: 'mechanic', serviceArea: form.serviceArea, serviceCategories: cats,
      });
      if (res.needsConfirmation) {
        toast.show('Mechanic account created! Check your email to confirm, then log in.', 'success');
        navigate('/mechanic/login');
      } else {
        toast.show('Mechanic account created!', 'success');
        navigate('/mechanic/dashboard');
      }
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold text-navy-900">Join as a Mechanic</h1>
          <p className="mt-2 text-navy-500">Get roadside jobs in the areas and services you cover.</p>
        </div>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Full Name / Garage Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="name" className="input-field pl-11" placeholder="Kukas Auto Works" value={form.name} onChange={onChange} />
              </div>
            </div>
            <div>
              <label className="label-field">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="contactNumber" className="input-field pl-11" placeholder="9876543210" value={form.contactNumber} onChange={onChange} />
              </div>
            </div>
          </div>

          <div>
            <label className="label-field">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input name="email" type="email" className="input-field pl-11" placeholder="you@example.com" value={form.email} onChange={onChange} />
            </div>
          </div>

          <div>
            <label className="label-field">Service Areas</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
              <input name="serviceArea" className="input-field pl-11" placeholder="Kukas, Amer, Jaipur" value={form.serviceArea} onChange={onChange} />
            </div>
            <p className="mt-1 text-xs text-navy-400">Separate areas with commas. You'll see requests whose location mentions any of them.</p>
          </div>

          <div>
            <label className="label-field">Services You Provide</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL.map((c) => (
                <label key={c} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${cats.includes(c) ? 'border-accent-400 bg-accent-50 text-navy-900' : 'border-navy-200 text-navy-600 hover:bg-navy-50'}`}>
                  <input type="checkbox" className="accent-accent-500" checked={cats.includes(c)} onChange={() => toggle(c)} />
                  {SERVICE_LABELS[c]}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="password" type="password" className="input-field pl-11" placeholder="Min 8 chars" value={form.password} onChange={onChange} />
              </div>
            </div>
            <div>
              <label className="label-field">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
                <input name="confirmPassword" type="password" className="input-field pl-11" placeholder="Repeat" value={form.confirmPassword} onChange={onChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register as Mechanic'}
          </button>

          <p className="text-center text-sm text-navy-500">
            Already registered?{' '}
            <Link to="/mechanic/login" className="font-semibold text-accent-500 hover:text-accent-600">Mechanic Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
