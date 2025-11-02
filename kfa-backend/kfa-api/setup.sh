#!/bin/bash

echo "=== $ Backend - Laravel Setup ==="
echo ""

# @>25@:0 composer
if ! command -v composer &> /dev/null; then
    echo "Error: Composer not found"
    exit 1
fi

echo "Installing Laravel dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo ""
echo "Publishing Sanctum configuration..."
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --force

echo ""
echo "Generating application key..."
php artisan key:generate

echo ""
echo "Running migrations..."
php artisan migrate --force

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "API is ready at: http://localhost"
echo "Mailpit UI: http://localhost:8025"
