#!/bin/bash

# Only create .env if it doesn't exist (Render prefers setting ENV vars in dashboard)
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate app key
php artisan key:generate --force

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "PostgreSQL is not ready yet. Waiting..."
  sleep 2
done
echo "PostgreSQL is ready!"

# Cache config
echo "Caching configuration..."
php artisan config:cache

# Publish Spatie permissions migration (force in case already published)
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="migrations" --force

# Run all migrations
echo "Running migrations..."
php artisan migrate --force

# Seed the database
echo "Seeding database..."
php artisan db:seed --force

# Start Laravel Reverb WebSocket server in the background
echo "Starting Laravel Reverb..."
php artisan reverb:start &

# Start Laravel dev server and keep it running
echo "Starting Laravel's development server..."
php artisan serve --host=0.0.0.0 --port=8000
