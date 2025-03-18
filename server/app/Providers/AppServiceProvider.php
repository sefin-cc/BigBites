<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Pagination\Paginator;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Gate::before(function ($user, $ability) {
            return $user->hasRole('Administrator') ? true : null;
        });
        
        Paginator::useBootstrapFive();
    }

    public function register()
    {
        //
    }
}
