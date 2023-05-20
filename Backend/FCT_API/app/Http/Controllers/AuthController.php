<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{

    // Register new user function
    public function register(Request $request)
    {
        // Request only the name, email and password
        $data = $request->only('name', 'email', 'password');

        // Data request validation
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|max:50',
        ]);

        // Returning error if validation fails
        if ($validator->fails())
        {
            return response()->json([
                'status' => false,
                'message' => $validator->messages()
            ], 400);
        }

        // Create a new user if validation is successful
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            // Encrypt password for security
            'password' => bcrypt($request->password)
        ]);

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'message' => 'User successfully created',
            'user' => $user
        ], 200);
    }

    // Login user function
    public function authenticate(Request $request)
    {
        // Request only the email and password
        $credentials = $request->only('email', 'password');
        
        // Credentials validation
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:6|max:50'
        ]);

        // Returning error if validation fails
        if ($validator->fails())
        {
            return response()->json([
                'status' => false,
                'message' => $validator->messages()
            ], 400);
        }

        // Try to login
        try 
        {
            if (!$token = JWTAuth::attempt($credentials)) {
                // Incorrect credentials
                return response()->json([
                    'status' => false,
                    'message' => 'Login failed: incorrect credentials',
                ], 401);
            }
        } 
        catch (JWTException $e) 
        {
            // Error to generate token
            return response()->json([
                'status' => false,
                'message' => 'Failed to generate token',
            ], 500);
        }

        // Return authorization token
        return response()->json([
            'status' => true,
            'token' => $token
        ], 200);
    }

    // Logout user function to destroy token and disconnect user 
    public function logout(Request $request)
    {
        try 
        {
            // If token is valid then destroy it.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'status' => true,
                'message' => 'User disconnected'
            ], 200);
        } 
        catch (JWTException $exception) 
        {
            // Error invalid token
            return response()->json([
                    'status' => false,
                    'message' => 'Failed to disconnect user'
                ], 500);
        } 
    }

    // Get user data function.
    public function getUser(Request $request)
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

        // Return user data
        return response()->json([
            'status' => true,
            'user' => $user
        ], 200);
    }

}
