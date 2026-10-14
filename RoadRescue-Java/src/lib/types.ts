export type RequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServiceCategory =
  | 'VEHICLE_BREAKDOWN'
  | 'PUNCTURE_TYRE'
  | 'BATTERY_JUMPSTART'
  | 'EMERGENCY_TOWING'
  | 'MECHANICAL_REPAIRS'
  | 'OTHER';

export interface User {
  id: string;
  contactNumber?: string | undefined;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MECHANIC';
  serviceArea?: string | undefined;
  serviceCategories?: ServiceCategory[] | undefined;
}

export interface AssistanceRequest {
  id: number;
  requestId: string;
  customerName: string;
  contactNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleRegNumber: string | null;
  serviceCategory: ServiceCategory;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  additionalNotes: string | null;
  status: RequestStatus;
  assignedProvider: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateRequestDTO {
  customerName: string;
  contactNumber: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleRegNumber?: string | undefined;
  serviceCategory: ServiceCategory;
  description: string;
  location: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
  additionalNotes?: string | undefined;
}

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  completed: number;
  cancelled: number;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export const SERVICE_LABELS: Record<ServiceCategory, string> = {
  VEHICLE_BREAKDOWN: 'Vehicle Breakdown Assistance',
  PUNCTURE_TYRE: 'Puncture & Tyre Replacement',
  BATTERY_JUMPSTART: 'Battery Jump-Start',
  EMERGENCY_TOWING: 'Emergency Towing',
  MECHANICAL_REPAIRS: 'Mechanical Repairs',
  OTHER: 'Other Vehicle Emergency',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const STATUS_COLORS: Record<RequestStatus, string> = {
  PENDING: 'bg-warning-100 text-warning-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-error-100 text-error-700',
  ASSIGNED: 'bg-navy-100 text-navy-700',
  IN_PROGRESS: 'bg-accent-100 text-accent-700',
  COMPLETED: 'bg-success-100 text-success-700',
  CANCELLED: 'bg-charcoal-200 text-charcoal-600',
};
