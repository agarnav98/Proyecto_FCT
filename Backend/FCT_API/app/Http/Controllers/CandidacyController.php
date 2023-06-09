<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\Candidacy;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CandidacyController extends Controller
{
    /**
     * Display a listing of all candidacies.
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

        // List all candidacies with company and user
        $candidacies = Candidacy::with('company', 'user')->get();

        // Return the response with the candidacies list
        return response()->json([
            'status' => true,
            'candidacies' => $candidacies
        ], 200);
    }

    /**
     * Store a newly created candidacy in storage.
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

        // Find the user to add a candidacy
        $userCandidacy = User::find($id);

        if (!$userCandidacy)
        {
            // Error user does not exist
            return response()->json([
                'status' => false,
                'message' => 'User does not exist'
            ], 404);
        }

        // Check if the user has an accepted candidacy
        $checkStatus = Candidacy::where('user_id', $id)->where('status', true)->exists();

        if ($checkStatus)
        {
            // Error user has an accepted candidacy
            return response()->json([
                'status' => false,
                'message' => ['candidacy' => ['El usuario ya tiene una candidatura aceptada.']]
            ], 400);           
        }        

        // Request only past data
        $data = $request->only(
            'status',
            'company_id'
        );

        // Rules to validate the data
        $rules = [
            'status' => 'boolean|nullable',
            'company_id' => 'required|integer'
        ];

        // Custom messages for validation
        $messages = [
            'status' => 'Estado solo admite los valores: Aceptado, En espera o Denegado.',
            'company_id.required' => 'Empresa requerida.',
            'company_id' => 'La empresa no existe.'
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

        // Find the company to add a candidacy
        $companyCandidacy = Company::find($request->company_id);

        if (!$companyCandidacy)
        {
            // Error company does not exist
            return response()->json([
                'status' => false,
                'message' => ['company_id' => ['La compañía no existe.']]
            ], 404);
        }

        // Check if the candidacy exits
        $checkCandidacy = Candidacy::where('user_id', $id)->where('company_id', $request->company_id)->exists();

        if ($checkCandidacy)
        {
            // Error candidacy exists
            return response()->json([
                'status' => false,
                'message' => ['candidacy' => ['Ya existe esta candidatura.']]
            ], 400);           
        }

        // Create a new candidacy if validation is successful
        $candidacy = Candidacy::create([
            'status' => $request->status,
            'company_id' => $request->company_id,
            'user_id' => $id
        ]);

        // Return the response with the new candidacy data
        return response()->json([
            'status' => true,
            'message' => 'Candidatura añadida.',
            'candidacy' => $candidacy
        ], 201);
    }

    /**
     * Update the specified candidacy in storage.
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

        // Find the candidacy
        $candidacy = Candidacy::find($id);

        if (!$candidacy)
        {
            // Error headquarter does not exist
            return response()->json([
                'status' => false,
                'message' => 'Candidacy does not exist'
            ], 404);
        }

        // Request only past data
        $data = $request->only(
            'status'
        );

        // Rules to validate the data
        $rules = [
            'status' => 'boolean|nullable'
        ];

        // Custom messages for validation
        $messages = [
            'status' => 'Estado solo admite los valores: Aceptado, En espera o Denegado.'
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

        // Check if the user has an accepted candidacy
        $checkStatus = Candidacy::where('user_id', $candidacy->user_id)->where('status', true)->exists();

        if ($checkStatus && $request->status)
        {
            // Error user has an accepted candidacy
            return response()->json([
                'status' => false,
                'message' => 'El usuario ya tiene una candidatura aceptada.'
            ], 400);           
        }   

        // Update candidacy if validation is successful
        $candidacy->update([
            'status' => $request->status
        ]);

        // Return the response with the new headquarter data
        return response()->json([
            'status' => true,
            'message' => 'Estado actualizado.',
            'candidacy' => $candidacy
        ], 200);
    }

    /**
     * Remove the specified candidacy from storage.
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

        // Find the candidacy
        $candidacy = Candidacy::find($id);

        if (!$candidacy)
        {
            // Error headquarter does not exist
            return response()->json([
                'status' => false,
                'message' => 'Candidacy does not exist'
            ], 404);
        }

        // Delete candidacy
        $candidacy->delete();
        return response()->json([
            'status' => true,
            'message' => 'Candidatura eliminada.'
        ], 200); 
    }
}
