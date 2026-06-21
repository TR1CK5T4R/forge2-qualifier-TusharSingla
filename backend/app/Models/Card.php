<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'list_id',
        'title',
        'description',
        'position',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function kanbanList()
    {
        return $this->belongsTo(KanbanList::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function members()
    {
        return $this->belongsToMany(Member::class)->withTimestamps();
    }
}
