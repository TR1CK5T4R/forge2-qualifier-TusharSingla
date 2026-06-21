<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KanbanList extends Model
{
    protected $table = 'kanban_lists'; // Explicitly set table name

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
}
