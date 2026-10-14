import type {
  AdminStats,
  AssistanceRequest,
  AuthResponse,
  CreateRequestDTO,
  PageResult,
  User,
} from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getToken(): string | null {
  return localStorage.getItem('rr_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('rr_token');
    localStorage.removeItem('rr_user');
    throw new Error('Unauthorized. Please log in again.');
  }

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.message) msg = body.message;
      else if (body.error) msg = body.error;
    } catch {
      // non-JSON error body
    }
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Auth ----

export const api = {
  register(data: { name: string; email: string; password: string; contactNumber: string }): Promise<AuthResponse> {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  },

  login(data: { email: string; password: string }): Promise<AuthResponse> {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  },

  me(): Promise<User> {
    return request('/auth/me');
  },

  changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return request('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });
  },

  // ---- Customer requests ----

  createRequest(data: CreateRequestDTO): Promise<AssistanceRequest> {
    return request('/requests', { method: 'POST', body: JSON.stringify(data) });
  },

  getMyRequests(): Promise<AssistanceRequest[]> {
    return request('/requests/my');
  },

  getRequestById(id: number): Promise<AssistanceRequest> {
    return request(`/requests/${id}`);
  },

  trackRequest(requestId: string): Promise<AssistanceRequest> {
    return request(`/requests/track/${requestId}`);
  },

  cancelRequest(id: number): Promise<AssistanceRequest> {
    return request(`/requests/${id}/cancel`, { method: 'PATCH' });
  },

  // ---- Mechanic ----

  registerMechanic(data: Record<string, unknown>): Promise<AuthResponse> {
    return request('/auth/register-mechanic', { method: 'POST', body: JSON.stringify(data) });
  },
  mechanicAvailable(): Promise<AssistanceRequest[]> {
    return request('/mechanic/available');
  },
  mechanicMyJobs(): Promise<AssistanceRequest[]> {
    return request('/mechanic/jobs');
  },
  mechanicAccept(id: number): Promise<AssistanceRequest> {
    return request(`/mechanic/requests/${id}/accept`, { method: 'PATCH' });
  },
  mechanicUpdateStatus(id: number, status: 'IN_PROGRESS' | 'COMPLETED'): Promise<AssistanceRequest> {
    return request(`/mechanic/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  mechanicUpdateProfile(serviceArea: string, serviceCategories: string[]): Promise<User> {
    return request('/mechanic/profile', { method: 'PUT', body: JSON.stringify({ serviceArea, serviceCategories }) });
  },

  // ---- Admin ----

  adminStats(): Promise<AdminStats> {
    return request('/admin/stats');
  },

  adminListRequests(params: {
    page?: number;
    size?: number;
    status?: string;
    serviceCategory?: string;
    search?: string;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PageResult<AssistanceRequest>> {
    const sp = new URLSearchParams();
    if (params.page !== undefined) sp.set('page', String(params.page));
    if (params.size !== undefined) sp.set('size', String(params.size));
    if (params.status) sp.set('status', params.status);
    if (params.serviceCategory) sp.set('serviceCategory', params.serviceCategory);
    if (params.search) sp.set('search', params.search);
    if (params.sortBy) sp.set('sortBy', params.sortBy);
    if (params.sortDir) sp.set('sortDir', params.sortDir);
    return request(`/admin/requests?${sp.toString()}`);
  },

  adminUpdateStatus(id: number, status: string, assignedProvider?: string): Promise<AssistanceRequest> {
    return request(`/admin/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignedProvider: assignedProvider || null }),
    });
  },

  adminGetAllCustomers(): Promise<User[]> {
    return request('/admin/customers');
  },
};
