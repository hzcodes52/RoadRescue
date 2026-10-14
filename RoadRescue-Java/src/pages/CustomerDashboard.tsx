import { useEffect, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { Loader2, Plus, MapPin, Clock, X, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { SERVICE_LABELS, type AssistanceRequest } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

export default function CustomerDashboard() {
  const toast = useToast();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AssistanceRequest | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getMyRequests();
      setRequests(data);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to load requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    setCancelling(id);
    try {
      await api.cancelRequest(id);
      toast.show('Request cancelled successfully.', 'success');
      await load();
      setSelected(null);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to cancel.', 'error');
    } finally {
      setCancelling(null);
    }
  };

  const canCancel = (status: string) => status === 'PENDING' || status === 'APPROVED';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-900">My Requests</h1>
          <p className="mt-1 text-navy-500">View and manage your roadside assistance requests.</p>
        </div>
        <Link to="/request" className="btn-primary">
          <Plus className="h-4 w-4" /> New Request
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
        </div>
      ) : requests.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
            <Plus className="h-8 w-8 text-navy-300" />
          </div>
          <p className="mt-4 text-lg font-semibold text-navy-700">No Requests Yet</p>
          <p className="mt-2 text-sm text-navy-500">Create your first roadside assistance request to get started.</p>
          <Link to="/request" className="btn-primary mt-6">
            <Plus className="h-4 w-4" /> Request Assistance
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="card p-5 transition-all hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-sm font-bold text-navy-900">{req.requestId}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-navy-700">{SERVICE_LABELS[req.serviceCategory]}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-400">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {req.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(req)} className="btn-ghost">
                    <Eye className="h-4 w-4" /> Details
                  </button>
                  {canCancel(req.status) && (
                    <button
                      onClick={() => handleCancel(req.id)}
                      disabled={cancelling === req.id}
                      className="btn-danger"
                    >
                      {cancelling === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-navy-900">Request Details</h2>
              <button onClick={() => setSelected(null)} className="text-navy-300 hover:text-navy-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-navy-400">Request ID</span><span className="font-semibold text-navy-900">{selected.requestId}</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Status</span><StatusBadge status={selected.status} /></div>
              <div className="flex justify-between"><span className="text-navy-400">Service</span><span className="font-semibold text-navy-700">{SERVICE_LABELS[selected.serviceCategory]}</span></div>
              <div className="flex justify-between"><span className="text-navy-400">Vehicle</span><span className="font-semibold text-navy-700">{selected.vehicleType} — {selected.vehicleModel}</span></div>
              {selected.vehicleRegNumber && <div className="flex justify-between"><span className="text-navy-400">Reg. Number</span><span className="font-semibold text-navy-700">{selected.vehicleRegNumber}</span></div>}
              <div><span className="text-navy-400">Description</span><p className="mt-1 text-navy-700">{selected.description}</p></div>
              <div><span className="text-navy-400">Location</span><p className="mt-1 text-navy-700">{selected.location}</p></div>
              {selected.latitude && selected.longitude && <div className="flex justify-between"><span className="text-navy-400">Coordinates</span><span className="font-semibold text-navy-700">{selected.latitude}, {selected.longitude}</span></div>}
              {selected.additionalNotes && <div><span className="text-navy-400">Notes</span><p className="mt-1 text-navy-700">{selected.additionalNotes}</p></div>}
              {selected.assignedProvider && <div className="flex justify-between"><span className="text-navy-400">Assigned To</span><span className="font-semibold text-navy-700">{selected.assignedProvider}</span></div>}
              <div className="flex justify-between"><span className="text-navy-400">Submitted</span><span className="font-semibold text-navy-700">{new Date(selected.createdAt).toLocaleString('en-IN')}</span></div>
            </div>

            {canCancel(selected.status) && (
              <button
                onClick={() => handleCancel(selected.id)}
                disabled={cancelling === selected.id}
                className="btn-danger mt-6 w-full"
              >
                {cancelling === selected.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                Cancel This Request
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
