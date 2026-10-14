import { useCallback, useEffect, useState } from 'react';
import { Loader2, MapPin, Phone, RefreshCw, CheckCircle, Play, Settings, Inbox } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { SERVICE_LABELS, type AssistanceRequest, type ServiceCategory } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

const ALL = Object.keys(SERVICE_LABELS) as ServiceCategory[];

function JobCard({ r, children }: { r: AssistanceRequest; children?: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-accent-600">{r.requestId}</p>
          <h3 className="mt-1 font-heading text-lg font-bold text-navy-900">{SERVICE_LABELS[r.serviceCategory]}</h3>
          <p className="text-sm text-navy-500">{r.vehicleType} · {r.vehicleModel}{r.vehicleRegNumber ? ` · ${r.vehicleRegNumber}` : ''}</p>
        </div>
        <StatusBadge status={r.status} />
      </div>
      <p className="mt-3 text-sm text-navy-700">{r.description}</p>
      <div className="mt-3 space-y-1 text-sm text-navy-600">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-500" /> {r.location}</p>
        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent-500" /> {r.customerName} ·{' '}
          <a href={`tel:${r.contactNumber}`} className="font-medium hover:text-accent-500">{r.contactNumber}</a></p>
      </div>
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export default function MechanicDashboard() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'available' | 'jobs' | 'profile'>('available');
  const [available, setAvailable] = useState<AssistanceRequest[]>([]);
  const [jobs, setJobs] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [area, setArea] = useState(user?.serviceArea ?? '');
  const [cats, setCats] = useState<ServiceCategory[]>(user?.serviceCategories ?? []);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, j] = await Promise.all([api.mechanicAvailable(), api.mechanicMyJobs()]);
      setAvailable(a); setJobs(j);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to load jobs.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const act = async (id: number, fn: () => Promise<unknown>, msg: string) => {
    setBusy(id);
    try { await fn(); toast.show(msg, 'success'); await load(); }
    catch (err) { toast.show(err instanceof Error ? err.message : 'Action failed.', 'error'); }
    finally { setBusy(null); }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!area.trim() || cats.length === 0) { toast.show('Add at least one area and one service.', 'error'); return; }
    setSaving(true);
    try { await api.mechanicUpdateProfile(area, cats); await refresh(); toast.show('Service area updated.', 'success'); await load(); }
    catch (err) { toast.show(err instanceof Error ? err.message : 'Update failed.', 'error'); }
    finally { setSaving(false); }
  };

  const active = jobs.filter((j) => j.status === 'ASSIGNED' || j.status === 'IN_PROGRESS');
  const tabBtn = (t: typeof tab, label: string) => (
    <button onClick={() => setTab(t)} className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === t ? 'border-accent-500 text-accent-600' : 'border-transparent text-navy-500 hover:text-navy-800'}`}>{label}</button>
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-navy-900 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white">Mechanic Dashboard</h1>
            <p className="mt-1 text-navy-200">Welcome, {user?.name} · Areas: {user?.serviceArea || '—'}</p>
          </div>
          <button onClick={load} className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5"><p className="text-sm text-navy-500">Available in your area</p><p className="mt-2 text-3xl font-bold text-navy-900">{available.length}</p></div>
          <div className="card p-5"><p className="text-sm text-navy-500">Active jobs</p><p className="mt-2 text-3xl font-bold text-navy-900">{active.length}</p></div>
          <div className="card p-5"><p className="text-sm text-navy-500">Completed</p><p className="mt-2 text-3xl font-bold text-navy-900">{jobs.filter((j) => j.status === 'COMPLETED').length}</p></div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-navy-200">
          {tabBtn('available', 'Available Requests')}
          {tabBtn('jobs', 'My Jobs')}
          {tabBtn('profile', 'Service Area')}
        </div>

        <div className="mt-6">
          {loading && tab !== 'profile' ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent-500" /></div>
          ) : tab === 'available' ? (
            available.length === 0 ? (
              <div className="card flex flex-col items-center p-12 text-center">
                <Inbox className="h-10 w-10 text-navy-300" />
                <p className="mt-3 font-semibold text-navy-700">No open requests in your area right now</p>
                <p className="text-sm text-navy-500">Check back soon, or widen your service area.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {available.map((r) => (
                  <JobCard key={r.id} r={r}>
                    <button className="btn-primary" disabled={busy === r.id} onClick={() => act(r.id, () => api.mechanicAccept(r.id), `Job ${r.requestId} accepted.`)}>
                      {busy === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Accept Job
                    </button>
                  </JobCard>
                ))}
              </div>
            )
          ) : tab === 'jobs' ? (
            jobs.length === 0 ? (
              <div className="card p-12 text-center text-navy-500">You haven't accepted any jobs yet.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map((r) => (
                  <JobCard key={r.id} r={r}>
                    {r.status === 'ASSIGNED' && (
                      <button className="btn-secondary" disabled={busy === r.id} onClick={() => act(r.id, () => api.mechanicUpdateStatus(r.id, 'IN_PROGRESS'), 'Marked as in progress.')}>
                        <Play className="h-4 w-4" /> Start Work
                      </button>
                    )}
                    {(r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS') && (
                      <button className="btn-primary" disabled={busy === r.id} onClick={() => act(r.id, () => api.mechanicUpdateStatus(r.id, 'COMPLETED'), 'Job completed.')}>
                        <CheckCircle className="h-4 w-4" /> Mark Completed
                      </button>
                    )}
                  </JobCard>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={saveProfile} className="card max-w-xl space-y-5 p-6">
              <div className="flex items-center gap-2 font-heading text-lg font-bold text-navy-900"><Settings className="h-5 w-5 text-accent-500" /> Service Area & Services</div>
              <div>
                <label className="label-field">Service Areas (comma separated)</label>
                <input className="input-field" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Kukas, Amer, Jaipur" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL.map((c) => (
                  <label key={c} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${cats.includes(c) ? 'border-accent-400 bg-accent-50' : 'border-navy-200'}`}>
                    <input type="checkbox" className="accent-accent-500" checked={cats.includes(c)} onChange={() => setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))} />
                    {SERVICE_LABELS[c]}
                  </label>
                ))}
              </div>
              <button className="btn-primary" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
