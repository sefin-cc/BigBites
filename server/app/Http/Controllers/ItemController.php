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
        $item =  Item::with('addOns')->find($id); 

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
            'sub_category_id' => 'required|exists:sub_categories,id',
            'label' => 'required|string|max:255',
            'full_label' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0', 
            'time' => 'required|string|max:50', 
            'image' => 'nullable|string',

            'add_ons' => 'nullable|array', 
            'add_ons.*.label' => 'required|string|max:255', 
            'add_ons.*.price' => 'required|numeric|min:0', 
        ]);

        $item->update($validated);

        // Update or Create Add-ons
        if ($request->has('add_ons')) {
            foreach ($request->add_ons as $addon) {
                $item->addOns()->create([
                    'label' => $addon['label'],
                    'price' => $addon['price']
                ]);
            }
        }

        return  response()->json($item->load('addOns'));
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
