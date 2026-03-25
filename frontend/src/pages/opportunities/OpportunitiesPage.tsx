import { useCallback } from 'react';
import api from '../../services/api';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import { usePagination } from '../../hooks/usePagination';
import { Opportunity } from '../../types';

const stageBadge = (stage: string) => {
  const map: Record<string, string> = {
    prospecting: 'badge-info', qualification: 'badge-warning', proposal: 'badge-warning',
    negotiation: 'badge-warning', closed_won: 'badge-success', closed_lost: 'badge-danger',
  };
  return <span className={map[stage] ?? 'badge-gray'}>{stage.replace('_', ' ')}</span>;
};

export default function OpportunitiesPage() {
  const fetchOpp = useCallback((params: Record<string, unknown>) => api.get('/opportunities', { params }), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch } = usePagination<Opportunity>(fetchOpp as never);

  const columns = [
    { key: 'title', label: 'Title', render: (row: Opportunity) => <span className="font-medium">{row.title}</span> },
    { key: 'stage', label: 'Stage', render: (row: Opportunity) => stageBadge(row.stage) },
    { key: 'value', label: 'Value', render: (row: Opportunity) => row.value ? `$${Number(row.value).toLocaleString()}` : '—' },
    { key: 'probability', label: 'Probability', render: (row: Opportunity) => `${row.probability}%` },
    { key: 'expected_close_date', label: 'Close Date', render: (row: Opportunity) => row.expected_close_date ? new Date(row.expected_close_date).toLocaleDateString() : '—' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-dark">Opportunities</h1><p className="text-dark-light text-sm mt-1">{total} opportunities total</p></div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search opportunities..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
