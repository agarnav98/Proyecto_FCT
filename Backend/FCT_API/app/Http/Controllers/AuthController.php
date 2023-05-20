<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

use App\Models\Candidacy;

class AuthController extends Controller
{

    /**
     * Register new user function.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
    public function register(Request $request)
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
        elseif($user->rol_id != 1)
        {
            // Only users with rol 1 can register
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission',
            ], 401);
        }

        // Request only past data
        $data = $request->only(
            'email',  
            'password',
            'name', 
            'last_name',
            'dni',
            'mobile',
            'address',
            'town',
            'birth',
            'cv',
            'rol_id'
        );

        // Data request validation
        $validator = Validator::make($data, [
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|max:50',
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:100',
            'dni' => 'required|string|max:15|unique:users',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'town' => 'required|string|max:15',
            'birth' => 'date',
            'cv' => 'string',
            'rol_id' => 'required|in:1,2'
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
        $newUser = User::create([
            'email' => $request->email,
            // Encrypt password for security
            'password' => bcrypt($request->password),
            'name' => $request->name,
            'last_name' => $request->last_name,
            'dni' => $request->dni,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'town' => $request->town,
            'birth' => $request->birth,
            'cv' => $request->cv,
            'rol_id' => $request->rol_id

        ]);

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'message' => 'User successfully created',
            'user' => $newUser
        ], 200);
    }

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
 
    /**
     * Get user data function.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
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

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
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
        elseif($user->rol_id != 1)
        {
            // Only users with rol 1 can destroy
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission',
            ], 401);
        }

        // Find the user
        $destroyUser = User::find($id);

        if (!$destroyUser)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist',
            ], 404);
        }

        // Find if the user has associated candidacies 
        $candidaciesUser = Candidacy::where('user_id', $id)->exists();

        if ($candidaciesUser){
            // Error user has associated candidacies
            return response()->json([
                'status' => false,
                'message' => 'User has associated candidacies',
            ], 409);       
        }
        else {
            // Delete user
            $destroyUser->delete();
            return response()->json([
                'status' => true,
                'message' => 'User deleted'
            ], 200); 
        }
    }
}
