<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

class PromoController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all actions except 'index' and 'show'
        $this->middleware('permission:view-promo|create-promo|edit-promo|delete-promo', ['except' => ['index', 'show']]);
        $this->middleware('permission:create-promo', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit-promo', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-promo', ['only' => ['destroy']]);
    }

    public function index()
    {
        // Fetch all promos
        $promos = Promo::all();

        // Return the promos as JSON
        return response()->json($promos);
    }

    public function show($id)
    {
        // Find the promo by ID
        $promo = Promo::find($id);

        // If the promo doesn't exist, return an error response
        if (!$promo) {
            return response()->json(['error' => 'Promo not found'], 404);
        }

        // Return the promo as JSON
        return response()->json($promo);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validated = $request->validate([
                'label' => 'required|string|max:255',
                'image' => 'required|string|max:255',
            ]);

            // Create a new promo entry in the database
            $promo = Promo::create($validated);

            // Return the newly created promo as JSON
            return response()->json($promo, 201); // 201 Created
        } catch (ValidationException $e) {
            // If validation fails, return the error messages as JSON
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors(),
            ], 422); // 422 Unprocessable Entity
        }
    }

    public function update(Request $request, $id)
    {
        // Find the promo by ID
        $promo = Promo::find($id);

        // If the promo doesn't exist, return an error response
        if (!$promo) {
            return response()->json(['error' => 'Promo not found'], 404);
        }

        try {
            // Validate incoming request data
            $validated = $request->validate([
                'label' => 'required|string|max:255',
                'image' => 'required|string|max:255',
            ]);

            // Update the promo with the validated data
            $promo->update($validated);

            // Return the updated promo as JSON
            return response()->json($promo);
        } catch (ValidationException $e) {
            // If validation fails, return the error messages as JSON
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors(),
            ], 422); // 422 Unprocessable Entity
        }
    }

    public function destroy($id)
    {
        // Find the promo by ID
        $promo = Promo::find($id);

        // If the promo doesn't exist, return an error response
        if (!$promo) {
            return response()->json(['error' => 'Promo not found'], 404);
        }

        // Delete the promo
        $promo->delete();

        // Return a success response
        return response()->json(['message' => 'Promo deleted successfully']);
    }
}
