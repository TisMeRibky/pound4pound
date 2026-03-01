<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\PaymentController;

use App\Http\Controllers\API\MembershipController;
use App\Http\Controllers\API\ProgramController;

use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// PROGRAMS CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('programs', ProgramController::class);
});

// Member CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/members/no-membership', [MemberController::class, 'indexMembership']);    
    Route::apiResource('members', MemberController::class);
    Route::get('memberships', [MembershipController::class, 'index']);
    Route::post('/memberships', [MembershipController::class, 'store']);
    Route::get('payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']); 
});