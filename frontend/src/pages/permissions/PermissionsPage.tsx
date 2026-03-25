import { useCallback, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { permissionService } from '../../services/permissionService';
import { usePagination } from '../../hooks/usePagination';
import { Permission } from '../../types';
import toast from 'react-hot-toast';

export default function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; permission: Permission | null }>({ open: false, permission: null });
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPermissions = useCallback((params: Record<string, unknown>) => permissionService.list(params), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch, refresh } = usePagination<Permission>(fetchPermissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await permissionService.create(form); toast.success('Permission created'); setModalOpen(false); refresh(); }
    catch { toast.error('Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.permission) return;
    setDeleting(true);
    try { await permissionService.delete(deleteDialog.permission.id); toast.success('Permission deleted'); setDeleteDialog({ open: false, permission: null }); refresh(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row: Permission) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{row.name}</code> },
    { key: 'guard_name', label: 'Guard', render: (row: Permission) => <span className="badge-gray">{row.guard_name}</span> },
    {
      key: 'actions', label: 'Actions', className: 'text-right',
      render: (row: Permission) => (
        <button onClick={() => setDeleteDialog({ open: true, permission: row })} className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Permissions</h1><p className="text-dark-light text-sm mt-1">{total} permissions total</p></div>
        <button onClick={() => { setForm({ name: '' }); setModalOpen(true); }} className="btn-primary"><PlusIcon className="w-4 h-4" /> Add Permission</button>
      </div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search permissions..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Permission" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="form-label">Permission Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value })} className="form-input" required placeholder="e.g. view customers" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, permission: null })} onConfirm={handleDelete} title="Delete Permission" message={`Delete "${deleteDialog.permission?.name}"?`} loading={deleting} />
    </div>
  );
}
