import type { RequestStatus } from '@/lib/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types';

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`badge ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
