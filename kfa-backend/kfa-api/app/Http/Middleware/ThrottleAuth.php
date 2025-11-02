<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ThrottleAuth
{
    /**
     * Handle an incoming request.
     * 
     * Limit: 5 attempts per minute for auth endpoints (login/register)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = 'auth:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            
            return response()->json([
                'message' => 'Too many attempts. Please try again in ' . $seconds . ' seconds.',
                'retry_after' => $seconds,
            ], 429);
        }
        
        RateLimiter::hit($key, 60); // 60 seconds decay
        
        return $next($request);
    }
}
