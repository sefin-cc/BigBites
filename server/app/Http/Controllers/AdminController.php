<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
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
                'role' => $fields['role'],
                'password' => bcrypt("password"),
            ]);

            // Create a token for the admin
            $token = $admin->createToken('AdminApp')->plainTextToken;

            // Return the created admin and token as a JSON response
            return response()->json([
                'admin' => $admin,
                'token' => $token,
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
        // Validate the input fields
        try {
            $request->validate([
                'email' => 'required|email|exists:admins',
                'password' => 'required|min:6',
            ]);
        } catch (ValidationException $e) {
            // If validation fails, return a JSON response with errors
            return response()->json([
                'errors' => $e->errors(),
            ], 422); 
        }

        // Find the admin by email
        $admin = Admin::where('email', $request->email)->first();

        // Check if the admin exists and the password is correct
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'error' => 'The provided credentials are incorrect.',
            ], 401);
        }

        // Create a token for the admin
        $token = $admin->createToken('AdminApp')->plainTextToken;

        // Return the token and admin details as a JSON response
        return response()->json([
            'token' => $token,
            'admin' => $admin,
        ], 200); 
    }

    public function logout(Request $request)
    {
        // Delete all tokens for the admin upon logout
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'You have been logged out successfully.',
        ]);
    }
}
