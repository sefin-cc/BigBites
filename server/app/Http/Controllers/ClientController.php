<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ClientController extends Controller
{
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

            // Create a new admin in the database
            $admin = Client::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
                'phone' => $fields['phone'],
                'address' => $fields['address']
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
        try{
            $request->validate([
                'email' => 'required|email|exists:clients',
                'password' => 'required|min:6',
            ]);
        }catch (ValidationException $e) {
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

        // Create a token or session for client login
        $token = $client->createToken('ClientToken')->plainTextToken;

        return response()->json(['token' => $token, 'client' => $client], 200);
    }

    public function logout(Request $request)
    {
        // Delete all tokens for the client upon logout
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'You have been logged out successfully.',
        ]);
    }
}
