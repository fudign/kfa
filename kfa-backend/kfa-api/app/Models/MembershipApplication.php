<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MembershipApplication extends Model
{
    protected $fillable = [
        'user_id',
        'membership_type',
        'status',
        'organization',
        'position',
        'experience_years',
        'education',
        'motivation',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
