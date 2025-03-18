<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'type', 'pick_up_type', 'location',
        'branch_id', 'order_items', 'base_price', 'timestamp',
        'date_time_pickup', 'status', 'discount_card_details', 'fees'
    ];

    protected $casts = [
        'location' => 'array',
        'order_items' => 'array',
        'discount_card_details' => 'array',
        'fees' => 'array',
        'timestamp' => 'datetime',
        'date_time_pickup' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
