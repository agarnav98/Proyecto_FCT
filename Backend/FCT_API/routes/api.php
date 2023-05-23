<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'authenticate']);

// Everything in this group requires user verification.
Route::group(['middleware' => ['jwt.verify']], function() 
{
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Role CRUD
    Route::get('roles', [RoleController::class, 'index']);

    // User CRUD
    Route::get('users', [UserController::class, 'index']);
    Route::post('register', [UserController::class, 'store']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::get('user', [UserController::class, 'getUser']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::put('user', [UserController::class, 'change']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
});
