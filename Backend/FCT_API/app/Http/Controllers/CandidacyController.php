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
     * @return \Illuminate\Http\Response
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

        // Request only past data
        $data = $request->only(
            'status',
            'company_id'
        );

        // Rules to validate the data
        $rules = [
            'status' => 'boolean',
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
                'message' => 'Company does not exist'
            ], 404);
        }

        // Check if the candidacy exits
        $checkCandidacy = Candidacy::where('user_id', $id)->where('company_id', $request->company_id)->exists();

        if ($checkCandidacy)
        {
            // Error candidacy exists
            return response()->json([
                'status' => false,
                'message' => 'Candidacy already exists'
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
            'message' => 'Candidacy successfully created',
            'candidacy' => $candidacy
        ], 201);
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
