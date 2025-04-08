FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    unzip zip curl git libzip-dev libonig-dev && \
    docker-php-ext-install zip pdo pdo_mysql mbstring

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy app files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN php artisan config:cache
RUN php artisan key:generate

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
