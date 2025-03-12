<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;

//Admin User Routes
Route::get('/admin', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('admin/login', [AdminController::class, 'login']);
Route::post('admin/register', [AdminController::class, 'register']);
Route::post('admin/logout', [AdminController::class, 'logout'])->middleware('auth:sanctum');

Route::post('client/login', [ClientController::class, 'login']);