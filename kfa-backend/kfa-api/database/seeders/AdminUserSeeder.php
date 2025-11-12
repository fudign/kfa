<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            ['display_name' => 'Super Administrator', 'description' => 'Full system access']
        );
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator', 'description' => 'Administrative access']
        );
        $memberRole = Role::firstOrCreate(
            ['name' => 'member'],
            ['display_name' => 'Member', 'description' => 'KFA member access']
        );

        // Create admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@kfa.kg'],
            [
                'name' => 'KFA Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign super_admin role
        if (!$admin->hasRole('super_admin')) {
            $admin->assignRole($superAdminRole);
        }

        $this->command->info('✅ Admin user created: admin@kfa.kg / password');

        // Create a test member user
        $member = User::updateOrCreate(
            ['email' => 'member@kfa.kg'],
            [
                'name' => 'Test Member',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (!$member->hasRole('member')) {
            $member->assignRole($memberRole);
        }

        $this->command->info('✅ Member user created: member@kfa.kg / password');
    }
}
