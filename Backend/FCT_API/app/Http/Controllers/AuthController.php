<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Login user function.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
    public function authenticate(Request $request)
    {
        // Request only the email and password
        $credentials = $request->only('email', 'password');
        
        // Credentials validation
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:8|max:16'
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
            if (!$token = JWTAuth::attempt($credentials)) 
            {
                // Incorrect credentials
                return response()->json([
                    'status' => false,
                    'message' => 'Login failed: incorrect credentials'
                ], 401);
            }
        } 
        catch (JWTException $e) 
        {
            // Error to generate token
            return response()->json([
                'status' => false,
                'message' => 'Failed to generate token'
            ], 500);
        }

        // Return authorization token
        return response()->json([
            'status' => true,
            'token' => $token
        ], 200);
    }

    /**
     * Logout user function to destroy token and disconnect user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */ 
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
}
