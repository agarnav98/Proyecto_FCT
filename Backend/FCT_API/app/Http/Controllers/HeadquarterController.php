<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\Headquarter;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Utils\UtilsValidator;

class HeadquarterController extends Controller
{
    /**
     * Store a newly created headquarter in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id company id
     * @return json
     */
    public function store(Request $request, $id)
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
            // Only users with role 1 can store
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }

        // Find the company to add a headquarter
        $company = Company::find($id);

        if (!$company)
        {
            // Error company does not exist
            return response()->json([
                'status' => false,
                'message' => 'Company does not exist'
            ], 404);
        }

        // Request only past data
        $data = $request->only(
            'name',
            'mobile',
            'address',
            'town'
        );

        // Rules to validate the data
        $rules = [
            'name' => 'required|string|max:100',
            'mobile' => 'required|string|min:9|max:15',
            'address'=> 'required|string|max:255',
            'town' => 'required|string|max:35'
        ];

        // Custom messages for validation
        $messages = [
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'mobile.required' => 'Número de teléfono requerido.',
            'mobile' => 'Número de teléfono inválido.',
            'address.required' => 'Dirección requerida.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe superar los :max caracteres.',
            'town.required' => 'Localidad requerida.',
            'town.string' => 'La localidad debe ser una cadena de texto.',
            'town.max' => 'La localidad no debe superar los :max caracteres.'
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
        // Mobile Validation
        if (!UtilsValidator::validatorMobile($request->mobile)){
            return response()->json([
                'status' => false,
                'message' => ['mobile' => ['Número de teléfono inválido.']]
            ], 400);            
        }

        // Create a new headquarter if validation is successful
        $headquarter = Headquarter::create([
            'name' => ucfirst($request->name),
            'mobile' => $request->mobile,
            'address' => ucfirst($request->address),
            'town' => ucfirst($request->town),
            'company_id' => $id
        ]);

        // Return the response with the new headquarter data
        return response()->json([
            'status' => true,
            'message' => 'Sede añadida.',
            'headquarter' => $headquarter
        ], 201);
    }

    /**
     * Display the specified headquarter.
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

        // Find the headquarter
        $showHeadquarter = Headquarter::with('company')->find($id);

        if (!$showHeadquarter)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'Headquarter does not exist'
            ], 404);
        }

        // Return user data
        return response()->json([
            'status' => true,
            'headquarter' => $showHeadquarter
        ], 200);      
    }

    /**
     * Update the specified headquarter in storage.
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

        // Find the headquarter
        $headquarter = Headquarter::find($id);

        if (!$headquarter)
        {
            // Error headquarter does not exist
            return response()->json([
                'status' => false,
                'message' => 'Headquarter does not exist'
            ], 404);
        }

        // Request only past data
        $data = $request->only(
            'name',
            'mobile',
            'address',
            'town'
        );

        // Rules to validate the data
        $rules = [
            'name' => 'required|string|max:100',
            'mobile' => 'required|string|min:9|max:15',
            'address'=> 'required|string|max:255',
            'town' => 'required|string|max:35'
        ];

        // Custom messages for validation
        $messages = [
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'mobile.required' => 'Número de teléfono requerido.',
            'mobile' => 'Número de teléfono inválido.',
            'address.required' => 'Dirección requerida.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe superar los :max caracteres.',
            'town.required' => 'Localidad requerida.',
            'town.string' => 'La localidad debe ser una cadena de texto.',
            'town.max' => 'La localidad no debe superar los :max caracteres.'
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
        // Mobile Validation
        if (!UtilsValidator::validatorMobile($request->mobile)){
            return response()->json([
                'status' => false,
                'message' => ['mobile' => ['Número de teléfono inválido.']]
            ], 400);            
        }

        // Update headquarter if validation is successful
        $headquarter->update([
            'name' => ucfirst($request->name),
            'mobile' => $request->mobile,
            'address' => ucfirst($request->address),
            'town' => ucfirst($request->town)
        ]);

        // Return the response with the new headquarter data
        return response()->json([
            'status' => true,
            'message' => 'Sede actualizada.',
            'headquarter' => $headquarter
        ], 200);
    }

    /**
     * Remove the specified headquarter from storage.
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

        // Find the headquarter
        $headquarter = Headquarter::find($id);

        if (!$headquarter)
        {
            // Error headquarter does not exist
            return response()->json([
                'status' => false,
                'message' => 'Headquarter does not exist'
            ], 404);
        }

        // Delete headquarter
        $headquarter->delete();
        return response()->json([
            'status' => true,
            'message' => 'Sede eliminada.'
        ], 200); 
    }
}
