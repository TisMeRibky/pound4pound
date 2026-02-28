<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\MembershipController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProgramController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Member CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/members/no-membership', [MemberController::class, 'indexMembership']);    
    Route::apiResource('members', MemberController::class);
    Route::get('memberships', [MembershipController::class, 'index']);
    Route::post('/memberships', [MembershipController::class, 'store']);

    // Program CRUD
    Route::apiResource('programs', ProgramController::class);
});

