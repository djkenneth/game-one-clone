import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const orderColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PAID: 'bg-green-100 text-green-800 border-green-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
  REFUNDED: 'bg-orange-100 text-orange-800 border-orange-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = orderColors[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <Badge variant="outline" className={cn('capitalize', colorClass)}>
      {status.toLowerCase()}
    </Badge>
  );
}
