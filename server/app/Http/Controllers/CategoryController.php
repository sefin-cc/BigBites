<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Routing\Controller;

class CategoryController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all actions except 'index' and 'show'
        $this->middleware('permission:view-menu|create-menu|edit-menu|delete-menu', ['except' => ['index', 'show']]);
        $this->middleware('permission:create-menu', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit-menu', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-menu', ['only' => ['destroy']]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    public function index()
    {
        $categories = Category::all();

        return response()->json($categories);
    }

    public function show($id)
    {
        $category = Category::all($id);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'category' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
