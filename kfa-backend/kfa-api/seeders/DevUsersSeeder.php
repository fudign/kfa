<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DevUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Создаем роли, если их еще нет
        $roles = [
            'admin' => 'Администратор',
            'editor' => 'Редактор',
            'moderator' => 'Модератор',
            'member' => 'Участник',
        ];

        foreach ($roles as $roleName => $displayName) {
            Role::firstOrCreate(
                ['name' => $roleName],
                ['display_name' => $displayName, 'description' => "Роль {$displayName}"]
            );
        }

        // Создаем необходимые права
        $permissions = [
            // Content permissions
            ['name' => 'content.view', 'display_name' => 'Просмотр контента', 'category' => 'content'],
            ['name' => 'content.create', 'display_name' => 'Создание контента', 'category' => 'content'],
            ['name' => 'content.update', 'display_name' => 'Редактирование контента', 'category' => 'content'],
            ['name' => 'content.delete', 'display_name' => 'Удаление контента', 'category' => 'content'],

            // Media permissions
            ['name' => 'media.view', 'display_name' => 'Просмотр медиа', 'category' => 'media'],
            ['name' => 'media.upload', 'display_name' => 'Загрузка медиа', 'category' => 'media'],
            ['name' => 'media.delete', 'display_name' => 'Удаление медиа', 'category' => 'media'],

            // Events permissions
            ['name' => 'events.view', 'display_name' => 'Просмотр событий', 'category' => 'events'],
            ['name' => 'events.create', 'display_name' => 'Создание событий', 'category' => 'events'],
            ['name' => 'events.update', 'display_name' => 'Редактирование событий', 'category' => 'events'],
            ['name' => 'events.delete', 'display_name' => 'Удаление событий', 'category' => 'events'],

            // Members permissions
            ['name' => 'members.view', 'display_name' => 'Просмотр участников', 'category' => 'members'],
            ['name' => 'members.create', 'display_name' => 'Добавление участников', 'category' => 'members'],
            ['name' => 'members.update', 'display_name' => 'Редактирование участников', 'category' => 'members'],
            ['name' => 'members.delete', 'display_name' => 'Удаление участников', 'category' => 'members'],

            // Partners permissions
            ['name' => 'partners.view', 'display_name' => 'Просмотр партнеров', 'category' => 'partners'],
            ['name' => 'partners.create', 'display_name' => 'Добавление партнеров', 'category' => 'partners'],
            ['name' => 'partners.update', 'display_name' => 'Редактирование партнеров', 'category' => 'partners'],
            ['name' => 'partners.delete', 'display_name' => 'Удаление партнеров', 'category' => 'partners'],

            // Settings permissions
            ['name' => 'settings.view', 'display_name' => 'Просмотр настроек', 'category' => 'settings'],
            ['name' => 'settings.update', 'display_name' => 'Изменение настроек', 'category' => 'settings'],
        ];

        foreach ($permissions as $permData) {
            Permission::firstOrCreate(
                ['name' => $permData['name']],
                [
                    'display_name' => $permData['display_name'],
                    'category' => $permData['category'],
                    'description' => $permData['display_name']
                ]
            );
        }

        // Назначаем права ролям
        $adminRole = Role::where('name', 'admin')->first();
        $editorRole = Role::where('name', 'editor')->first();
        $moderatorRole = Role::where('name', 'moderator')->first();
        $memberRole = Role::where('name', 'member')->first();

        // Admin - все права
        $adminRole->syncPermissions(Permission::all());

        // Editor - создание и редактирование контента, событий
        $editorRole->syncPermissions([
            'content.view',
            'content.create',
            'content.update',
            'events.view',
            'events.create',
            'events.update',
            'media.view',
            'media.upload',
        ]);

        // Moderator - модерация контента, событий и участников
        $moderatorRole->syncPermissions([
            'content.view',
            'content.update',
            'content.delete',
            'events.view',
            'events.update',
            'events.delete',
            'members.view',
            'members.update',
            'media.view',
        ]);

        // Member - только просмотр контента и медиа
        $memberRole->syncPermissions([
            'content.view',
            'media.view',
            'events.view',
        ]);

        // Создаем тестовых пользователей
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@kfa.kg',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Editor User',
                'email' => 'editor@kfa.kg',
                'password' => 'password',
                'role' => 'editor',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Moderator User',
                'email' => 'moderator@kfa.kg',
                'password' => 'password',
                'role' => 'moderator',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Member User',
                'email' => 'member@kfa.kg',
                'password' => 'password',
                'role' => 'member',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'email_verified_at' => $userData['email_verified_at'],
                ]
            );

            // Назначаем роль
            if (!$user->hasRole($userData['role'])) {
                $user->assignRole($userData['role']);
            }

            echo "✓ Пользователь {$userData['name']} ({$userData['email']}) создан/обновлен\n";
        }

        echo "\n✅ Тестовые пользователи созданы!\n";
        echo "\nДоступные аккаунты для входа:\n";
        echo "  👑 Admin: admin@kfa.kg / password\n";
        echo "  ✍️ Editor: editor@kfa.kg / password\n";
        echo "  🛡️ Moderator: moderator@kfa.kg / password\n";
        echo "  👤 Member: member@kfa.kg / password\n";
    }
}
