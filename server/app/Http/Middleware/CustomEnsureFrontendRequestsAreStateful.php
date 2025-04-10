<?php

namespace App\Http\Middleware;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as SanctumMiddleware;

class CustomEnsureFrontendRequestsAreStateful extends SanctumMiddleware
{
    /**
     * Override the cookie session configuration used by Sanctum.
     */
    protected function configureSecureCookieSessions(): void
    {
        config([
            'session.http_only' => true,
            'session.secure' => true,          
            'session.partitioned' => true,      
            'session.same_site' => 'none',     
        ]);
    }
}
