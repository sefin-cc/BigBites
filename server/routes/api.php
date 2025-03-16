<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\PromoController;

//Admin User Routes
// Admin User Routes
Route::post('admin/login', [AdminController::class, 'login']);


// Protect these routes with authentication middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin', function (Request $request) {
        return $request->user();
    });
    Route::post('admin/register', [AdminController::class, 'register']);
    Route::post('admin/logout', [AdminController::class, 'logout']);
    Route::get('admin/index', [AdminController::class, 'index']);
    Route::get('admin/show/{id}', [AdminController::class, 'show']);
    Route::put('admin/update/{id}', [AdminController::class, 'update']);
    Route::delete('admin/destroy/{id}', [AdminController::class, 'destroy']);
});



//Client User Routes
Route::post('client/login', [ClientController::class, 'login']);
Route::post('client/register', [ClientController::class, 'register']);

// Protect client routes that require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/client', function (Request $request) {
        return $request->user();
    });

    Route::post('client/logout', [ClientController::class, 'logout']);  // Logout route

    // CRUD operations for clients
    Route::get('client/index', [ClientController::class, 'index']);
    Route::get('client/show/{id}', [ClientController::class, 'show']);
    Route::put('client/update/{id}', [ClientController::class, 'update']);
    Route::delete('client/destroy/{id}', [ClientController::class, 'destroy']);
});



    Route::middleware(['auth:sanctum'])->group(function () {
        Route::resource('branches', BranchController::class);
        Route::resource('promos', PromoController::class);
        Route::resource('role', RolesController::class);
    });
