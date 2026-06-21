<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function kanbanLists()
    {
        return $this->hasMany(KanbanList::class);
    }
}
