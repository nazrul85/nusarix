import { useEffect, useState } from 'react';
import {
  UserGroupIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../../components/ui/StatCard';
import { dashboardService } from '../../services/dashboardService';
import { Activity, DashboardStats } from '../../types';

const activityIcons: Record<string, string> = {
  call: '📞',
  email: '📧',
  meeting: '🤝',
  note: '📝',
  task: '✅',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          dashboardService.stats(),
          dashboardService.recentActivities(),
        ]);
        setStats(statsRes.data.data);
        setActivities(activitiesRes.data.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-dark-light text-sm mt-1">Welcome to your Nusarix ERP &amp; CRM platform</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Customers" value={stats.total_customers} icon={UserGroupIcon} color="primary" />
          <StatCard title="Total Leads" value={stats.total_leads} icon={FunnelIcon} color="info" />
          <StatCard title="Opportunities" value={stats.total_opportunities} icon={CurrencyDollarIcon} color="secondary" />
          <StatCard title="Open Tasks" value={stats.open_tasks} icon={ClipboardDocumentListIcon} color="warning" />
          <StatCard title="Pipeline Value" value={formatCurrency(stats.pipeline_value)} icon={CurrencyDollarIcon} color="success" />
          <StatCard title="Won Revenue" value={formatCurrency(stats.revenue_opportunities)} icon={CurrencyDollarIcon} color="success" />
          <StatCard title="Total Tasks" value={stats.total_tasks} icon={BoltIcon} color="danger" />
          <StatCard title="Total Users" value={stats.total_users} icon={UsersIcon} color="secondary" />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold text-dark mb-4">Recent Activities</h2>
          {activities.length === 0 ? (
            <p className="text-dark-light text-sm text-center py-8">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    {activityIcons[activity.type] ?? '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark">{activity.description}</p>
                    <p className="text-xs text-dark-light mt-0.5">
                      {activity.user?.name ?? 'System'} · {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge-gray capitalize text-xs flex-shrink-0">{activity.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-base font-semibold text-dark mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add Customer', icon: UserGroupIcon, color: 'bg-primary-light text-primary', path: '/customers' },
              { label: 'Create Lead', icon: FunnelIcon, color: 'bg-info-light text-info', path: '/leads' },
              { label: 'New Opportunity', icon: CurrencyDollarIcon, color: 'bg-purple-50 text-secondary', path: '/opportunities' },
              { label: 'Add Task', icon: ClipboardDocumentListIcon, color: 'bg-warning-light text-warning', path: '/tasks' },
              { label: 'Log Activity', icon: BoltIcon, color: 'bg-success-light text-success', path: '/activities' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-dark group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
