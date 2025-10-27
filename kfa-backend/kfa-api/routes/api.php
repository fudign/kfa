<?php

use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

// Public authentication routes with strict rate limiting (5/min)
Route::middleware('throttle.auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public routes (no authentication required) - GUEST can access
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{news}', [NewsController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/members', [MemberController::class, 'index']);
Route::get('/members/{member}', [MemberController::class, 'show']);
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{program}', [ProgramController::class, 'show']);

// Protected routes (requires Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Membership applications
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
});

// Members management routes (permission-based)
Route::middleware(['auth:sanctum', 'permission:members.create'])->group(function () {
    Route::post('/members', [MemberController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'permission:members.update'])->group(function () {
    Route::put('/members/{member}', [MemberController::class, 'update']);
    Route::patch('/members/{member}', [MemberController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'permission:members.delete'])->group(function () {
    Route::delete('/members/{member}', [MemberController::class, 'destroy']);
});

// Content management routes (permission-based)
Route::middleware(['auth:sanctum', 'permission:content.create'])->group(function () {
    Route::post('/news', [NewsController::class, 'store']);
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/programs', [ProgramController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'permission:content.update'])->group(function () {
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::patch('/news/{news}', [NewsController::class, 'update']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::patch('/events/{event}', [EventController::class, 'update']);
    Route::put('/programs/{program}', [ProgramController::class, 'update']);
    Route::patch('/programs/{program}', [ProgramController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'permission:content.delete'])->group(function () {
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::delete('/programs/{program}', [ProgramController::class, 'destroy']);
});

// Content moderation routes (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/news/{news}/approve', [NewsController::class, 'approve']);
    Route::post('/news/{news}/reject', [NewsController::class, 'reject']);
    Route::post('/news/{news}/feature', [NewsController::class, 'feature']);
    Route::post('/news/{news}/unpublish', [NewsController::class, 'unpublish']);
    Route::post('/news/{news}/archive', [NewsController::class, 'archive']);

    // Membership application moderation
    Route::post('/applications/{application}/approve', [ApplicationController::class, 'approve']);
});

// Public routes (no authentication required)
Route::get('/partners', [PartnerController::class, 'index']);
Route::get('/partners/{partner}', [PartnerController::class, 'show']);
Route::get('/settings/public', [SettingsController::class, 'public']);

// Media routes (permission-based)
Route::middleware(['auth:sanctum', 'permission:media.view'])->group(function () {
    Route::get('/media', [MediaController::class, 'index']);
    Route::get('/media/{media}', [MediaController::class, 'show']);
});
Route::middleware(['auth:sanctum', 'permission:media.upload'])->group(function () {
    Route::post('/media', [MediaController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'permission:media.delete'])->group(function () {
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);
});

// Partners routes (permission-based)
Route::middleware(['auth:sanctum', 'permission:partners.create'])->group(function () {
    Route::post('/partners', [PartnerController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'permission:partners.update'])->group(function () {
    Route::put('/partners/{partner}', [PartnerController::class, 'update']);
    Route::patch('/partners/{partner}', [PartnerController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'permission:partners.delete'])->group(function () {
    Route::delete('/partners/{partner}', [PartnerController::class, 'destroy']);
});

// Settings routes (permission-based)
Route::middleware(['auth:sanctum', 'permission:settings.view'])->group(function () {
    Route::get('/settings', [SettingsController::class, 'index']);
});
Route::middleware(['auth:sanctum', 'permission:settings.update'])->group(function () {
    Route::put('/settings', [SettingsController::class, 'update']);
});
