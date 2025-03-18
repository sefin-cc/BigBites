<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    // Define the table name (optional, if different from the default)
    protected $table = 'branches';

    // The attributes that are mass assignable
    protected $fillable = [
        'branchName', 
        'province', 
        'city', 
        'fullAddress', 
        'openingTime', 
        'closingTime', 
        'acceptAdvancedOrder'
    ];

    // The attributes that should be hidden for serialization (optional)
    protected $hidden = [
        // Add fields to hide if necessary
    ];

    // The attributes that should be cast (optional)
    protected $casts = [
        'acceptAdvancedOrder' => 'boolean',
        'openingTime' => 'datetime:H:i',
        'closingTime' => 'datetime:H:i',
    ];
}
