<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Exceptions\AlreadyAuthenticatedException;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class
        ]);
        $middleware->web(prepend: [
            EnsureFrontendRequestsAreStateful::class, 
        ]);

        $middleware->statefulApi();
        // $middleware->redirectUsersTo(function (Request $request) {
        //     if ($request->expectsJson()) {
        //         throw new AlreadyAuthenticatedException();
        //     }

        //     return '/';
        // });

        // $middleware->prepend(EncryptCookies::class);
        // $middleware->prepend(AddQueuedCookiesToResponse::class);
        // $middleware->prepend(StartSession::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
