import { useCallback, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { userService } from '../../services/userService';
import { usePagination } from '../../hooks/usePagination';
import { User } from '../../types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback((params: Record<string, unknown>) => userService.list(params), []);
  const { items, loading, currentPage, lastPage, total, setPage, setSearch, refresh } = usePagination<User>(fetchUsers);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', password_confirmation: '', role: '' });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', password_confirmation: '', role: user.roles?.[0] ?? '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await userService.update(editingUser.id, form);
        toast.success('User updated');
      } else {
        await userService.create(form);
        toast.success('User created');
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
    if (!deleteDialog.user) return;
    setDeleting(true);
    try {
      await userService.delete(deleteDialog.user.id);
      toast.success('User deleted');
      setDeleteDialog({ open: false, user: null });
      refresh();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name', label: 'User',
      render: (row: User) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-dark-light">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'roles', label: 'Roles',
      render: (row: User) => (
        <div className="flex flex-wrap gap-1">
          {row.roles?.map((role) => (
            <span key={role} className="badge-gray capitalize">{role}</span>
          ))}
        </div>
      ),
    },
    {
      key: 'email_verified_at', label: 'Verified',
      render: (row: User) => (
        <span className={row.email_verified_at ? 'badge-success' : 'badge-warning'}>
          {row.email_verified_at ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', className: 'text-right',
      render: (row: User) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteDialog({ open: true, user: row })} className="p-1.5 text-danger hover:bg-danger-light rounded-lg transition-colors">
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
          <h1 className="text-2xl font-bold text-dark">Users</h1>
          <p className="text-dark-light text-sm mt-1">{total} users total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="card">
        <div className="mb-4"><SearchBar onSearch={setSearch} placeholder="Search users..." /></div>
        <Table columns={columns} data={items} loading={loading} currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">{editingUser ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-input" required={!editingUser} />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className="form-input" />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-input">
              <option value="">No role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingUser ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })} onConfirm={handleDelete} title="Delete User" message={`Delete ${deleteDialog.user?.name}?`} loading={deleting} />
    </div>
  );
}
