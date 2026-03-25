interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  change?: string;
  changeType?: 'up' | 'down';
}

const colorMap = {
  primary: { bg: 'bg-primary-light', icon: 'text-primary', value: 'text-primary' },
  success: { bg: 'bg-success-light', icon: 'text-success', value: 'text-success' },
  warning: { bg: 'bg-warning-light', icon: 'text-warning', value: 'text-warning' },
  danger: { bg: 'bg-danger-light', icon: 'text-danger', value: 'text-danger' },
  info: { bg: 'bg-info-light', icon: 'text-info', value: 'text-info' },
  secondary: { bg: 'bg-purple-50', icon: 'text-secondary', value: 'text-secondary' },
};

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg} flex-shrink-0`}>
        <Icon className={`w-7 h-7 ${colors.icon}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-dark-light">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${colors.value}`}>{value}</p>
      </div>
    </div>
  );
}
