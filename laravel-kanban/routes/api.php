<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\KanbanListController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\MemberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned the "api" middleware group. Enjoy building your API!
|
*/

// Boards CRUD
Route::apiResource('boards', BoardController::class);

// Kanban Lists CRUD (nested under boards for context, though direct access is also fine)
Route::apiResource('boards.kanban_lists', KanbanListController::class);

// Cards CRUD (nested under lists)
Route::apiResource('kanban_lists.cards', CardController::class);

// Tags CRUD
Route::apiResource('tags', TagController::class);

// Members CRUD
Route::apiResource('members', MemberController::class);

// Card Tag Management
Route::post('cards/{card}/tags', [CardController::class, 'attachTag']);
Route::delete('cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);

// Card Member Management
Route::post('cards/{card}/members', [CardController::class, 'assignMember']);
Route::delete('cards/{card}/members/{member}', [CardController::class, 'unassignMember']);
