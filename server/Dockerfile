FROM php:8.2-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    unzip zip curl git libzip-dev libonig-dev postgresql-client libpq-dev \
    && docker-php-ext-install zip pdo pdo_mysql pdo_pgsql mbstring

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy everything
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]
