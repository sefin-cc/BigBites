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

# Start supervisord to manage both the Laravel dev server and Reverb WebSocket server
echo "Starting supervisord to manage processes..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
