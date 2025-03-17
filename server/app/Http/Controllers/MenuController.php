<?php

namespace App\Http\Controllers;

use App\Models\Category;
namespace App\Http\Controllers;
use App\Models\Category;

class MenuController extends Controller
{

    public function index()
    {
        $categories = Category::with('subCategories.items.addOns')->get();

        return response()->json($categories);
    }

}
