<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions for different guards
        $adminPermissions = [
            'view-role',
            'create-role',
            'edit-role',
            'delete-role',

            'view-admin-user',
            'create-admin-user',
            'edit-admin-user',
            'delete-admin-user',

            'view-branch',
            'create-branch',
            'edit-branch',
            'delete-branch',

            'view-promo',
            'create-promo',
            'edit-promo',
            'delete-promo',

            'view-menu',
            'create-menu',
            'edit-menu',
            'delete-menu',

            'view-client-user',
            'create-client-user',
            'edit-client-user',
            'delete-client-user',

            'view-order',
            'create-order',
            'edit-order',
            'delete-order',
        ];

        $clientPermissions = [
            'view-branch',
            'view-promo',
            'view-menu',
            
            'view-client-user',
            'create-client-user',
            'edit-client-user',
            'delete-client-user',

            'view-order',
            'create-order',
            'edit-order',
            'delete-order',
        ];

        // Insert permissions with 'admin' guard
        foreach ($adminPermissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'admin']);
        }

        // Insert permissions with 'client' guard
        foreach ($clientPermissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'client']);
        }

    }
}
