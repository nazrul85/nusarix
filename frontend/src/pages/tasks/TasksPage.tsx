import { useCallback } from 'react';
import api from '../../services/api';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import { usePagination } from '../../hooks/usePagination';
import { Task } from '../../types';

export default function TasksPage() {
  const fetchTasks = useCallback((params: Record<string, unknown>) => api.get('/tasks', { params }), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch } = usePagination<Task>(fetchTasks as never);

  const priorityBadge = (priority: string) => {
    const map: Record<string, string> = { low: 'badge-info', medium: 'badge-warning', high: 'badge-danger', urgent: 'badge-danger' };
    return <span className={map[priority] ?? 'badge-gray'}>{priority}</span>;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { open: 'badge-info', in_progress: 'badge-warning', completed: 'badge-success', cancelled: 'badge-gray' };
    return <span className={map[status] ?? 'badge-gray'}>{status.replace('_', ' ')}</span>;
  };

  const columns = [
    { key: 'title', label: 'Task', render: (row: Task) => <span className="font-medium">{row.title}</span> },
    { key: 'status', label: 'Status', render: (row: Task) => statusBadge(row.status) },
    { key: 'priority', label: 'Priority', render: (row: Task) => priorityBadge(row.priority) },
    { key: 'due_date', label: 'Due Date', render: (row: Task) => row.due_date ? new Date(row.due_date).toLocaleDateString() : '—' },
    { key: 'assignedTo', label: 'Assigned To', render: (row: Task) => row.assignedTo?.name ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Tasks</h1><p className="text-dark-light text-sm mt-1">{total} tasks total</p></div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search tasks..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
