<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['sub_category_id', 'label', 'full_label', 'description', 'price', 'time', 'image'];

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function addOns()
    {
        return $this->hasMany(AddOn::class);
    }
}
