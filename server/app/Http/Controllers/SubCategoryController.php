<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubCategory;
use Illuminate\Routing\Controller;

class SubCategoryController extends Controller
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
            'category_id' => 'required|exists:categories,id',
            'label' => 'required|string|max:255',
        ]);

        $subCategory = SubCategory::create($validated);

        return response()->json($subCategory, 201);
    }

    public function index()
    {
        $subCategories = SubCategory::all();

        return response()->json($subCategories);
    }

    public function show($id)
    {
        $subCategory = SubCategory::find($id);

        if (!$subCategory) {
            return response()->json(['error' => 'SubCategory not found'], 404);
        }

        return response()->json($subCategory);
    }

    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::find($id);

        if (!$subCategory) {
            return response()->json(['error' => 'SubCategory not found'], 404);
        }

        // Validate request data, including category_id
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id', 
        ]);

        // Update both fields
        $subCategory->update($validated);

        return response()->json($subCategory);
    }

    public function destroy($id)
    {
        $subCategory = SubCategory::find($id);

        if (!$subCategory) {
            return response()->json(['error' => 'SubCategory not found'], 404);
        }

        $subCategory->delete();

        return response()->json(['message' => 'SubCategory deleted successfully']);
    }
}
