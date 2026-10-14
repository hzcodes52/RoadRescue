import { useState } from 'react';
import { Search, Loader2, MapPin, Clock, Wrench, Car, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { SERVICE_LABELS, type AssistanceRequest } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

export default function TrackRequest() {
  const toast = useToast();
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssistanceRequest | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) {
      toast.show('Please enter a request ID.', 'error');
      return;
    }
    setLoading(true);
    setSearched(false);
    try {
      const req = await api.trackRequest(requestId.trim().toUpperCase());
      setResult(req);
      setSearched(true);
    } catch (err) {
      setResult(null);
      setSearched(true);
      toast.show(err instanceof Error ? err.message : 'Request not found.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-navy-900">Track Your Request</h1>
        <p className="mt-2 text-navy-500">Enter your unique request ID to check the current status.</p>
      </div>

      <form onSubmit={handleSearch} className="mt-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
          <input
            className="input-field pl-11"
            placeholder="e.g. RR-20261014-AB12"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Track'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="card mt-8 p-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Request ID</p>
              <p className="font-heading text-xl font-bold text-navy-900">{result.requestId}</p>
            </div>
            <StatusBadge status={result.status} />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 mt-0.5 text-accent-500 shrink-0" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Service</p>
                <p className="text-sm font-semibold text-navy-700">{SERVICE_LABELS[result.serviceCategory]}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="h-5 w-5 mt-0.5 text-accent-500 shrink-0" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Vehicle</p>
                <p className="text-sm font-semibold text-navy-700">
                  {result.vehicleType} — {result.vehicleModel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-accent-500 shrink-0" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Location</p>
                <p className="text-sm font-semibold text-navy-700">{result.location}</p>
              </div>
            </div>

            {result.assignedProvider && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-accent-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Assigned Provider</p>
                  <p className="text-sm font-semibold text-navy-700">{result.assignedProvider}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-accent-500 shrink-0" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Submitted</p>
                <p className="text-sm font-semibold text-navy-700">
                  {new Date(result.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="mt-6 border-t border-navy-100 pt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-navy-400 mb-3">Status History</p>
            <div className="flex flex-wrap gap-2">
              {['PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((s, i, arr) => {
                const order = ['PENDING', 'APPROVED', 'REJECTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
                const currentIdx = order.indexOf(result.status);
                const thisIdx = order.indexOf(s);
                const reached = thisIdx <= currentIdx;
                const isCurrent = s === result.status;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      reached ? 'bg-accent-500 text-white' : 'bg-navy-100 text-navy-300'
                    } ${isCurrent ? 'ring-4 ring-accent-500/20 animate-pulse-glow' : ''}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs font-medium ${reached ? 'text-navy-700' : 'text-navy-300'}`}>
                      {s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                    {i < arr.length - 1 && <div className={`h-0.5 w-4 ${reached ? 'bg-accent-400' : 'bg-navy-100'}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {searched && !result && !loading && (
        <div className="card mt-8 p-12 text-center animate-slide-up">
          <Search className="mx-auto h-12 w-12 text-navy-200" />
          <p className="mt-4 text-lg font-semibold text-navy-700">Request Not Found</p>
          <p className="mt-2 text-sm text-navy-500">
            No request was found with that ID. Please check and try again.
          </p>
        </div>
      )}
    </div>
  );
}
