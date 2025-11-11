#!/bin/bash
set -e

echo "Starting KFA API deployment..."

# Wait for database to be ready
echo "Waiting for database connection..."
sleep 5

# Create necessary directories
echo "Creating storage directories..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Clear any cached config (in case of stale cache)
php artisan config:clear || true
php artisan cache:clear || true

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed roles and permissions
echo "Seeding roles and permissions..."
php artisan db:seed --force --class=RoleSeeder || true

# Cache configuration for production
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the application
echo "Starting PHP built-in server on port $PORT..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
