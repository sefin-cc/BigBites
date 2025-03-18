<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AddOn;
use Exception;  
use Illuminate\Routing\Controller;

class AddOnController extends Controller
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
        try{
             // Validate the incoming request data
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'label' => 'required|string|max:255',
            'price' => 'required|numeric',
        ]);


        // If validation passes, create the AddOn
        $addOn = AddOn::create($validated);

        // Return the created AddOn as a JSON response
        return response()->json($addOn, 201);

        }catch(Exception $e){
            return response()->json(['error' => 'Failed to create AddOn.', 'message' => $e->getMessage()], 500);
        }
       
    }

    public function index()
    {
        // Fetch all AddOns from the database
        $addOns = AddOn::all();

        // Return all AddOns as a JSON response
        return response()->json($addOns);
    }

    public function show($id)
    {
        // Find AddOn by ID
        $addOn = AddOn::find($id);

        // Check if AddOn exists, otherwise return a 404 error
        if (!$addOn) {
            return response()->json(['error' => 'AddOn not found'], 404);
        }

        // Return the found AddOn as a JSON response
        return response()->json($addOn);
    }

    public function update(Request $request, $id)
    {
        // Find the AddOn by ID
        $addOn = AddOn::find($id);

        // If AddOn not found, return a 404 error
        if (!$addOn) {
            return response()->json(['error' => 'AddOn not found'], 404);
        }

        // Validate the incoming request data
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'price' => 'required|numeric',
        ]);

        // Update the AddOn with validated data
        $addOn->update($validated);

        // Return the updated AddOn as a JSON response
        return response()->json($addOn);
    }

    public function destroy($id)
    {
        // Find the AddOn by ID
        $addOn = AddOn::find($id);

        // If AddOn not found, return a 404 error
        if (!$addOn) {
            return response()->json(['error' => 'AddOn not found'], 404);
        }

        // Delete the AddOn
        $addOn->delete();

        // Return a success message as JSON response
        return response()->json(['message' => 'AddOn deleted successfully']);
    }

    
}
