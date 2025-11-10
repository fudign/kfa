<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User', 'email' => 'admin@kfa.kg', 'role' => 'admin'],
            ['name' => 'Editor User', 'email' => 'editor@kfa.kg', 'role' => 'editor'],
            ['name' => 'Moderator User', 'email' => 'moderator@kfa.kg', 'role' => 'moderator'],
            ['name' => 'Member User', 'email' => 'member@kfa.kg', 'role' => 'member'],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => bcrypt('password'),
                ]
            );

            $user->assignRole($userData['role']);
        }
    }
}
