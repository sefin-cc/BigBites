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


# Start Laravel Reverb WebSocket server in the background
echo "Starting Laravel Reverb..."
php artisan reverb:start &

# Keep the container running indefinitely so Reverb stays alive
# This line is crucial since Reverb runs in the background as a WebSocket server
tail -f /dev/null
