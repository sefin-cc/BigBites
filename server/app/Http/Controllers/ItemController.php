<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use Illuminate\Routing\Controller;

class ItemController extends Controller
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
            'sub_category_id' => 'required|exists:sub_categories,id',
            'label' => 'required|string|max:255',
            'full_label' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'time' => 'required|string',
            'image' => 'nullable|string',
        ]);

        $item = Item::create($validated);

        return response()->json($item, 201);
    }

    public function index()
    {
        $items = Item::all();

        return response()->json($items);
    }

    public function show($id)
    {
        $item = Item::all($id);

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'full_label' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'time' => 'required|string',
            'image' => 'nullable|string',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }
}
