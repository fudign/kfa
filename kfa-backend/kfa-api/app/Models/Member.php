<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'email',
        'company',
        'position',
        'photo',
        'bio',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];
}
