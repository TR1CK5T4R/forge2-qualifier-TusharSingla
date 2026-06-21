<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    public function cards()
    {
        return $this->belongsToMany(Card::class);
    }
}
