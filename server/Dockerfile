# Use the official PHP image from Docker Hub
FROM php:8.1-fpm

# Install dependencies required for Laravel (and SQLite)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    sqlite3 \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_sqlite

# Set working directory
WORKDIR /var/www

# Copy the Laravel project files into the Docker container
COPY . .

# Install Composer (PHP dependency manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Expose port 80 to access the Laravel app
EXPOSE 80

# Command to run the Laravel app using PHP's built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]
