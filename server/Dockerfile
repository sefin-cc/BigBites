FROM php:8.2-fpm

# Install dependencies, composer, etc.
RUN apt-get update && apt-get install -y \
    unzip zip curl git libzip-dev && \
    docker-php-ext-install zip pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy files and install PHP dependencies
COPY . .
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["php-fpm"]
