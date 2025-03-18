<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->enum('type', ['PickUp', 'Delivery']);
                $table->string('pick_up_type')->nullable();
                $table->json('location')->nullable();
                $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
                $table->json('order_items'); // Storing order items as JSON
                $table->decimal('base_price', 10, 2);
                $table->timestamp('timestamp')->useCurrent();
                $table->timestamp('date_time_pickup')->nullable();
                $table->enum('status', ['pending', 'completed', 'canceled'])->default('pending');
                $table->json('discount_card_details')->nullable();
                $table->json('fees');
                $table->timestamps();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
