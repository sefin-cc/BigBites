#!/bin/bash

# Only create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate app key
php artisan key:generate --force

# Wait for PostgreSQL to be ready (if used)
if [ "$DB_HOST" ]; then
  echo "Waiting for PostgreSQL to be ready..."
  until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
    echo "PostgreSQL is not ready yet. Waiting..."
    sleep 2
  done
  echo "PostgreSQL is ready!"
fi

# Cache config
php artisan config:cache

# Start Laravel Reverb in foreground so container stays alive
echo "Starting Laravel Reverb..."
exec php artisan reverb:start --host=0.0.0.0 --port=10000
