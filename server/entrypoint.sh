#!/bin/bash

# Only create .env if it doesn't exist (Render prefers setting ENV vars in dashboard)
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate app key (only if not set already)
php artisan key:generate --force

# Cache config
php artisan config:cache

# Run database migrations 
php artisan migrate --force

# Start Laravel's dev server
php artisan serve --host=0.0.0.0 --port=8000
