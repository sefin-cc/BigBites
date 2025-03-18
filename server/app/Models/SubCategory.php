<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    protected $fillable = ['category_id', 'label'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
