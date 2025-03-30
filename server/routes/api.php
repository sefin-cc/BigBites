<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AddOnController;
use App\Http\Controllers\OrderController;

//Admin User Routes
Route::post('admin/login', [AdminController::class, 'login'])->middleware(['web']);


// Protect these routes with authentication middleware
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin', function (Request $request) {
        return $request->user();
    });
    Route::post('admin/register', [AdminController::class, 'register']);
    Route::post('admin/logout', [AdminController::class, 'logout']);
    Route::get('admin/index', [AdminController::class, 'index']);
    Route::get('admin/show/{id}', [AdminController::class, 'show']);
    Route::put('admin/update/{id}', [AdminController::class, 'update']);
    Route::delete('admin/destroy/{id}', [AdminController::class, 'destroy']);
    Route::put('/admin/update_account/{id}', [AdminController::class, 'updateAccount']);
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
        Route::apiResource('branches', BranchController::class);
        Route::apiResource('promos', PromoController::class);
        Route::apiResource('role', RolesController::class);
 
        Route::apiResource('categories', CategoryController::class);
  
        Route::apiResource('items', ItemController::class);
        Route::apiResource('addons', AddOnController::class);
        Route::apiResource('orders', OrderController::class);
        Route::get('menu', [MenuController::class, 'index']);
        Route::apiResource('subcategories', SubCategoryController::class);
    });
