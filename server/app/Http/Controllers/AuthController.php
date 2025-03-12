<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);
        //Add user to the database
       $user = User::create($fields);

        //Create a token for the user
       $token = $user->createToken($request->name);

       return  [
            'user' => $user,
            'token' => $token->plainTextToken
       ];

    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        //grab the user, finds the user using the given email and return the array
        $user = User::where('email', $request->email)->first();

        //Check if the password entered matches the user's password in the database and If the user exist
        //if not, return the message
        if(!$user || !Hash::check($request->password, $user->password)){
            return[
                'errors' => ['email' => ['The provided credentials are incorrect.']]
            ];
        }
        //if correct, create a token
        $token = $user->createToken($user->name);

        return  [
             'user' => $user,
             'token' => $token->plainTextToken
        ];
    }

    public function logout(Request $request){
        //Delete all tokens if the user logout
        $request->user()->tokens()->delete();

        return[
            'message' => 'You are logged out.'
        ];
    }
}