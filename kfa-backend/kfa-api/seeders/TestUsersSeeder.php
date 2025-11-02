<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing test users
        User::whereIn('email', [
            'admin@kfa.kg',
            'member@kfa.kg',
            'member2@kfa.kg',
            'user@kfa.kg',
        ])->delete();

        // Create Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@kfa.kg',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        $this->command->info('✅ Admin user created: admin@kfa.kg / password');

        // Create Member user
        $member = User::create([
            'name' => 'Member User',
            'email' => 'member@kfa.kg',
            'password' => Hash::make('password'),
            'role' => 'member',
            'email_verified_at' => now(),
        ]);
        $member->assignRole('member');

        $this->command->info('✅ Member user created: member@kfa.kg / password');

        // Create Second Member user
        $member2 = User::create([
            'name' => 'Member User 2',
            'email' => 'member2@kfa.kg',
            'password' => Hash::make('password'),
            'role' => 'member',
            'email_verified_at' => now(),
        ]);
        $member2->assignRole('member');

        $this->command->info('✅ Member2 user created: member2@kfa.kg / password');

        // Create Regular user (no role in Spatie)
        User::create([
            'name' => 'Regular User',
            'email' => 'user@kfa.kg',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Regular user created: user@kfa.kg / password');

        $this->command->info('');
        $this->command->info('All test users password: password');
    }
}
