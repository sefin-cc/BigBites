<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = Category::create(['category' => 'BURGERS']);

        $subCategory1 = $category->subCategories()->create(['label' => 'JR BURGERS']);
        $subCategory2 = $category->subCategories()->create(['label' => 'MONSTER BURGERS']);

        $item1 = $subCategory1->items()->create([
            'label' => 'AFORDA JR',
            'full_label' => 'AFORDA JR BURGER',
            'description' => 'Lorem ipsum dolor sit amet...',
            'price' => 99.00,
            'time' => '15mins',
            'image' => '',
        ]);

        $item2 = $subCategory2->items()->create([
            'label' => 'BIGBOY BEEF',
            'full_label' => 'BIGBOY BEEF BURGER',
            'description' => 'Lorem ipsum dolor sit amet...',
            'price' => 299.00,
            'time' => '30mins',
            'image' => '',
        ]);

        // Add-ons for item1
        $item1->addOns()->create(['label' => 'EXTRA SAUCE', 'price' => 5]);

        // Add-ons for item2
        $item2->addOns()->create(['label' => 'EXTRA CHEESE', 'price' => 10]);
        $item2->addOns()->create(['label' => 'GUACAMOLE', 'price' => 15]);
    }
}
