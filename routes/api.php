<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\MembershipController;
use App\Http\Controllers\API\ProgramController;
use App\Http\Controllers\API\PlanController;
use App\Http\Controllers\API\TrainingSubscriptionController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\WalkInController;

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
    Route::get('programs', [ProgramController::class, 'index']);
    Route::post('programs', [ProgramController::class, 'store']);
    Route::get('programs/{id}', [ProgramController::class, 'show']);
    Route::put('programs/{id}', [ProgramController::class, 'update']);
    Route::delete('programs/{id}', [ProgramController::class, 'destroy']);
});

// PLANS CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::get('plans', [PlanController::class, 'index']);
    Route::post('plans', [PlanController::class, 'store']);
    Route::get('plans/{id}', [PlanController::class, 'show']);
    Route::put('plans/{id}', [PlanController::class, 'update']);
    Route::delete('plans/{id}', [PlanController::class, 'destroy']);
    Route::get('plans/{id}/subscriptions', [PlanController::class, 'subscriptions']);
});

// Member CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::get('members/without-membership', [MemberController::class, 'withoutMembership']);   
    Route::get('members/with-membership', [MemberController::class, 'withMembership']);   
    Route::apiResource('/members', MemberController::class);
    Route::get('/memberships', [MembershipController::class, 'index']);
    Route::post('/memberships', [MembershipController::class, 'store']);
    Route::get('/walk-ins', [WalkInController::class, 'index']);
    Route::post('/walk-ins', [WalkInController::class, 'store']);
    Route::get('/walk-ins/{walkIn}', [WalkInController::class, 'show']);
    Route::delete('/walk-ins/{walkIn}', [WalkInController::class, 'destroy']);
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']); 
    Route::get('/training-subscriptions', [TrainingSubscriptionController::class, 'index']);
    Route::post('/training-subscriptions', [TrainingSubscriptionController::class, 'store']);
});


// Dashboard
Route::middleware('auth:sanctum')->group(function () {
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/export', [DashboardController::class, 'exportFullReport']);
Route::get('/members/export-report', [MemberController::class, 'exportReport']);
});