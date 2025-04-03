<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-client-user', ['only' => ['index', 'show']]);
        $this->middleware('permission:create-client-user', ['only' => [ 'store']]);
        $this->middleware('permission:edit-client-user', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-client-user', ['only' => ['destroy']]);
    }

    // Register a new client
    public function register(Request $request)
    {
        try {
            // Validate the input fields
            $fields = $request->validate([
                'name' => 'required|max:255',
                'email' => 'required|email|unique:clients',
                'password' => 'required|confirmed',
                'phone' => 'required',
                'address' => 'required'
            ]);

            // Create a new client in the database
            $client = Client::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
                'phone' => $fields['phone'],
                'address' => $fields['address']
            ]);
            $client->assignRole("Customer");
            // Create a token for the client
            $token = $client->createToken('ClientToken')->plainTextToken;


            return response()->json([
                'client' => $client,
                'token' => $token
            ]);

            // Return the created client and token as a JSON response
           
        } catch (ValidationException $e) {
            // If validation fails, return a custom JSON error response
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }
    }

    // Login an existing client
   // Login an existing client
public function login(Request $request)
{
    try {
        $request->validate([
            'email' => 'required|email|exists:clients',
            'password' => 'required|min:6',
        ]);
    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
        ], 422);
    }

    $client = Client::where('email', $request->email)->first();

    if (!$client || !Hash::check($request->password, $client->password)) {
        return response()->json([
            'email' => ['The provided credentials are incorrect.'],
        ], 401);
    }

    // Create a token for the client
    $token = $client->createToken('ClientToken')->plainTextToken;

    // Store token in an HTTP-only cookie
    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'client' => $client
    ]);
}


    // Logout the client by deleting their token
    public function logout(Request $request)
    {
        // Delete all tokens for the authenticated user to log them out
        $request->user()->tokens()->delete();
    
        return response()->json([
            'message' => 'You have been logged out successfully.',
        ]);
    }
    

    // Show all clients (index)
    public function index()
    {
        // Fetch all clients from the database
        $clients = Client::all();
        return response()->json($clients);
    }

 
    // Show a specific client by ID (show)
    public function show($id)
    {
        // Find the client by ID
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['error' => 'Client not found'], 404);
        }

        return response()->json($client);
    }

    // Update an existing client (update)
    public function update(Request $request, $id)
    {
        $user = Auth::user()->id;
        if ((int)$id !== (int)$user) {
            return response()->json(['error' => "Access denied"], 403); 
        }

        // Find the client by ID
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['error' => 'Client not found'], 404);
        }

        // Validate incoming request data
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:clients,email,' . $id,
            'password' => 'nullable|confirmed',
            'phone' => 'required',
            'address' => 'required'
        ]);

        // Update client information
        $client->update($fields);

        return response()->json($client); // Return the updated client
    }

    // Delete a client (destroy)
    public function destroy($id)
    {
        $user = Auth::user()->id;
        if ((int)$id !== (int)$user) {
            return response()->json(['error' => "Access denied"], 403); 
        }
        
        // Find the client by ID
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['error' => 'Client not found'], 404);
        }

        // Delete the client
        $client->delete();

        return response()->json(['message' => 'Client deleted successfully']);
    }

    
    public function updateFavourites(Request $request, $id)
    {
        // Find the admin by ID
        $admin = Client::find($id);
    
        // Ensure the admin exists
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }
    
        // Check if the authenticated user is updating their own information
        if ($admin->id !== Auth::user()->id) {
            abort(403, 'USER DOES NOT HAVE THE RIGHT PERMISSIONS');
        }
    
        // Validate the input fields
        $request->validate([
            'favourites' => 'nullable|array',
        ]);
    
        // Update the admin's information
        $admin->update($request->only(['favourites']));
    
        // Return the updated admin as a JSON response
        return response()->json($admin);
    }
}
