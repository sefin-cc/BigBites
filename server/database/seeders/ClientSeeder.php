<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Client::factory()->count(10)->create();
                    // Creating Application User
        $customer = Client::create([
            'name' => 'John Dont', 
            'email' => 'john@gmail.com',
            'password' => Hash::make('password'),
            'phone' => '095656565656',
            'address' => 'Dagupan City, Pangasinan',
            'favourites' => ''
        ]);
        $customer->assignRole('Customer');
    }
}
