<?php

namespace App\Http\Controllers;

use App\Models\Admin; // Import the Admin model
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Exception;  

class RolesController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-role', ['only' => ['index', 'show']]);
        $this->middleware('permission:create-role', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit-role', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete-role', ['only' => ['destroy']]);
    }

    // Show all roles
    public function index()
    {
        try {
            $roles = Role::all();
            return response()->json($roles);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve roles.', 'message' => $e->getMessage()], 500);
        }
    }

    // Store a newly created role in the database
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|unique:roles,name|max:255',
                'guard_name' => 'required|string|in:admin,user,client', 
            ]);

            $role = Role::create([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);

          $permissions = Permission::whereIn('id', $request->permissions ?? [])->get(['name'])->toArray(); 

            // Check if permissions is not empty before calling syncPermissions
            if (!empty($permissions)) {
                $role->syncPermissions($permissions);
            }


            return response()->json(['message' => 'Role created successfully!', 'role' => $role], 201); // 201 for created
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create role.', 'message' => $e->getMessage()], 500);
        }
    }

    // Show the details of an existing role
    public function show(Role $role)
    {
        try {
            return response()->json($role);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve role details.', 'message' => $e->getMessage()], 500);
        }
    }

    // Update an existing role in the database
    public function update(Request $request, Role $role)
    {
        try {
            $request->validate([
                'name' => 'required|unique:roles,name,' . $role->id . '|max:255',
                'guard_name' => 'required|string|in:admin,user,client', 
            ]);

            // Prevent editing of the 'Administrator' role
            if ($role->name == 'Administrator') {
                return response()->json(['error' => 'ADMINISTRATOR ROLE CAN NOT BE EDITED'], 403);
            }

            $role->update([
                'name' => $request->name,
                'guard_name' => $request->guard_name,
            ]);

            // Ensure that $request->permissions is an array
            $permissions = Permission::whereIn('id', $request->permissions ?? [])->get(['name'])->toArray(); 

            // Check if permissions is not empty before calling syncPermissions
            if (!empty($permissions)) {
                $role->syncPermissions($permissions);
            }
            return response()->json(['message' => 'Role updated successfully!', 'role' => $role]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update role.', 'message' => $e->getMessage()], 500);
        }
    }

    // Delete a role
    public function destroy(Role $role)
    {
        try {
            $user = Admin::findOrFail(Auth::user()->id);

            // Check if the role exists in the database
            if (!$role) {
                return response()->json(['error' => 'Role not found'], 404);
            }

            // Check if the authenticated admin has the specified role
            if ($user->hasRole($role->name)) {
                return response()->json(['error' => 'CAN NOT DELETE SELF ASSIGNED ROLE'], 403);
            }

            // Prevent deleting the "Super Admin" role
            if ($role->name == 'Administrator') {
                return response()->json(['error' => 'ADMINISTRATOR ROLE CAN NOT BE DELETED'], 403);
            }

            // Proceed with deleting the role
            $role->delete();

            return response()->json([
                'message' => 'Role deleted successfully.'
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete role.', 'message' => $e->getMessage()], 500);
        }
    }
}
