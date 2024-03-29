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
     * Display a listing of all users.
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
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can display the list
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }

        // List all users
        $users = User::with('role', 'candidacies')->get();

        // Return the response with the user list
        return response()->json([
            'status' => true,
            'users' => $users
        ], 200);
    }

    /**
     * Store a newly created user in storage.
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
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can register
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }

        // Request only past data
        $data = $request->only(
            'email',  
            'password',
            'password_repeat',
            'name', 
            'last_name',
            'dni',
            'mobile',
            'role_id'
        );

        // Rules to validate the data
        $rules = [
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|between:8,16',
            'password_repeat' => 'required|string',
            'name' => 'required|string|max:35',
            'last_name' => 'required|string|max:35',
            'dni' => 'required|string|size:9|unique:users',
            'mobile' => 'required|string|between:9,15|unique:users',
            'role_id' => 'required|in:1,2'
        ];

        // Custom messages for validation
        $messages = [
            'email.required' => 'Email requerido.',
            'email.unique' => 'El email ya ha sido registrado',
            'email' => 'Email inválido.',
            'password.required' => 'Contraseña requerida.',
            'password' => 'La contraseña debe tener de :min a :max caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.',
            'password_repeat.required' => 'Repetir contraseña requerido.',
            'password_repeat.string' => 'El repetir cotraseña debe ser una cadena de texto.',
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'last_name.required' => 'Apellido requerido.',
            'last_name.string' => 'El apellido debe ser una cadena de texto.',
            'last_name.max' => 'El apellido no debe superar los :max caracteres.',
            'dni.required' => 'DNI requerido.',
            'dni.unique' => 'El DNI ya ha sido registrado.',
            'dni' => 'DNI Inválido.',
            'mobile.required' => 'Número de teléfono requerido.',
            'mobile.unique' => 'El número de teléfono ya ha sido registrado.',
            'mobile' => 'Número de teléfono inválido.',
            'role_id.required' => 'Rol requerido.',
            'role_id' => 'Rol inválido.'
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
        // Password Validation
        if (!UtilsValidator::validatorPassword($request->password)){
            return response()->json([
                'status' => false,
                'message' => ['password' => ['La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.']]
            ], 400);            
        }
        else if ($request->password != $request->password_repeat){
            return response()->json([
                'status' => false,
                'message' => ['password_repeat' => ['No coinciden las contraseñas.']]
            ], 400);            
        }
        // DNI Validation
        if (!UtilsValidator::validatorDNI($request->dni)){
            return response()->json([
                'status' => false,
                'message' => ['dni' => ['DNI inválido.']]
            ], 400);            
        }
        // Mobile Validation
        if (!UtilsValidator::validatorMobile($request->mobile)){
            return response()->json([
                'status' => false,
                'message' => ['mobile' => ['Número de teléfono inválido.']]
            ], 400);            
        }

        // Create a new user if validation is successful
        $newUser = User::create([
            'email' => $request->email,
            // Encrypt password for security
            'password' => bcrypt($request->password),
            'name' => ucfirst($request->name),
            'last_name' => ucfirst($request->last_name),
            'dni' => strtoupper($request->dni),
            'mobile' => $request->mobile,
            'role_id' => $request->role_id
        ]);

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'message' => 'User successfully created',
            'user' => $newUser
        ], 201);
    }

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return json
     */
    public function show($id)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can show the user
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 401);
        }

        // Find the user
        $showUser = User::with('role', 'candidacies')->find($id);

        if (!$showUser)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist'
            ], 404);
        }

        // Return user data
        return response()->json([
            'status' => true,
            'user' => $showUser
        ], 200);      
    }

    /**
     * Display the user logged data.
     *
     * @return json
     */
    public function getUser()
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }

        // Return user data
        return response()->json([
            'status' => true,
            'user' => $user->with('role', 'candidacies')->find($user->id)
        ], 200);
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return json
     */
    public function update(Request $request, $id)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can update
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }
        
        // Find the user
        $updateUser = User::find($id);

        if (!$updateUser)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist'
            ], 404);
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
            'preferences',
            'role_id'
        );

        // Update fields with unique rules
        $emailRule = 'required|email|max:255|unique:users';
        if ($request->email == $updateUser->email)
        {
            $emailRule = 'required|email|max:255';
        }
        $dniRule = 'required|string|size:9|unique:users';
        if (strtoupper($request->dni) == strtoupper($updateUser->dni))
        {
            $dniRule = 'required|string|size:9';
        }
        $mobileRule = 'required|string|between:9,15|unique:users';
        if ($request->mobile == $updateUser->mobile)
        {
            $mobileRule = 'required|string|between:9,15';
        }
        // Update password only if a new one is received
        $passwordRule = 'string|between:8,16';
        if ($request->password == null)
        {
            $passwordRule = '';
        }

        // Rules to validate the data
        $rules = [
            'email' => $emailRule,
            'password' => $passwordRule,
            'name' => 'required|string|max:35',
            'last_name' => 'required|string|max:35',
            'dni' => $dniRule,
            'mobile' => $mobileRule,
            'address'=> 'string|max:255|nullable',
            'town' => 'string|max:35|nullable',
            'birth' => 'date|nullable',
            'preferences' => 'string|nullable',
            'role_id' => 'required|in:1,2'
        ];

        // Custom messages for validation
        $messages = [
            'email.required' => 'Email requerido.',
            'email.unique' => 'El email ya ha sido registrado',
            'email' => 'Email inválido',
            'password' => 'La contraseña debe tener de :min a :max caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.',
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'last_name.required' => 'Apellido requerido.',
            'last_name.string' => 'El apellido debe ser una cadena de texto.',
            'last_name.max' => 'El apellido no debe superar los :max caracteres.',
            'dni.required' => 'DNI requerido.',
            'dni.unique' => 'El DNI ya ha sido registrado.',
            'dni' => 'DNI Inválido.',
            'mobile.required' => 'Número de teléfono requerido.',
            'mobile.unique' => 'El número de teléfono ya ha sido registrado.',
            'mobile' => 'Número de teléfono inválido.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe superar los :max caracteres.',
            'town.string' => 'La localidad debe ser una cadena de texto.',
            'town.max' => 'La localidad no debe superar los :max caracteres.',
            'birth' => 'Formato de fecha no válido.',
            'preferences' => 'Las preferencias debe ser una cadena de texto.',
            'role_id.required' => 'Rol requerido.',
            'role_id' => 'Rol inválido.'
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
        // Password Validation
        if ($request->password != null)
        {
            if (!UtilsValidator::validatorPassword($request->password)){
                return response()->json([
                    'status' => false,
                    'message' => ['password' => ['La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.']]
                ], 400);            
            }
        }
        // DNI Validation
        if (!UtilsValidator::validatorDNI($request->dni))
        {
            return response()->json([
                'status' => false,
                'message' => ['dni' => ['DNI inválido.']]
            ], 400);            
        }
        // Mobile Validation
        if (!UtilsValidator::validatorMobile($request->mobile))
        {
            return response()->json([
                'status' => false,
                'message' => ['mobile' => ['Número de teléfono inválido.']]
            ], 400);            
        }

        // Update user if validation is successful
        $updateUser->update([
            'email' => $request->email,
            'name' => ucfirst($request->name),
            'last_name' => ucfirst($request->last_name),
            'dni' => strtoupper($request->dni),
            'mobile' => $request->mobile,
            'address' => ucfirst($request->address), 
            'town' => ucfirst($request->town),
            'birth' => $request->birth,
            'preferences' => ucfirst($request->preferences),
            'role_id' => $request->role_id
        ]);
        
        // Update password only if a new one is received
        if ($request->password != null)
        {
            // Encrypt password for security
            $updateUser->update([
                'password' => bcrypt($request->password)
            ]);
        }

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'message' => 'User successfully updated',
            'user' => $updateUser
        ], 200);
    }

    /**
     * Change the specified fields of the user logged.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
    public function change(Request $request)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }

        // Request only past data
        $data = $request->only(
            'password',
            'mobile',
            'address',
            'town',
            'birth',
            'preferences'
        );

        // Update fields with unique rules
        $mobileRule = 'required|string|between:9,15|unique:users';
        if ($request->mobile == $user->mobile){
            $mobileRule = 'required|string|between:9,15';
        }
        // Update password only if a new one is received
        $passwordRule = 'string|between:8,16';
        if ($request->password == null){
            $passwordRule = '';
        }

        // Rules to validate the data
        $rules = [
            'password' => $passwordRule,
            'mobile' => $mobileRule,
            'address'=> 'string|max:255|nullable',
            'town' => 'string|max:35|nullable',
            'birth' => 'date|nullable',
            'preferences' => 'string|nullable'
        ];

        // Custom messages for validation
        $messages = [
            'password' => 'La contraseña debe tener de :min a :max caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.',
            'mobile.required' => 'Número de teléfono requerido.',
            'mobile.unique' => 'El número de teléfono ya ha sido registrado.',
            'mobile' => 'Número de teléfono inválido.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe superar los :max caracteres.',
            'town.string' => 'La localidad debe ser una cadena de texto.',
            'town.max' => 'La localidad no debe superar los :max caracteres.',
            'birth' => 'Formato de fecha no válido.',
            'preferences' => 'Las preferencias debe ser una cadena de texto.'
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
        // Password Validation
        if ($request->password != null)
        {
            if (!UtilsValidator::validatorPassword($request->password)){
                return response()->json([
                    'status' => false,
                    'message' => ['password' => ['La contraseña debe tener de 8 a 16 caracteres y contener al menos: 1 mayúscula, 1 minúscula, 1 dígito y 1 carácter especial.']]
                ], 400);            
            }
        }
        // Mobile Validation
        if (!UtilsValidator::validatorMobile($request->mobile)){
            return response()->json([
                'status' => false,
                'message' => ['mobile' => ['Número de teléfono inválido.']]
            ], 400);            
        }

        // Update user if validation is successful
        $user->update([
            'mobile' => $request->mobile,
            'address' => $request->address, 
            'town' => $request->town,
            'birth' => $request->birth,
            'preferences' => $request->preferences
        ]);

        // Update password only if a new one is received
        if ($request->password != null){
            // Encrypt password for security
            $user->update([
                'password' => bcrypt($request->password)
            ]);
        }

        // Return the response with the new user data
        return response()->json([
            'status' => true,
            'message' => 'User successfully updated',
            'user' => $user
        ], 200);
    }

    /**
     * Uploads user CV.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return json
     */
    public function uploadCV(Request $request)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }

        // Request only past data
        $data = $request->only('cv');

        // Rules to validate the data
        $rules = ['cv' => 'required|mimes:pdf|max:2048'];

        // Custom messages for validation
        $messages = [
            'cv.required' => 'No ha seleccionado el documento pdf.',
            'cv.mimes' => 'El formato del documento debe ser pdf.',
            'cv.max' => 'El documento no debe ser mayor de 2MB.'
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

        // Save the file with the user id
        $file = $request->file('cv');
        $fileName = $user->id.'.'.$file->extension(); 
        $cvPath = $file->storeAs('cv', $fileName);

        // Update user cv path if validation is successful
        $user->update([
            'cv' => $cvPath
        ]);

        // Return the response
        return response()->json([
            'status' => true,
            'message' => 'CV subido correctamente.'
        ], 200);
    }

    /**
     * Downloads user CV.
     *
     * @param  int  $id
     * @return json
     */
    public function downloadCV($id)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1 && $user->id != $id)
        {
            // Only users with role 1 or user who owns the cv can download
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 401);
        }

        // Find the cv
        $userCv = User::find($id);

        if (!$userCv)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist'
            ], 404);
        }
        elseif ($userCv->cv == null)
        {
            // Error user doesnt have cv
            return response()->json([
                'status' => false,
                'message' => 'User does not have cv'
            ], 404);
        }
        else
        {
            // Return cv
            return response()->download(storage_path('app/' . $userCv->cv), ('CV_' . $userCv->name . '_' . strtr($userCv->last_name, ' ', '_')));
        }
    }

    /**
     * Delete user CV.
     *
     * @return json
     */
    public function deleteCV()
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }

        if ($user->cv == null)
        {
            // Error user doesnt have cv
            return response()->json([
                'status' => false,
                'message' => 'El usuario no tiene un CV guardado.'
            ], 404);
        }
        else
        {
            // Delete cv
            unlink(storage_path('app/' . $user->cv));
            $user->update([
                'cv' => null
            ]);
            return response()->json([
                'status' => true,
                'message' => 'CV eliminado.'
            ], 200); 
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return json
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
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1)
        {
            // Only users with role 1 can destroy
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }

        // Find the user
        $destroyUser = User::find($id);

        if (!$destroyUser)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist'
            ], 404);
        }

        // Find if the user has associated candidacies 
        $candidaciesUser = Candidacy::where('user_id', $id)->exists();

        if ($candidaciesUser)
        {
            // Error user has associated candidacies
            return response()->json([
                'status' => false,
                'message' => 'No se puede eliminar un usuario con candidaturas asociadas.'
            ], 409);       
        }
        else 
        {
            // Delete CV
            if ($destroyUser->cv != null)
            {
                // Delete cv
                unlink(storage_path('app/' . $destroyUser->cv));
            }            
            // Delete user
            $destroyUser->delete();
            return response()->json([
                'status' => true,
                'message' => 'Usuario eliminado.'
            ], 200); 
        }
    }
}
