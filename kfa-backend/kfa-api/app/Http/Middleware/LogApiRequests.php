<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // Log request
        Log::channel('daily')->info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
            'user_role' => $request->user()?->role,
            'headers' => [
                'user-agent' => $request->header('User-Agent'),
                'accept' => $request->header('Accept'),
            ],
            'body' => $this->filterSensitiveData($request->all()),
        ]);

        // Process request
        $response = $next($request);

        // Log response
        $duration = round((microtime(true) - $startTime) * 1000, 2);

        Log::channel('daily')->info('API Response', [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'user_id' => $request->user()?->id,
        ]);

        return $response;
    }

    /**
     * Filter sensitive data from request
     */
    private function filterSensitiveData(array $data): array
    {
        $sensitive = ['password', 'password_confirmation', 'token', 'api_key'];

        foreach ($sensitive as $key) {
            if (isset($data[$key])) {
                $data[$key] = '***FILTERED***';
            }
        }

        return $data;
    }
}
