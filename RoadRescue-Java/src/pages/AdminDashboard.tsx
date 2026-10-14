import { useEffect, useState, useCallback } from 'react';
import {
  Loader2, Search, Filter, ChevronLeft, ChevronRight, X, Eye,
  CheckCircle, XCircle, Wrench, Clock, MapPin, Car, Phone, User,
  Lock, TrendingUp, AlertCircle, Check, RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import {
  SERVICE_LABELS, STATUS_LABELS,
  type AdminStats, type AssistanceRequest, type PageResult,
  type RequestStatus, type ServiceCategory, type User as UserType,
} from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

const STATUSES: (RequestStatus | '')[] = ['', 'PENDING', 'APPROVED', 'REJECTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const CATEGORIES: (ServiceCategory | '')[] = ['', 'VEHICLE_BREAKDOWN', 'PUNCTURE_TYRE', 'BATTERY_JUMPSTART', 'EMERGENCY_TOWING', 'MECHANICAL_REPAIRS', 'OTHER'];
const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'createdAt,asc', label: 'Oldest First' },
  { value: 'customerName,asc', label: 'Customer A-Z' },
  { value: 'status,asc', label: 'Status' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [page, setPageData] = useState<PageResult<AssistanceRequest> | null>(null);
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'requests' | 'customers'>('requests');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [pageNum, setPageNum] = useState(0);
  const pageSize = 10;

  // Detail modal
  const [selected, setSelected] = useState<AssistanceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RequestStatus>('PENDING');
  const [provider, setProvider] = useState('');
  const [updating, setUpdating] = useState(false);

  // Change password modal
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const s = await api.adminStats();
      setStats(s);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to load stats.', 'error');
    }
  }, [toast]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const [sortField, sortDir] = sortBy.split(',');
      const data = await api.adminListRequests({
        page: pageNum, size: pageSize,
        status: statusFilter || undefined,
        serviceCategory: categoryFilter || undefined,
        search: search || undefined,
        sortBy: sortField, sortDir,
      });
      setPageData(data);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to load requests.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, pageNum, statusFilter, categoryFilter, search, sortBy]);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await api.adminGetAllCustomers();
      setCustomers(data);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to load customers.', 'error');
    }
  }, [toast]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadRequests(); }, [loadRequests]);
  useEffect(() => { if (tab === 'customers') loadCustomers(); }, [tab, loadCustomers]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadRequests()]);
    setRefreshing(false);
    toast.show('Dashboard refreshed.', 'success');
  };

  const openDetail = (req: AssistanceRequest) => {
    setSelected(req);
    setNewStatus(req.status);
    setProvider(req.assignedProvider || '');
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const updated = await api.adminUpdateStatus(selected.id, newStatus, provider || undefined);
      toast.show('Request status updated.', 'success');
      setSelected(updated);
      await Promise.all([loadStats(), loadRequests()]);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to update.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickAction = async (req: AssistanceRequest, action: 'approve' | 'reject') => {
    try {
      await api.adminUpdateStatus(req.id, action === 'approve' ? 'APPROVED' : 'REJECTED');
      toast.show(`Request ${action === 'approve' ? 'approved' : 'rejected'}.`, 'success');
      await Promise.all([loadStats(), loadRequests()]);
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Action failed.', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) {
      toast.show('New password must be at least 6 characters.', 'error');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.show('Passwords do not match.', 'error');
      return;
    }
    setChangingPwd(true);
    try {
      await api.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.show('Password changed successfully.', 'success');
      setShowPwdModal(false);
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.show(err instanceof Error ? err.message : 'Failed to change password.', 'error');
    } finally {
      setChangingPwd(false);
    }
  };

  const resetFilters = () => {
    setSearch(''); setStatusFilter(''); setCategoryFilter(''); setSortBy('createdAt,desc'); setPageNum(0);
  };

  const totalPages = page?.totalPages || 0;

  return (
    <div className="min-h-screen bg-navy-50 animate-fade-in">
      {/* Admin header */}
      <div className="bg-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-navy-200">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRefresh} className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20" disabled={refreshing}>
                {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
              </button>
              <button onClick={() => setShowPwdModal(true)} className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Lock className="h-4 w-4" /> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats grid */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={TrendingUp} label="Total Requests" value={stats.total} color="navy" />
            <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="warning" />
            <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="success" />
            <StatCard icon={Wrench} label="Active" value={stats.active} color="accent" />
            <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="blue" />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="error" />
            <StatCard icon={X} label="Cancelled" value={stats.cancelled} color="charcoal" />
            <StatCard icon={User} label="Customers" value={customers.length || '—'} color="navy" />
          </div>
        )}

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-navy-200">
          <button
            onClick={() => setTab('requests')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${tab === 'requests' ? 'border-b-2 border-accent-500 text-accent-600' : 'text-navy-500 hover:text-navy-700'}`}
          >
            Requests
          </button>
          <button
            onClick={() => setTab('customers')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${tab === 'customers' ? 'border-b-2 border-accent-500 text-accent-600' : 'text-navy-500 hover:text-navy-700'}`}
          >
            Customers
          </button>
        </div>

        {/* Requests tab */}
        {tab === 'requests' && (
          <div className="mt-6">
            {/* Filters */}
            <div className="card p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
                  <input
                    className="input-field pl-10 py-2"
                    placeholder="Search ID, name, phone..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPageNum(0); }}
                  />
                </div>
                <select className="input-field py-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPageNum(0); }}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s ? STATUS_LABELS[s as RequestStatus] : 'All Statuses'}</option>)}
                </select>
                <select className="input-field py-2" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPageNum(0); }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c ? SERVICE_LABELS[c as ServiceCategory] : 'All Services'}</option>)}
                </select>
                <select className="input-field py-2" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPageNum(0); }}>
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {(search || statusFilter || categoryFilter || sortBy !== 'createdAt,desc') && (
                <button onClick={resetFilters} className="mt-3 text-sm font-medium text-accent-500 hover:text-accent-600">
                  Clear filters
                </button>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent-500" /></div>
            ) : !page || page.content.length === 0 ? (
              <div className="card mt-4 p-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-navy-200" />
                <p className="mt-4 text-lg font-semibold text-navy-700">No Requests Found</p>
                <p className="mt-2 text-sm text-navy-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="card mt-4 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wider text-navy-500">
                        <tr>
                          <th className="px-4 py-3">Request ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Service</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-100">
                        {page.content.map((req) => (
                          <tr key={req.id} className="hover:bg-navy-50/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-navy-900">{req.requestId}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-navy-700">{req.customerName}</p>
                              <p className="text-xs text-navy-400">{req.contactNumber}</p>
                            </td>
                            <td className="px-4 py-3 text-navy-600">{SERVICE_LABELS[req.serviceCategory]}</td>
                            <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                            <td className="px-4 py-3 text-navy-500">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => openDetail(req)} className="btn-ghost p-2"><Eye className="h-4 w-4" /></button>
                                {req.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => handleQuickAction(req, 'approve')} className="rounded-lg bg-success-500 p-2 text-white hover:bg-success-600 transition-colors" title="Approve">
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleQuickAction(req, 'reject')} className="rounded-lg bg-error-500 p-2 text-white hover:bg-error-600 transition-colors" title="Reject">
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-navy-500">
                      Page {pageNum + 1} of {totalPages} — {page.totalElements} total
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setPageNum(Math.max(0, pageNum - 1))} disabled={pageNum === 0} className="btn-secondary p-2 disabled:opacity-40">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={() => setPageNum(Math.min(totalPages - 1, pageNum + 1))} disabled={pageNum >= totalPages - 1} className="btn-secondary p-2 disabled:opacity-40">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Customers tab */}
        {tab === 'customers' && (
          <div className="mt-6">
            {customers.length === 0 ? (
              <div className="card p-12 text-center">
                <User className="mx-auto h-12 w-12 text-navy-200" />
                <p className="mt-4 text-lg font-semibold text-navy-700">No Customers Registered</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-wider text-navy-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-semibold text-navy-900">{c.name}</td>
                        <td className="px-4 py-3 text-navy-600">{c.email}</td>
                        <td className="px-4 py-3 text-navy-600">{c.contactNumber || '—'}</td>
                        <td className="px-4 py-3 text-navy-500">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-navy-900">Request Details</h2>
              <button onClick={() => setSelected(null)} className="text-navy-300 hover:text-navy-500"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailItem label="Request ID" value={selected.requestId} />
              <DetailItem label="Status" badge={<StatusBadge status={selected.status} />} />
              <DetailItem label="Customer Name" value={selected.customerName} />
              <DetailItem label="Contact Number" value={selected.contactNumber} icon={<Phone className="h-4 w-4" />} />
              <DetailItem label="Service" value={SERVICE_LABELS[selected.serviceCategory]} />
              <DetailItem label="Vehicle" value={`${selected.vehicleType} — ${selected.vehicleModel}`} icon={<Car className="h-4 w-4" />} />
              {selected.vehicleRegNumber && <DetailItem label="Reg. Number" value={selected.vehicleRegNumber} />}
              <DetailItem label="Submitted" value={new Date(selected.createdAt).toLocaleString('en-IN')} icon={<Clock className="h-4 w-4" />} />
            </div>

            <div className="mt-4 space-y-3">
              <div><p className="text-xs font-medium uppercase tracking-wider text-navy-400">Description</p><p className="mt-1 text-sm text-navy-700">{selected.description}</p></div>
              <div><p className="text-xs font-medium uppercase tracking-wider text-navy-400">Location</p><p className="mt-1 flex items-center gap-1 text-sm text-navy-700"><MapPin className="h-4 w-4 text-accent-500" /> {selected.location}</p></div>
              {selected.latitude && selected.longitude && <DetailItem label="Coordinates" value={`${selected.latitude}, ${selected.longitude}`} />}
              {selected.additionalNotes && <div><p className="text-xs font-medium uppercase tracking-wider text-navy-400">Notes</p><p className="mt-1 text-sm text-navy-700">{selected.additionalNotes}</p></div>}
            </div>

            {/* Status update */}
            <div className="mt-6 border-t border-navy-100 pt-6">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-navy-700">Update Status</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <select className="input-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value as RequestStatus)}>
                  {(Object.keys(STATUS_LABELS) as RequestStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <input className="input-field" placeholder="Assigned provider name" value={provider} onChange={(e) => setProvider(e.target.value)} />
              </div>
              <button onClick={handleUpdateStatus} disabled={updating} className="btn-primary mt-4 w-full">
                {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <><RefreshCw className="h-4 w-4" /> Update Request</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showPwdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4 animate-fade-in" onClick={() => setShowPwdModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-navy-900">Change Password</h2>
              <button onClick={() => setShowPwdModal(false)} className="text-navy-300 hover:text-navy-500"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label className="label-field">Current Password</label>
                <input type="password" className="input-field" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} required />
              </div>
              <div>
                <label className="label-field">New Password</label>
                <input type="password" className="input-field" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} required />
              </div>
              <div>
                <label className="label-field">Confirm New Password</label>
                <input type="password" className="input-field" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={changingPwd}>
                {changingPwd ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />} Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof TrendingUp; label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    navy: 'bg-navy-900', warning: 'bg-warning-500', success: 'bg-success-500',
    accent: 'bg-accent-500', error: 'bg-error-500', charcoal: 'bg-charcoal-500', blue: 'bg-blue-500',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-navy-500">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors[color] || colors['navy']}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

function DetailItem({ label, value, badge, icon }: { label: string; value?: string; badge?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-navy-400">{label}</p>
      {badge ? <div className="mt-1">{badge}</div> : <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-navy-700">{icon}{value}</p>}
    </div>
  );
}
