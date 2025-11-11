#!/bin/bash

echo "Starting KFA API..."

# Create storage directories if they don't exist
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Run migrations
php artisan migrate --force

# Seed database (only roles and permissions)
php artisan db:seed --force --class=RoleSeeder

# Clear and cache config
php artisan config:clear
php artisan config:cache
php artisan route:cache

# Create Nginx configuration
cat > /tmp/nginx.conf <<'EOF'
worker_processes auto;
pid /tmp/nginx.pid;
error_log /tmp/nginx_error.log;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /tmp/nginx_access.log;
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path /tmp/proxy_temp;
    fastcgi_temp_path /tmp/fastcgi_temp;
    uwsgi_temp_path /tmp/uwsgi_temp;
    scgi_temp_path /tmp/scgi_temp;

    sendfile on;
    keepalive_timeout 65;
    gzip on;

    upstream php-fpm {
        server 127.0.0.1:9000;
    }

    server {
        listen ${PORT:-8000};
        server_name _;
        root /app/public;
        index index.php;

        client_max_body_size 50M;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass php-fpm;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_read_timeout 300;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
}
EOF

# Start PHP-FPM in background
php-fpm -D -y /etc/php/php-fpm.conf

# Start Nginx in foreground
nginx -c /tmp/nginx.conf -g 'daemon off;'
