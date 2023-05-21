<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use App\Models\Candidacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Utils\UtilsValidator;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Register new user function.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
    public function store(Request $request)
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

        // Rules to validate the data
        $rules = [
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|max:16',
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:100',
            'dni' => 'required|string|size:9|unique:users',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'town' => 'required|string|max:15',
            'birth' => 'date',
            'cv' => 'string',
            'rol_id' => 'required|in:1,2'
        ];

        // Sustom messages for validation
        $messages = [
            'email.required' => 'Email requerido.',
            'email' => 'Email inválido',
            'email.unique' => 'El email ya ha sido registrado',
            'password.required' => 'Contraseña requerida',
            'password' => 'La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.',
            'name' => 'required|string|max:50',
            'last_name' => 'required|string|max:100',
            'dni' => 'required|string|size:9|unique:users',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'town' => 'required|string|max:15',
            'birth' => 'date',
            'cv' => 'string',
            'rol_id' => 'required|in:1,2'
        ];


        // Data request validation
        $validator = Validator::make($data, $rules, $messages);

        // Returning error if validation fails
        if ($validator->fails())
        {
            return response()->json([
                'status' => false,
                'message' => $validator->messages()
            ], 400);
        }
        if (!UtilsValidator::validatorPassword($request->password)){
            return response()->json([
                'status' => false,
                'message' => ['password' => ['La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.']]
            ], 400);            
        }
        // DNI Validation
        if (!UtilsValidator::validatorDNI($request->dni)){
            return response()->json([
                'status' => false,
                'message' => ['dni' => ['DNI inválido.']]
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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
