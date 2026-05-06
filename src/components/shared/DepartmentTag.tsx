import { DEPARTMENT_COLORS } from '@/types/department';
import { cn } from '@/lib/utils';

interface DepartmentTagProps {
  department: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function DepartmentTag({
  department,
  size = 'md',
  className,
}: DepartmentTagProps) {
  const color = DEPARTMENT_COLORS[department] || '#6B7280';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium',
        size === 'sm' ? 'text-[11px]' : 'text-xs',
        className
      )}
      style={{
        backgroundColor: color + '18',
        color: color,
        border: `1px solid ${color}30`,
      }}
      aria-label={`Department: ${department}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {department}
    </span>
  );
}
