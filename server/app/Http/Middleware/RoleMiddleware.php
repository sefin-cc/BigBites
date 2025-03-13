<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $roles)
    {
        // If $roles is a string, convert it to an array
        $roles = is_array($roles) ? $roles : explode(',', $roles);
    
        // Check if the authenticated user exists and has one of the required roles
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
    
        return $next($request);
    }
    
}
