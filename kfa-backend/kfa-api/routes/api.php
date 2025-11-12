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
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\CertificationProgramController;
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

// Public membership application submission (with rate limiting)
Route::middleware('throttle:10,1')->post('/applications', [ApplicationController::class, 'store']);

// Protected routes (requires Sanctum authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Membership applications (admin only)
    Route::get('/applications', [ApplicationController::class, 'index']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/my', [PaymentController::class, 'my']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
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

// News media management routes
Route::middleware(['auth:sanctum', 'permission:content.update'])->group(function () {
    Route::post('/news/{news}/media', [NewsController::class, 'attachMedia']);
    Route::delete('/news/{news}/media/{media}', [NewsController::class, 'detachMedia']);
    Route::put('/news/{news}/media/reorder', [NewsController::class, 'reorderMedia']);
});

// News stats (for admin dashboard)
Route::middleware(['auth:sanctum', 'permission:content.view'])->group(function () {
    Route::get('/news/stats', [NewsController::class, 'stats']);
});

// News submission (for content creators)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/news/{news}/submit', [NewsController::class, 'submit']);
});

// Content moderation routes (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/news/{news}/approve', [NewsController::class, 'approve']);
    Route::post('/news/{news}/reject', [NewsController::class, 'reject']);
    Route::post('/news/{news}/toggle-featured', [NewsController::class, 'toggleFeatured']);
    Route::post('/news/{news}/publish', [NewsController::class, 'publish']);
    Route::post('/news/{news}/unpublish', [NewsController::class, 'unpublish']);
    Route::post('/news/{news}/archive', [NewsController::class, 'archive']);

    // Membership application moderation
    Route::get('/applications/pending', [ApplicationController::class, 'pending']);
    Route::post('/applications/{application}/approve', [ApplicationController::class, 'approve']);
    Route::post('/applications/{application}/reject', [ApplicationController::class, 'reject']);

    // Payment management
    Route::post('/payments/{id}/confirm', [PaymentController::class, 'confirm']);
    Route::post('/payments/{id}/fail', [PaymentController::class, 'fail']);
    Route::post('/payments/{id}/refund', [PaymentController::class, 'refund']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
});

// Authenticated user routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/applications/my', [ApplicationController::class, 'my']);
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

// Documents routes
Route::get('/documents', [DocumentController::class, 'index']);
Route::get('/documents/{document}', [DocumentController::class, 'show']);
Route::post('/documents/{document}/download', [DocumentController::class, 'download']);

Route::middleware(['auth:sanctum', 'permission:content.create'])->group(function () {
    Route::post('/documents', [DocumentController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'permission:content.update'])->group(function () {
    Route::put('/documents/{document}', [DocumentController::class, 'update']);
    Route::patch('/documents/{document}', [DocumentController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'permission:content.delete'])->group(function () {
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
});

// ============================================
// CERTIFICATION ROUTES
// ============================================

// Public certification program routes (no auth required)
Route::get('/certification-programs', [CertificationProgramController::class, 'index']);
Route::get('/certification-programs/{certificationProgram}', [CertificationProgramController::class, 'show']);

// Public certification verification (by certificate number)
Route::get('/certifications/verify/{certificateNumber}', [CertificationController::class, 'verify']);

// Public registry of certified specialists
Route::get('/certifications/registry', [CertificationController::class, 'registry']);

// Authenticated user routes
Route::middleware('auth:sanctum')->group(function () {
    // User's own certifications
    Route::get('/my-certifications', [CertificationController::class, 'myCertifications']);

    // Apply for certification
    Route::post('/certifications/apply', [CertificationController::class, 'apply']);

    // View all certifications (admin/staff)
    Route::get('/certifications', [CertificationController::class, 'index']);
    Route::get('/certifications/{certification}', [CertificationController::class, 'show']);
});

// Admin-only certification management routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Certification management
    Route::post('/certifications', [CertificationController::class, 'store']);
    Route::put('/certifications/{certification}', [CertificationController::class, 'update']);
    Route::patch('/certifications/{certification}', [CertificationController::class, 'update']);
    Route::delete('/certifications/{certification}', [CertificationController::class, 'destroy']);

    // Certification status updates
    Route::post('/certifications/{certification}/approve', [CertificationController::class, 'approve']);
    Route::post('/certifications/{certification}/reject', [CertificationController::class, 'reject']);
    Route::post('/certifications/{certification}/revoke', [CertificationController::class, 'revoke']);
    Route::post('/certifications/{certification}/issue', [CertificationController::class, 'issue']);

    // Certification program management
    Route::post('/certification-programs', [CertificationProgramController::class, 'store']);
    Route::put('/certification-programs/{certificationProgram}', [CertificationProgramController::class, 'update']);
    Route::patch('/certification-programs/{certificationProgram}', [CertificationProgramController::class, 'update']);
    Route::delete('/certification-programs/{certificationProgram}', [CertificationProgramController::class, 'destroy']);

    // Statistics
    Route::get('/certifications/stats/overview', [CertificationController::class, 'stats']);
});

// ============================================
// EDUCATIONAL PROGRAMS & EVENTS ROUTES
// ============================================

use App\Http\Controllers\Api\EventRegistrationController;
use App\Http\Controllers\Api\ProgramEnrollmentController;
use App\Http\Controllers\Api\CPEActivityController;

// Public event routes (no auth required)
Route::get('/events/upcoming', [EventController::class, 'upcoming']);
Route::get('/events/featured', [EventController::class, 'featured']);

// Public program routes (no auth required)
Route::get('/programs/upcoming', [ProgramController::class, 'upcoming']);
Route::get('/programs/featured', [ProgramController::class, 'featured']);

// Authenticated user routes - Events
Route::middleware('auth:sanctum')->group(function () {
    // Event registration
    Route::post('/events/{event}/register', [EventController::class, 'register']);
    Route::get('/my-event-registrations', [EventController::class, 'myRegistrations']);
    Route::post('/event-registrations/{registration}/cancel', [EventController::class, 'cancelRegistration']);

    // Program enrollment
    Route::post('/programs/{program}/enroll', [ProgramController::class, 'enroll']);
    Route::get('/my-program-enrollments', [ProgramController::class, 'myEnrollments']);
    Route::post('/program-enrollments/{enrollment}/drop', [ProgramController::class, 'dropEnrollment']);

    // CPE Activities
    Route::get('/cpe-activities', [CPEActivityController::class, 'index']);
    Route::get('/my-cpe-activities', [CPEActivityController::class, 'myActivities']);
    Route::get('/my-cpe-stats', [CPEActivityController::class, 'myStats']);
    Route::post('/cpe-activities', [CPEActivityController::class, 'store']);
    Route::get('/cpe-activities/{activity}', [CPEActivityController::class, 'show']);
    Route::put('/cpe-activities/{activity}', [CPEActivityController::class, 'update']);
    Route::patch('/cpe-activities/{activity}', [CPEActivityController::class, 'update']);
    Route::delete('/cpe-activities/{activity}', [CPEActivityController::class, 'destroy']);
});

// Admin-only event registration management routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Event registrations management
    Route::get('/event-registrations', [EventRegistrationController::class, 'index']);
    Route::get('/event-registrations/{registration}', [EventRegistrationController::class, 'show']);
    Route::put('/event-registrations/{registration}', [EventRegistrationController::class, 'update']);
    Route::patch('/event-registrations/{registration}', [EventRegistrationController::class, 'update']);
    Route::delete('/event-registrations/{registration}', [EventRegistrationController::class, 'destroy']);

    // Event registration actions
    Route::post('/event-registrations/{registration}/approve', [EventRegistrationController::class, 'approve']);
    Route::post('/event-registrations/{registration}/reject', [EventRegistrationController::class, 'reject']);
    Route::post('/event-registrations/{registration}/mark-attended', [EventRegistrationController::class, 'markAttended']);
    Route::post('/event-registrations/{registration}/mark-no-show', [EventRegistrationController::class, 'markNoShow']);
    Route::post('/event-registrations/{registration}/issue-certificate', [EventRegistrationController::class, 'issueCertificate']);

    // Event registration statistics
    Route::get('/event-registrations/stats/overview', [EventRegistrationController::class, 'stats']);

    // Program enrollments management
    Route::get('/program-enrollments', [ProgramEnrollmentController::class, 'index']);
    Route::get('/program-enrollments/{enrollment}', [ProgramEnrollmentController::class, 'show']);
    Route::put('/program-enrollments/{enrollment}', [ProgramEnrollmentController::class, 'update']);
    Route::patch('/program-enrollments/{enrollment}', [ProgramEnrollmentController::class, 'update']);
    Route::delete('/program-enrollments/{enrollment}', [ProgramEnrollmentController::class, 'destroy']);

    // Program enrollment actions
    Route::post('/program-enrollments/{enrollment}/approve', [ProgramEnrollmentController::class, 'approve']);
    Route::post('/program-enrollments/{enrollment}/reject', [ProgramEnrollmentController::class, 'reject']);
    Route::post('/program-enrollments/{enrollment}/start', [ProgramEnrollmentController::class, 'start']);
    Route::post('/program-enrollments/{enrollment}/update-progress', [ProgramEnrollmentController::class, 'updateProgress']);
    Route::post('/program-enrollments/{enrollment}/complete', [ProgramEnrollmentController::class, 'complete']);
    Route::post('/program-enrollments/{enrollment}/fail', [ProgramEnrollmentController::class, 'fail']);
    Route::post('/program-enrollments/{enrollment}/issue-certificate', [ProgramEnrollmentController::class, 'issueCertificate']);

    // Program enrollment statistics
    Route::get('/program-enrollments/stats/overview', [ProgramEnrollmentController::class, 'stats']);

    // CPE activities admin actions
    Route::post('/cpe-activities/{activity}/approve', [CPEActivityController::class, 'approve']);
    Route::post('/cpe-activities/{activity}/reject', [CPEActivityController::class, 'reject']);

    // CPE statistics
    Route::get('/cpe-activities/stats/overview', [CPEActivityController::class, 'stats']);
});
