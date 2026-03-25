<?php

namespace App\Services;

use App\Models\Customer;

class CustomerService
{
    public function paginate(array $params): mixed
    {
        return Customer::query()
            ->when($params['search'] ?? null, fn($q) => $q
                ->where('first_name', 'like', "%{$params['search']}%")
                ->orWhere('last_name', 'like', "%{$params['search']}%")
                ->orWhere('email', 'like', "%{$params['search']}%"))
            ->when($params['status'] ?? null, fn($q) => $q->where('status', $params['status']))
            ->with('company')
            ->latest()
            ->paginate($params['per_page'] ?? 15);
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer->fresh()->load('company');
    }

    public function delete(Customer $customer): void
    {
        $customer->delete();
    }

    public function format(Customer $customer): Customer
    {
        return $customer->load(['company', 'leads', 'opportunities']);
    }
}
