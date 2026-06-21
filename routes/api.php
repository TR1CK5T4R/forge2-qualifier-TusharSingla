<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\KanbanListController; // Assuming this controller will be created
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\MemberController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Boards CRUD
Route::resource('boards', BoardController::class);

// KanbanLists CRUD (associated with boards)
Route::get('boards/{board}/lists', [KanbanListController::class, 'index']); // Get lists for a board
Route::post('boards/{board}/lists', [KanbanListController::class, 'store']); // Create a list for a board
Route::put('lists/{list}', [KanbanListController::class, 'update']); // Update a list
Route::delete('lists/{list}', [KanbanListController::class, 'destroy']); // Delete a list

// Cards CRUD (within lists)
Route::get('lists/{list}/cards', [CardController::class, 'index']); // Get cards for a list
Route::post('lists/{list}/cards', [CardController::class, 'store']); // Create a card in a list
Route::put('cards/{card}', [CardController::class, 'update']); // Update a card
Route::delete('cards/{card}', [CardController::class, 'destroy']); // Delete a card

// Card movement between lists
Route::post('cards/{card}/move', [CardController::class, 'move']); // Move card to a different list

// Tags CRUD
Route::resource('tags', TagController::class);

// Members CRUD
Route::resource('members', MemberController::class);

// Card-Tag & Card-Member relationships
Route::post('cards/{card}/tags', [CardController::class, 'attachTag']);
Route::delete('cards/{card}/tags/{tag}', [CardController::class, 'detachTag']);

Route::post('cards/{card}/members', [CardController::class, 'assignMember']);
Route::delete('cards/{card}/members/{member}', [CardController::class, 'removeMember']);

