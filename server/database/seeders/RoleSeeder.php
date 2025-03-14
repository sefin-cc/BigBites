<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles and assign permissions

        // Administrator role
        $admin = Role::create(['name' => 'Administrator', 'guard_name' => 'admin']);

        // Assign both admin and client permissions to the admin role
        $admin->givePermissionTo([
            // Admin permissions
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

            // Client permissions for admin role
            'view-client-user',
            'create-client-user',
            'edit-client-user',
            'delete-client-user',
            'view-order',
            'create-order',
            'edit-order',
            'delete-order',
        ]);

        // Manager role
        $manager = Role::create(['name' => 'Manager', 'guard_name' => 'admin']);
        $manager->givePermissionTo([
            'view-role',
            'view-admin-user',
            'create-admin-user',
            'edit-admin-user',
            'delete-admin-user',
            'view-branch',
            'view-promo',
            'view-menu',
            'view-client-user',
            'view-order',
            'edit-order',
            'delete-order',
        ]);

        // Staff role
        $staff = Role::create(['name' => 'Staff', 'guard_name' => 'admin']);
        $staff->givePermissionTo([
            'view-role',
            'view-admin-user',
            'view-client-user',
            'view-order',
            'edit-order',
            'view-branch',
            'view-promo',
            'view-menu',
        ]);

        // Customer role
        $customer = Role::create(['name' => 'Customer', 'guard_name' => 'client']);
        $customer->givePermissionTo([
            'view-menu',
            'view-promo',
            'view-branch',
            'view-client-user',
            'create-client-user',
            'edit-client-user',
            'delete-client-user',
            'view-order',
            'create-order',
            'edit-order',
            'delete-order',
        ]);
    }
}
