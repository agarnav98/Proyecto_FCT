<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of all roles.
     *
     * @return json
     */
    public function index()
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token',
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can display the list
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission',
            ], 403);
        }

        // List all users
        $users = User::with('role')->get();

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'users' => $users,
        ], 200);
    }
}
