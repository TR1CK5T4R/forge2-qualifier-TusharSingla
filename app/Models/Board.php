<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    // Add the relationship to KanbanList
    public function lists()
    {
        return $this->hasMany(KanbanList::class);
    }

    // Assuming other models might need relationships defined later
    // public function members() { ... }
    // public function tags() { ... }
}
