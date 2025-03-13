<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run()
    {
        Branch::create([
            'branchName' => 'SM DAGUPAN CITY',
            'province' => 'Pangasinan',
            'city' => 'Dagupan',
            'fullAddress' => 'M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan',
            'openingTime' => '07:00',
            'closingTime' => '23:00',
            'acceptAdvancedOrder' => false,
        ]);

        Branch::create([
            'branchName' => 'SM CITY URDANETA',
            'province' => 'Pangasinan',
            'city' => 'Urdaneta',
            'fullAddress' => '2nd St, Urdaneta, Pangasinan',
            'openingTime' => '07:00',
            'closingTime' => '23:00',
            'acceptAdvancedOrder' => false,
        ]);

        Branch::create([
            'branchName' => 'CITYMALL SAN CARLOS',
            'province' => 'Pangasinan',
            'city' => 'San Carlos',
            'fullAddress' => 'Bugallon St, cor Posadas St, San Carlos City, Pangasinan',
            'openingTime' => '07:00',
            'closingTime' => '23:00',
            'acceptAdvancedOrder' => false,
        ]);

        Branch::create([
            'branchName' => 'ROBINSONS PLACE LA UNION',
            'province' => 'La Union',
            'city' => 'San Fernando',
            'fullAddress' => 'Brgy, MacArthur Hwy, San Fernando, La Union',
            'openingTime' => '07:00',
            'closingTime' => '23:00',
            'acceptAdvancedOrder' => true,
        ]);
    }
}
