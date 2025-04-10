#!/bin/bash

# Only create .env if it doesn't exist (Render prefers setting ENV vars in dashboard)
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate app key (only if not set already)
php artisan key:generate --force

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "PostgreSQL is not ready yet. Waiting..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Cache configuration
echo "Caching configuration..."
php artisan config:cache

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Seed the database (optional: only if you need to populate with test data)
echo "Seeding database..."
php artisan db:seed --force

# Start Laravel's dev server
echo "Starting Laravel's development server..."
php artisan serve --host=0.0.0.0 --port=8000
