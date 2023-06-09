<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\Company;
use App\Models\Candidacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Utils\UtilsValidator;

class CompanyController extends Controller
{
    /**
     * Display a listing of all companies.
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

        // List all companies with heardquarters
        $companies = Company::with('headquarters')->get();

        // Return the response with the companies list
        return response()->json([
            'status' => true,
            'companies' => $companies
        ], 200);
    }

    /**
     * Store a newly created company in storage.
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
            // Only users with role 1 can store
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 403);
        }

        // Request only past data
        $data = $request->only(
            'name',  
            'cif',
            'email' 
        );

        // Rules to validate the data
        $rules = [
            'name' => 'required|string|max:100',
            'cif' => 'required|string|size:9|unique:companies',
            'email' => 'required|email|max:255'
        ];

        // Custom messages for validation
        $messages = [
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'cif.required' => 'CIF requerido.',
            'cif.unique' => 'El CIF ya ha sido registrado.',
            'cif' => 'CIF Inválido.',
            'email.required' => 'Email requerido.',
            'email' => 'Email inválido'
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
        // CIF Validation
        if (!UtilsValidator::validatorCif($request->cif)){
            return response()->json([
                'status' => false,
                'message' => ['cif' => ['CIF Inválido.']]
            ], 400);            
        }

        // Create a new company if validation is successful
        $company = Company::create([
            'name' => ucfirst($request->name), 
            'cif' => strtoupper($request->cif),
            'email' => $request->email
        ]);

        // Return the response with the new company data
        return response()->json([
            'status' => true,
            'message' => 'Company successfully created',
            'company' => $company
        ], 201);
    }

    /**
     * Display the specified company.
     *
     * @param  int  $id
     * @return json
     */
    public function show($id)
    {
        // Authentication required
        $user = JWTAuth::parseToken()->authenticate();

        // Check if user has a candidacy with company id
        $candidacyUser = Candidacy::where('user_id', $user->id)->where('company_id', $id)->exists();

        if(!$user)
        {
            // Error invalid token
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token / Expired Token'
            ], 401);
        }
        elseif($user->role_id != 1 && !$candidacyUser)
        {
            // Only users with role 1 or user has a candidacy with company id can show the company
            return response()->json([
                'status' => false,
                'message' => 'User does not have permission'
            ], 401);
        }

        // Find the company
        $company = Company::with('headquarters')->find($id);

        if (!$company)
        {
            // Error company does not exist
            return response()->json([
                'status' => false,
                'message' => 'Company does not exist'
            ], 404);
        }

        // Return company data
        return response()->json([
            'status' => true,
            'company' => $company
        ], 200);
    }

    /**
     * Update the specified company in storage.
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

        // Find the company
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
            'cif',
            'email' 
        );

        // Update fields with unique rules
        $cifRule = 'required|string|size:9|unique:companies';
        if (strtoupper($request->cif) == strtoupper($company->cif))
        {
            $cifRule = 'required|string|size:9';
        }

        // Rules to validate the data
        $rules = [
            'name' => 'required|string|max:100',
            'cif' => $cifRule,
            'email' => 'required|email|max:255'
        ];

        // Custom messages for validation
        $messages = [
            'name.required' => 'Nombre requerido.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe superar los :max caracteres.',
            'cif.required' => 'CIF requerido.',
            'cif.unique' => 'El CIF ya ha sido registrado.',
            'cif' => 'CIF Inválido.',
            'email.required' => 'Email requerido.',
            'email' => 'Email inválido'
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
        // CIF Validation
        if (!UtilsValidator::validatorCif($request->cif)){
            return response()->json([
                'status' => false,
                'message' => ['cif' => ['CIF Inválido.']]
            ], 400);            
        }

        // Update company if validation is successful
        $company->update([
            'name' => ucfirst($request->name), 
            'cif' => strtoupper($request->cif),
            'email' => $request->email
        ]);

        // Return the response with the new company data
        return response()->json([
            'status' => true,
            'message' => 'Company successfully updated',
            'company' => $company
        ], 200);
    }

    /**
     * Remove the specified company from storage.
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

        // Find the company
        $company = Company::find($id);

        if (!$company)
        {
            // Error company does not exist
            return response()->json([
                'status' => false,
                'message' => 'Company does not exist'
            ], 404);
        }

        // Find if the company has associated candidacies 
        $candidaciesCompany = Candidacy::where('company_id', $id)->exists();

        if ($candidaciesCompany)
        {
            // Error user has associated candidacies
            return response()->json([
                'status' => false,
                'message' => 'No se puede eliminar una compañía con candidaturas asociadas.'
            ], 409);       
        }
        else 
        {
            // Delete company and associated headquarters
            $company->delete();
            return response()->json([
                'status' => true,
                'message' => 'Compañía y sedes asociadas eliminadas.'
            ], 200); 
        }
    }
}
