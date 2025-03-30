<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddOn extends Model
{
    protected $fillable = ['item_id', 'label', 'price'];

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }
}
