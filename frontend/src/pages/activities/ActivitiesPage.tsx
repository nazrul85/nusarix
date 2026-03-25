import { useCallback } from 'react';
import api from '../../services/api';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import { usePagination } from '../../hooks/usePagination';
import { Activity } from '../../types';

export default function ActivitiesPage() {
  const fetchActivities = useCallback((params: Record<string, unknown>) => api.get('/activities', { params }), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch } = usePagination<Activity>(fetchActivities as never);

  const typeEmoji: Record<string, string> = {
    call: '📞', email: '📧', meeting: '🤝', note: '📝', task: '✅',
  };

  const columns = [
    {
      key: 'type', label: 'Type',
      render: (row: Activity) => (
        <span className="flex items-center gap-2">
          <span>{typeEmoji[row.type]}</span>
          <span className="capitalize badge-gray">{row.type}</span>
        </span>
      ),
    },
    { key: 'description', label: 'Description', render: (row: Activity) => <span className="line-clamp-2 text-sm">{row.description}</span> },
    { key: 'user', label: 'Logged By', render: (row: Activity) => row.user?.name ?? 'System' },
    { key: 'created_at', label: 'Date', render: (row: Activity) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Activities</h1><p className="text-dark-light text-sm mt-1">{total} activities total</p></div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search activities..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
