<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Roles and permissions
            'role' => $this->roles->first()?->name ?? 'guest', // Primary role for frontend
            'roles' => $this->roles->pluck('name'),
            'permissions' => $this->getAllPermissions()->pluck('name'),

            // Helper flags
            'is_super_admin' => $this->hasRole('super_admin'),
            'is_admin' => $this->hasRole('admin'),
            'is_moderator' => $this->hasRole('moderator'),
            'is_editor' => $this->hasRole('editor'),
            'is_member' => $this->hasRole('member'),
        ];
    }
}
