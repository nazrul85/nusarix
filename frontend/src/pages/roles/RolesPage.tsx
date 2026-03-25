import { useCallback, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { roleService } from '../../services/roleService';
import { usePagination } from '../../hooks/usePagination';
import { Role } from '../../types';
import toast from 'react-hot-toast';

export default function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; role: Role | null }>({ open: false, role: null });
  const [form, setForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = useCallback((params: Record<string, unknown>) => roleService.list(params), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch, refresh } = usePagination<Role>(fetchRoles);

  const openCreate = () => { setEditingRole(null); setForm({ name: '' }); setModalOpen(true); };
  const openEdit = (role: Role) => { setEditingRole(role); setForm({ name: role.name }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingRole) { await roleService.update(editingRole.id, form); toast.success('Role updated'); }
      else { await roleService.create(form); toast.success('Role created'); }
      setModalOpen(false); refresh();
    } catch { toast.error('Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.role) return;
    setDeleting(true);
    try { await roleService.delete(deleteDialog.role.id); toast.success('Role deleted'); setDeleteDialog({ open: false, role: null }); refresh(); }
    catch { toast.error('Failed to delete role'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row: Role) => <span className="font-medium capitalize">{row.name}</span> },
    {
      key: 'permissions', label: 'Permissions',
      render: (row: Role) => <span className="badge-gray">{row.permissions?.length ?? 0} permissions</span>,
    },
    {
      key: 'actions', label: 'Actions', className: 'text-right',
      render: (row: Role) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors"><PencilIcon className="w-4 h-4" /></button>
          <button onClick={() => setDeleteDialog({ open: true, role: row })} className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-dark">Roles</h1><p className="text-dark-light text-sm mt-1">{total} roles total</p></div>
        <button onClick={openCreate} className="btn-primary"><PlusIcon className="w-4 h-4" /> Add Role</button>
      </div>
      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search roles..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingRole ? 'Edit Role' : 'Add Role'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="form-label">Role Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value })} className="form-input" required placeholder="e.g. manager" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingRole ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, role: null })} onConfirm={handleDelete} title="Delete Role" message={`Delete role "${deleteDialog.role?.name}"?`} loading={deleting} />
    </div>
  );
}
