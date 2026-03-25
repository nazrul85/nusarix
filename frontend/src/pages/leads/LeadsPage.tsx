import { useCallback } from 'react';
import api from '../../services/api';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import { usePagination } from '../../hooks/usePagination';
import { Lead } from '../../types';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    new: 'badge-info', contacted: 'badge-warning', qualified: 'badge-success',
    unqualified: 'badge-danger', converted: 'badge-success',
  };
  return <span className={map[status] ?? 'badge-gray'}>{status}</span>;
};

export default function LeadsPage() {
  const fetchLeads = useCallback((params: Record<string, unknown>) => api.get('/leads', { params }), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch } = usePagination<Lead>(fetchLeads as never);

  const columns = [
    { key: 'title', label: 'Title', render: (row: Lead) => <span className="font-medium">{row.title}</span> },
    { key: 'source', label: 'Source', render: (row: Lead) => row.source ?? '—' },
    { key: 'status', label: 'Status', render: (row: Lead) => statusBadge(row.status) },
    { key: 'value', label: 'Value', render: (row: Lead) => row.value ? `$${Number(row.value).toLocaleString()}` : '—' },
    { key: 'created_at', label: 'Created', render: (row: Lead) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Leads</h1><p className="text-dark-light text-sm mt-1">{total} leads total</p></div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search leads..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
