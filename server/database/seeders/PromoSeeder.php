<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Promo;

class PromoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Create a few promo entries
         Promo::create([
            'label' => 'App Exclusive',
            'image' => 'https://phmenu.net/wp-content/uploads/2024/01/promo-1024x683.webp'
        ]);
    }
}
