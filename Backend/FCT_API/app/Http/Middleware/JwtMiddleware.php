<?php

namespace App\Http\Middleware;

use JWTAuth;
use Closure;
use Exception;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        
        try
        {
            $user = JWTAuth::parseToken()->authenticate();
        } 
        catch (TokenExpiredException $e) 
        {
            return response()->json([
                'status' => false,
                'message' => 'Token has expired'
            ], 401);
        } 
        catch (TokenInvalidException $e)
        {
            return response()->json([
                'status' => false,
                'message' => 'Invalid Token'
            ], 401);
        } 
        catch (JWTException $e) 
        {
            return response()->json([
                'status' => false,
                'message' => 'Authorization token not found'
            ], 401);
        } 
        catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }

        return $next($request);
    }
}
