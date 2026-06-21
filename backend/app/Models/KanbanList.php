<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KanbanList extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'board_id',
        'name',
        'position',
    ];

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class, 'list_id')->orderBy('position');
    }
}
