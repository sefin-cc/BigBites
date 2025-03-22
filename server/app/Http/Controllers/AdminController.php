<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-admin-user', ['only' => ['index', 'show']]);
        $this->middleware('permission:create-admin-user', ['only' => ['register', 'store']]);
        $this->middleware('permission:edit-admin-user', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-admin-user', ['only' => ['destroy']]);
    }

    public function register(Request $request)
    {
        try {
            // Validate the input fields
            $fields = $request->validate([
                'name' => 'required|max:255',
                'email' => 'required|email|unique:admins',
                'phone' => 'required',
                'address' => 'required', 
                'branch' => 'required',
                'role' => 'required',
            ]);

            // Create a new admin in the database
            $admin = Admin::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'phone' => $fields['phone'],
                'address' => $fields['address'], 
                'branch' => $fields['branch'],
                'password' => bcrypt("password"),
            ]);


            $admin->assignRole($fields['role']);

            // Return the created admin and token as a JSON response
            return response()->json([
                'admin' => $admin
            ], 201); 
            
        } catch (ValidationException $e) {
            // If validation fails, return a custom JSON error response
            return response()->json([
                'errors' => $e->errors(),
            ], 422); 
        }
    }
    
public function login(Request $request)
{
        // Validate request data
        $validatedData = $request->validate([
            'email' => 'required|email|exists:admins,email',
            'password' => 'required|min:6',
        ]);

       
        if (!Auth::guard('admin')->attempt([
            'email' => $validatedData['email'],
            'password' => $validatedData['password']
        ])) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

      
        $request->session()->regenerate();

      
        $admin = Auth::guard('admin')->user();

      
        if (!$admin) {
            return response()->json(['error' => 'Authentication failed'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'admin' => $admin
        ]);

}
    
    

    public function logout(Request $request)
    {
        // Check if the user is authenticated before trying to logout
        if (Auth::guard('admin')->user()) {
            // Delete all tokens (only needed for API token auth)
            $request->user()->tokens()->delete();

            // Logout from the admin guard
            Auth::guard('admin')->logout();

            // Invalidate session and regenerate CSRF token
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Forget cookies to remove authentication state
            return response()->json(['message' => 'Logged out successfully'])
                ->withCookie(cookie()->forget('XSRF-TOKEN'))
                ->withCookie(cookie()->forget('laravel_session'));
        }

        return response()->json(['message' => 'User not authenticated'], 401);
    }

    // Show all admins
    public function index()
    {
        // Fetch all admins from the database
        $admins = Admin::with('roles')->get();
        return response()->json($admins);
    }

   

    public function show($id)
    {
        // Find the admin by ID and eager load their roles
        $admin = Admin::with('roles')->find($id);
    
        // If the admin doesn't exist, return an error
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }
    
        // Return the admin along with their roles
        return response()->json($admin);
    }
    
    // Update an existing admin
    public function update(Request $request, $id)
    {
        // Find the admin by ID
        $admin = Admin::find($id);

        // If the admin doesn't exist, return an error
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        // Validate the input fields
        $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:admins,email,' . $id,
            'phone' => 'required',
            'address' => 'required', 
            'branch' => 'required',
            'role' => 'required',
        ]);

        // Update the admin's information
        $admin->update($request->all());

        // Return the updated admin as a JSON response
        return response()->json($admin);
    }

    // Delete a specific admin
    public function destroy($id)
    {
        // Find the admin by ID
        $admin = Admin::find($id);

        // If the admin doesn't exist, return an error
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }
        // Abort if user is Administrator or User ID belongs to Auth User
        if ($admin->hasRole('Administrator') || $admin->id == Auth::user()->id)
        {
            abort(403, 'USER DOES NOT HAVE THE RIGHT PERMISSIONS');
        }

        $admin->syncRoles([]);
        // Delete the admin
        $admin->delete();

        // Return a success message
        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
