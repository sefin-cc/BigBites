<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BranchController;

//Admin User Routes
Route::get('/admin', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('admin/login', [AdminController::class, 'login']);
Route::post('admin/register', [AdminController::class, 'register']);
Route::post('admin/logout', [AdminController::class, 'logout'])->middleware('auth:sanctum');


//Admin User Routes
Route::get('/client', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('client/login', [ClientController::class, 'login']);
Route::post('client/register', [ClientController::class, 'register']);
Route::post('client/logout', [ClientController::class, 'logout'])->middleware('auth:sanctum');

Route::prefix('branches')->group(function () {
    // Admin routes for managing branches
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/', [BranchController::class, 'store']); // Create a new branch
        Route::put('{id}', [BranchController::class, 'update']); // Update a specific branch
        Route::delete('{id}', [BranchController::class, 'destroy']); // Delete a specific branch
    });

    // Common routes for both Admins and Clients (view all branches, view specific branch)
    Route::get('/', [BranchController::class, 'index']); // View all branches
    Route::get('{id}', [BranchController::class, 'show']); // View a specific branch
});
