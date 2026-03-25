<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function paginate(array $params): mixed
    {
        return Permission::query()
            ->when($params['search'] ?? null, fn($q) => $q->where('name', 'like', "%{$params['search']}%"))
            ->latest()
            ->paginate($params['per_page'] ?? 15);
    }

    public function create(array $data): array
    {
        $permission = Permission::create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        return $this->format($permission);
    }

    public function update(Permission $permission, array $data): array
    {
        $permission->update(['name' => $data['name']]);

        return $this->format($permission->fresh());
    }

    public function delete(Permission $permission): void
    {
        $permission->delete();
    }

    public function format(Permission $permission): array
    {
        return [
            'id' => $permission->id,
            'name' => $permission->name,
            'guard_name' => $permission->guard_name,
            'created_at' => $permission->created_at,
            'updated_at' => $permission->updated_at,
        ];
    }
}
