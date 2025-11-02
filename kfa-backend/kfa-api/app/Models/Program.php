<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'duration',
        'level',
        'price',
        'image',
        'syllabus',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'syllabus' => 'array',
    ];
}
