import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { customerService } from '../../services/customerService';
import { usePagination } from '../../hooks/usePagination';
import { Customer } from '../../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  job_title: '',
  city: '',
  country: '',
  status: 'prospect' as const,
  notes: '',
};

export default function CustomersPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; customer: Customer | null }>({
    open: false,
    customer: null,
  });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCustomers = useCallback(
    (params: Record<string, unknown>) => customerService.list(params),
    []
  );

  const { items, loading, currentPage, lastPage, total, setPage, setSearch, refresh } =
    usePagination<Customer>(fetchCustomers);

  const openCreate = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      job_title: customer.job_title ?? '',
      city: customer.city ?? '',
      country: customer.country ?? '',
      status: customer.status,
      notes: customer.notes ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, form);
        toast.success('Customer updated successfully');
      } else {
        await customerService.create(form);
        toast.success('Customer created successfully');
      }
      setModalOpen(false);
      refresh();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message ?? 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.customer) return;
    setDeleting(true);

    try {
      await customerService.delete(deleteDialog.customer.id);
      toast.success('Customer deleted');
      setDeleteDialog({ open: false, customer: null });
      refresh();
    } catch {
      toast.error('Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'badge-success',
      inactive: 'badge-danger',
      prospect: 'badge-info',
    };
    return <span className={map[status] ?? 'badge-gray'}>{status}</span>;
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row: Customer) => (
        <div>
          <p className="font-medium">{row.first_name} {row.last_name}</p>
          <p className="text-xs text-dark-light">{row.email ?? '—'}</p>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (row: Customer) => row.phone ?? '—' },
    { key: 'job_title', label: 'Job Title', render: (row: Customer) => row.job_title ?? '—' },
    { key: 'city', label: 'Location', render: (row: Customer) => [row.city, row.country].filter(Boolean).join(', ') || '—' },
    { key: 'status', label: 'Status', render: (row: Customer) => statusBadge(row.status) },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row: Customer) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/customers/${row.id}`)}
            className="p-1.5 text-info hover:bg-info-light rounded-lg transition-colors"
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, customer: row })}
            className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Customers</h1>
          <p className="text-dark-light text-sm mt-1">{total} customers total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <SearchBar onSearch={setSearch} placeholder="Search customers..." />
        </div>

        <Table
          columns={columns}
          data={items}
          loading={loading}
          emptyMessage="No customers found"
          currentPage={currentPage}
          lastPage={lastPage}
          total={total}
          onPageChange={setPage}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Job Title</label>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
                className="form-input"
              >
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="form-input"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingCustomer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, customer: null })}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteDialog.customer?.first_name} ${deleteDialog.customer?.last_name}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
