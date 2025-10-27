<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use App\Models\User;

class CheckPermissions extends Command
{
    protected $signature = 'check:permissions';
    protected $description = 'Check permissions for debugging';

    public function handle()
    {
        $this->info('=== Checking Role Permissions ===');
        $memberRole = Role::where('name', 'member')->first();
        if ($memberRole) {
            $this->info("Role: {$memberRole->name}");
            $this->info("Permissions: " . $memberRole->permissions->pluck('name')->join(', '));
        } else {
            $this->error('Member role not found!');
        }

        $this->info('');
        $this->info('=== Checking User Roles ===');
        $member = User::where('email', 'member@kfa.kg')->first();
        if ($member) {
            $this->info("User: {$member->email}");
            $this->info("Roles: " . $member->roles->pluck('name')->join(', '));
            $this->info("Has content.create? " . ($member->hasPermissionTo('content.create') ? 'YES' : 'NO'));
        } else {
            $this->error('Member user not found!');
        }

        return 0;
    }
}
