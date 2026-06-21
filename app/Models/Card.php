<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function kanbanList()
    {
        return $this->belongsTo(KanbanList::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function members()
    {
        return $this->belongsToMany(Member::class);
    }
}
