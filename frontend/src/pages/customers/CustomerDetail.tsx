import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    customerService.get(Number(id))
      .then((res) => setCustomer(res.data.data))
      .catch(() => navigate('/customers'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark">
            {customer.first_name} {customer.last_name}
          </h1>
          <p className="text-dark-light text-sm">{customer.job_title ?? 'Customer'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-4">
          <h2 className="font-semibold text-dark">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark-light">Email</p>
              <p className="text-dark font-medium">{customer.email ?? '—'}</p>
            </div>
            <div>
              <p className="text-dark-light">Phone</p>
              <p className="text-dark font-medium">{customer.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-dark-light">City</p>
              <p className="text-dark font-medium">{customer.city ?? '—'}</p>
            </div>
            <div>
              <p className="text-dark-light">Country</p>
              <p className="text-dark font-medium">{customer.country ?? '—'}</p>
            </div>
            <div>
              <p className="text-dark-light">Status</p>
              <span className={`badge ${customer.status === 'active' ? 'badge-success' : customer.status === 'inactive' ? 'badge-danger' : 'badge-info'}`}>
                {customer.status}
              </span>
            </div>
          </div>
          {customer.notes && (
            <div>
              <p className="text-dark-light text-sm mb-1">Notes</p>
              <p className="text-dark text-sm bg-gray-50 p-3 rounded-lg">{customer.notes}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-dark mb-4">Timeline</h2>
          <p className="text-sm text-dark-light">
            Created {new Date(customer.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
