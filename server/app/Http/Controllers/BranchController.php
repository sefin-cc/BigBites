<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;  

class BranchController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all actions except 'index' and 'show'
        $this->middleware('permission:view-branch|create-branch|edit-branch|delete-branch', ['except' => ['index', 'show']]);
        $this->middleware('permission:create-branch', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit-branch', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-branch', ['only' => ['destroy']]);
    }

    // View all branches
    public function index()
    {
        // Fetch all branches from the database
        $branches = Branch::all();
        return response()->json($branches);
    }

    // Create a new branch
    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'branchName' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'fullAddress' => 'required|string',
            'openingTime' => 'required|date_format:H:i',
            'closingTime' => 'required|date_format:H:i',
            'acceptAdvancedOrder' => 'required|boolean',
        ]);

        // Create a new branch
        $branch = Branch::create($request->all());

        // Return the newly created branch as a JSON response
        return response()->json($branch, 201); // 201 is for created
    }

    // View a specific branch by ID
    public function show($id)
    {
        // Find the branch by ID
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        // Return the branch as a JSON response
        return response()->json($branch);
    }

    // Update a specific branch
    public function update(Request $request, $id)
    {
        // Find the branch by ID
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        // Validate incoming request data
        $request->validate([
            'branchName' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'fullAddress' => 'required|string',
            'openingTime' => 'required|date_format:H:i',
            'closingTime' => 'required|date_format:H:i',
            'acceptAdvancedOrder' => 'required|boolean',
        ]);

        // Update the branch with the new data
        $branch->update($request->all());

        // Return the updated branch as a JSON response
        return response()->json($branch);
    }

    // Delete a specific branch
    public function destroy($id)
    {
        // Find the branch by ID
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['error' => 'Branch not found'], 404);
        }

        // Delete the branch
        $branch->delete();

        // Return a success message
        return response()->json(['message' => 'Branch deleted successfully']);
    }
}
