<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function paginate(array $params): mixed
    {
        return User::query()
            ->when($params['search'] ?? null, fn($q) => $q->where('name', 'like', "%{$params['search']}%")
                ->orWhere('email', 'like', "%{$params['search']}%"))
            ->with('roles')
            ->latest()
            ->paginate($params['per_page'] ?? 15);
    }

    public function create(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (!empty($data['role'])) {
            $user->assignRole($data['role']);
        }

        return $this->format($user);
    }

    public function update(User $user, array $data): array
    {
        $update = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (!empty($data['password'])) {
            $update['password'] = Hash::make($data['password']);
        }

        $user->update($update);

        return $this->format($user->fresh());
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    public function format(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
