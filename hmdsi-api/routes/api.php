<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\AspirationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ManagementStructureController;
use App\Http\Controllers\Api\NewsArticleController;
use App\Http\Controllers\Api\PeriodController;
use App\Http\Controllers\Api\ResourceArchiveController;
use App\Http\Controllers\Api\SiteStatController;
use App\Http\Controllers\Api\WorkProgramController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

Route::get('/periods', [PeriodController::class, 'index']);
Route::get('/periods/active', [PeriodController::class, 'active']);

Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/departments/{slug}', [DepartmentController::class, 'show']);
Route::get('/departments/{slug}/structure', [DepartmentController::class, 'structure']);

Route::get('/management-structures', [ManagementStructureController::class, 'index']);

Route::get('/work-programs', [WorkProgramController::class, 'index']);
Route::get('/work-programs/highlights', [WorkProgramController::class, 'highlights']);
Route::get('/work-programs/{slug}', [WorkProgramController::class, 'show']);

Route::get('/news', [NewsArticleController::class, 'index']);
Route::get('/news/{slug}', [NewsArticleController::class, 'show']);

Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/{slug}', [GalleryController::class, 'show']);

Route::get('/resources', [ResourceArchiveController::class, 'index']);
Route::post('/resources/{id}/download', [ResourceArchiveController::class, 'download']);

Route::get('/about', [AboutController::class, 'show']);
Route::get('/stats', [SiteStatController::class, 'index']);

Route::get('/aspirations', [AspirationController::class, 'index']);
Route::get('/aspirations/stats', [AspirationController::class, 'stats']);
Route::get('/aspirations/track/{code}', [AspirationController::class, 'track']);
Route::post('/aspirations', [AspirationController::class, 'store']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/periods', [PeriodController::class, 'store']);

    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::put('/departments/{department}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy']);

    Route::post('/members', [ManagementStructureController::class, 'storeMember']);
    Route::put('/members/{member}', [ManagementStructureController::class, 'updateMember']);
    Route::delete('/members/{member}', [ManagementStructureController::class, 'destroyMember']);

    Route::post('/management-structures', [ManagementStructureController::class, 'store']);
    Route::put('/management-structures/{managementStructure}', [ManagementStructureController::class, 'update']);
    Route::delete('/management-structures/{managementStructure}', [ManagementStructureController::class, 'destroy']);

    Route::post('/work-programs', [WorkProgramController::class, 'store']);
    Route::put('/work-programs/{workProgram}', [WorkProgramController::class, 'update']);
    Route::delete('/work-programs/{workProgram}', [WorkProgramController::class, 'destroy']);

    Route::post('/news', [NewsArticleController::class, 'store']);
    Route::put('/news/{newsArticle}', [NewsArticleController::class, 'update']);
    Route::delete('/news/{newsArticle}', [NewsArticleController::class, 'destroy']);

    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{galleryEvent}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{galleryEvent}', [GalleryController::class, 'destroy']);
    Route::post('/gallery/{galleryEvent}/items', [GalleryController::class, 'storeItem']);
    Route::delete('/gallery/items/{galleryItem}', [GalleryController::class, 'destroyItem']);

    Route::post('/resources', [ResourceArchiveController::class, 'store']);
    Route::put('/resources/{resource}', [ResourceArchiveController::class, 'update']);
    Route::delete('/resources/{resource}', [ResourceArchiveController::class, 'destroy']);

    Route::put('/about/{aboutContent}', [AboutController::class, 'update']);
    Route::put('/stats', [SiteStatController::class, 'upsert']);

    Route::get('/aspirations', [AspirationController::class, 'adminIndex']);
    Route::post('/aspirations/{aspiration}/respond', [AspirationController::class, 'respond']);
});
