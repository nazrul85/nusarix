<?php

namespace App\Services;

use Spatie\Permission\Models\Role;

class RoleService
{
    public function paginate(array $params): mixed
    {
        return Role::query()
            ->when($params['search'] ?? null, fn($q) => $q->where('name', 'like', "%{$params['search']}%"))
            ->with('permissions')
            ->latest()
            ->paginate($params['per_page'] ?? 15);
    }

    public function create(array $data): array
    {
        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $this->format($role);
    }

    public function update(Role $role, array $data): array
    {
        $role->update([
            'name' => $data['name'],
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $this->format($role->fresh()->load('permissions'));
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }

    public function format(Role $role): array
    {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'permissions' => $role->permissions->pluck('name'),
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ];
    }
}
