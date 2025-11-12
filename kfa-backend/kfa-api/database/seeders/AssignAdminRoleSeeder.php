<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AssignAdminRoleSeeder extends Seeder
{
    /**
     * Assign admin role to existing users
     */
    public function run(): void
    {
        // Get admin role
        $adminRole = DB::table('roles')->where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error('Admin role not found! Run RolesAndPermissionsSeeder first.');
            return;
        }

        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found in database');
            return;
        }

        foreach ($users as $user) {
            // Check if user already has admin role
            $hasRole = DB::table('model_has_roles')
                ->where('model_type', User::class)
                ->where('model_id', $user->id)
                ->where('role_id', $adminRole->id)
                ->exists();

            if (!$hasRole) {
                // Assign admin role
                DB::table('model_has_roles')->insert([
                    'role_id' => $adminRole->id,
                    'model_type' => User::class,
                    'model_id' => $user->id,
                ]);

                $this->command->info("✅ Assigned admin role to: {$user->name} ({$user->email})");
            } else {
                $this->command->info("ℹ️  User {$user->name} already has admin role");
            }
        }

        $this->command->info('✅ Admin roles assigned successfully!');
    }
}
