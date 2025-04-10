FROM php:8.2-cli

# Install system dependencies, PHP extensions, and supervisor
RUN apt-get update && apt-get install -y \
    unzip zip curl git libzip-dev libonig-dev postgresql-client libpq-dev \
    supervisor \
    && docker-php-ext-install zip pdo pdo_mysql pdo_pgsql mbstring

# Create a new user for running Laravel processes
RUN useradd -m laraveluser

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy everything
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for the app folder
RUN chown -R laraveluser:laraveluser /var/www

# Ensure correct permissions for Laravel's storage and cache directories
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Ensure correct permissions for the log files
RUN chmod -R 777 /var/log

# Grant execute permissions to artisan command
RUN chmod +x /var/www/artisan

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose necessary ports
EXPOSE 8000

# Switch to the non-root user
USER laraveluser

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
