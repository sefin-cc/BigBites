<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin::factory()->count(10)->create();

               // Creating Super Admin User
            $admin = Admin::create([
                'name' => 'Rogena Tibegar', 
                'email' => 'rogena@gmail.com',
                'phone' => '09323232323',
                'address' => 'Mangaldan, Pangasinan',
                'branch' => 'SM DAGUPAN CITY',
                'image' => null,
                'password' => Hash::make('password')
            ]);
            $admin->assignRole('Administrator');
    
            // Creating Admin User
            $manager = Admin::create([
                'name' => 'Noel', 
                'email' => 'noel@gmail.com',
                'phone' => '09323232323',
                'address' => 'Mangaldan, Pangasinan',
                'branch' => 'SM DAGUPAN CITY',
                'image' => null,
                'password' => Hash::make('password')
            ]);
            $manager->assignRole('Manager');
    
            // Creating Product Manager User
            $staff = Admin::create([
                'name' => 'Catalin Muqeet', 
                'email' => 'cat@gmail.com',
                'phone' => '09323232323',
                'address' => 'Mangaldan, Pangasinan',
                'branch' => 'SM DAGUPAN CITY',
                'image' => null,
                'password' => Hash::make('password')
            ]);
            $staff->assignRole('Staff');
    

        
    }
}
