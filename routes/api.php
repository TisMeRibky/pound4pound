<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\MemberController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('members', MemberController::class);
});

// Member CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('members', MemberController::class);
});
