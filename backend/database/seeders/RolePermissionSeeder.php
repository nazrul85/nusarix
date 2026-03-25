<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = ['users', 'roles', 'permissions', 'customers', 'companies', 'leads', 'opportunities', 'tasks', 'activities'];
        $actions = ['view', 'create', 'edit', 'delete'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$action} {$module}", 'guard_name' => 'web']);
            }
        }

        // Admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // Manager role
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerPermissions = [];
        foreach (['customers', 'companies', 'leads', 'opportunities', 'tasks', 'activities'] as $module) {
            foreach (['view', 'create', 'edit'] as $action) {
                $managerPermissions[] = "{$action} {$module}";
            }
        }
        $managerRole->syncPermissions(Permission::whereIn('name', $managerPermissions)->get());

        // Staff role
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $staffRole->syncPermissions(
            Permission::where('name', 'like', 'view %')->get()
        );
    }
}
