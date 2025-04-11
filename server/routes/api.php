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
use App\Http\Controllers\ImageController;

//Admin User Routes
Route::post('admin/login', [AdminController::class, 'login'])->middleware(['admin.api']);

Route::get('/debug-cloudinary', function () {
    return [
        'cloud_url'   => config('cloudinary.cloud_url'),
        'cloud_name' => config('cloudinary.cloud_name'),
        'api_key'    => config('cloudinary.api_key'),
        'api_secret' => config('cloudinary.api_secret'),
    ];
});



// Protect these routes with authentication middleware
Route::middleware(['admin.api', 'auth:sanctum'])->group(function () {
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
    Route::put('/admin/update_password/{id}', [AdminController::class, 'updatePassword']);

    Route::post('/image_upload', [ImageController::class, 'upload']);
    Route::post('/image_delete', [ImageController::class, 'delete']);
    Route::post('/image_edit', [ImageController::class, 'edit']);
});

//Client User Routes
Route::post('client/login', [ClientController::class, 'login'])->middleware(['api']);
Route::post('client/register', [ClientController::class, 'register'])->middleware(['api']);

// Protect client routes that require authentication
Route::middleware(['auth:sanctum', 'api'])->group(function () {
    Route::get('/client', function (Request $request) {
        return $request->user();
    });
    Route::post('client/logout', [ClientController::class, 'logout']);
    Route::post('client/update_favourites/{id}', [ClientController::class, 'updateFavourites']); 
    Route::get('client/index', [ClientController::class, 'index']);
    // CRUD operations for clients
    Route::get('client/index', [ClientController::class, 'index']);
    Route::get('client/show/{id}', [ClientController::class, 'show']);
    Route::put('client/update/{id}', [ClientController::class, 'update']);
    Route::delete('client/destroy/{id}', [ClientController::class, 'destroy']);
});


// Routes that are accesible for both admin and client
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::apiResource('promos', PromoController::class);
        Route::apiResource('role', RolesController::class);
        Route::apiResource('branches', BranchController::class);
        Route::apiResource('categories', CategoryController::class);
  
        Route::apiResource('items', ItemController::class);
        Route::apiResource('addons', AddOnController::class);
        Route::apiResource('orders', OrderController::class);
        Route::get('menu', [MenuController::class, 'index']);
        Route::apiResource('subcategories', SubCategoryController::class);
    });
