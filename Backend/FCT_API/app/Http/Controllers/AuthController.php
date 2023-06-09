<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use App\Utils\UtilsValidator;

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

        // Rules to validate the data
        $rules = [
            'email' => 'required|email',
            'password' => 'required|string|between:8,16'
        ];

        // Custom messages for validation
        $messages = [
            'email.required' => 'Email requerido.',
            'email' => 'Email inválido.',
            'password.required' => 'Contraseña requerida.',
            'password' => 'La contraseña debe tener de :min a :max caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.',
        ];

        // Data request validation
        $validator = Validator::make($credentials, $rules, $messages);

        // Returning error if validation fails
        if ($validator->fails())
        {
            return response()->json([
                'status' => false,
                'message' => $validator->messages()
            ], 400);
        }
        // Password Validation
        if (!UtilsValidator::validatorPassword($request->password)){
            return response()->json([
                'status' => false,
                'message' => ['password' => ['La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.']]
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
                    'message' => ['login' => ['Las credenciales son incorrectas.']]
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
     * @return json
     */ 
    public function logout()
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
