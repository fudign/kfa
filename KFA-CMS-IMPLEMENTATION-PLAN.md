# 🎯 ПЛАН РЕАЛИЗАЦИИ СИСТЕМЫ УПРАВЛЕНИЯ КОНТЕНТОМ КФА

**Дата создания:** 2025-10-23
**Версия:** 1.0
**Статус:** Готов к реализации

---

## 📋 СОДЕРЖАНИЕ

1. [Обзор требований](#1-обзор-требований)
2. [Архитектура системы](#2-архитектура-системы)
3. [Система управления ролями (RBAC)](#3-система-управления-ролями-rbac)
4. [Система управления медиа-файлами](#4-система-управления-медиа-файлами)
5. [Управление партнерами и членами](#5-управление-партнерами-и-членами)
6. [Административная панель (UX/UI)](#6-административная-панель-uxui)
7. [Управление настройками сайта](#7-управление-настройками-сайта)
8. [План реализации (Timeline)](#8-план-реализации-timeline)
9. [API Endpoints](#9-api-endpoints)
10. [Database Schema](#10-database-schema)

---

## 1. ОБЗОР ТРЕБОВАНИЙ

### 1.1 Функциональные требования

**Управление медиа-файлами:**
- ✅ Загрузка фото для новостей (JPG, PNG, WebP)
- ✅ Загрузка логотипов с поддержкой SVG и PNG
- ✅ Предпросмотр изображений перед загрузкой
- ✅ Оптимизация изображений (сжатие, изменение размера)
- ✅ Управление медиа-библиотекой
- ✅ Удаление неиспользуемых файлов

**Управление партнерами и членами:**
- ✅ Добавление новых партнеров/членов
- ✅ Редактирование информации
- ✅ Удаление записей
- ✅ Изменение статуса (активный, неактивный)
- ✅ Загрузка логотипов/фото
- ✅ Контроль доступа по ролям

**Управление настройками сайта:**
- ✅ Общие настройки (название сайта, описание, контакты)
- ✅ Настройки социальных сетей
- ✅ SEO настройки (meta tags, Open Graph)
- ✅ Настройки уведомлений
- ✅ Кастомизация внешнего вида

### 1.2 Роли пользователей

| Роль | Описание | Права доступа |
|------|----------|---------------|
| **guest** | Гость (не авторизован) | Только публичный контент |
| **member** | Член КФА | Личный кабинет, закрытые материалы |
| **editor** | Редактор контента | Управление новостями, событиями, материалами |
| **moderator** | Модератор | Управление членами, партнерами, модерация |
| **admin** | Администратор | Полный доступ ко всей системе |
| **super_admin** | Суперадминистратор | Управление администраторами, настройки системы |

### 1.3 Текущее состояние проекта

**Backend (Laravel 11):**
- ✅ Базовая аутентификация (Laravel Sanctum)
- ✅ Простая система ролей (admin, member, guest)
- ✅ Миграции: users, members, news, events, programs
- ✅ API Controllers: Auth, Member, News, Event, Program
- ✅ PostgreSQL + Redis

**Frontend (React + TypeScript):**
- ✅ 18 страниц (9 публичных, 4 auth, 5 dashboard)
- ✅ Internationalization (RU/KY/EN)
- ✅ TailwindCSS + shadcn/ui
- ✅ Zustand для state management

**Что нужно добавить:**
- ❌ Расширенная система ролей (RBAC)
- ❌ Система управления медиа-файлами
- ❌ Административная панель для управления контентом
- ❌ Управление партнерами и членами
- ❌ Управление настройками сайта

---

## 2. АРХИТЕКТУРА СИСТЕМЫ

### 2.1 Общая структура

```
KFA Platform
│
├── Backend API (Laravel 11)
│   ├── Authentication (Sanctum)
│   ├── RBAC System (Roles & Permissions)
│   ├── Media Management
│   ├── Content Management
│   └── Settings Management
│
├── Frontend SPA (React + TypeScript)
│   ├── Public Pages
│   ├── Member Dashboard
│   └── Admin Panel
│       ├── Content Manager
│       ├── Media Library
│       ├── Partners & Members
│       └── Site Settings
│
└── Storage
    ├── Local (Development)
    └── S3-compatible (Production)
```

### 2.2 Технологический стек

**Backend:**
- Laravel 11 + PostgreSQL
- Laravel Sanctum (Auth)
- spatie/laravel-permission (RBAC)
- League Flysystem (File storage)
- Intervention Image (Image processing)

**Frontend:**
- React 18 + TypeScript
- TailwindCSS + shadcn/ui
- React Query (Server state)
- Zustand (Client state)
- React Dropzone (File upload)

---

## 3. СИСТЕМА УПРАВЛЕНИЯ РОЛЯМИ (RBAC)

### 3.1 Database Schema

#### Таблица `roles`
```php
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // admin, editor, moderator, member, guest
    $table->string('display_name'); // "Администратор", "Редактор"
    $table->text('description')->nullable();
    $table->timestamps();
});
```

#### Таблица `permissions`
```php
Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique(); // manage_users, edit_news, delete_members
    $table->string('display_name');
    $table->string('category'); // users, content, settings, media
    $table->text('description')->nullable();
    $table->timestamps();
});
```

#### Таблица `role_has_permissions`
```php
Schema::create('role_has_permissions', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->foreignId('permission_id')->constrained()->onDelete('cascade');
    $table->primary(['role_id', 'permission_id']);
});
```

#### Таблица `model_has_roles`
```php
Schema::create('model_has_roles', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->morphs('model'); // user_id, model_type
    $table->primary(['role_id', 'model_id', 'model_type']);
});
```

### 3.2 Permissions List

**Категория: Users**
- `view_users` - Просмотр пользователей
- `create_users` - Создание пользователей
- `edit_users` - Редактирование пользователей
- `delete_users` - Удаление пользователей
- `manage_roles` - Управление ролями

**Категория: Content**
- `view_news` - Просмотр новостей
- `create_news` - Создание новостей
- `edit_news` - Редактирование новостей
- `delete_news` - Удаление новостей
- `publish_news` - Публикация новостей
- `view_events` - Просмотр событий
- `create_events` - Создание событий
- `edit_events` - Редактирование событий
- `delete_events` - Удаление событий

**Категория: Members & Partners**
- `view_members` - Просмотр членов
- `create_members` - Добавление членов
- `edit_members` - Редактирование членов
- `delete_members` - Удаление членов
- `view_partners` - Просмотр партнеров
- `create_partners` - Добавление партнеров
- `edit_partners` - Редактирование партнеров
- `delete_partners` - Удаление партнеров

**Категория: Media**
- `view_media` - Просмотр медиа
- `upload_media` - Загрузка медиа
- `delete_media` - Удаление медиа
- `manage_media` - Управление медиа-библиотекой

**Категория: Settings**
- `view_settings` - Просмотр настроек
- `edit_settings` - Изменение настроек
- `manage_system` - Управление системой

### 3.3 Role Permissions Matrix

| Permission | Guest | Member | Editor | Moderator | Admin | Super Admin |
|------------|-------|--------|--------|-----------|-------|-------------|
| **Users** |
| view_users | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| create_users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| edit_users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| delete_users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| manage_roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Content** |
| view_news | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| create_news | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| edit_news | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| delete_news | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| publish_news | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Members** |
| view_members | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| create_members | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| edit_members | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| delete_members | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Media** |
| view_media | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| upload_media | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| delete_media | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Settings** |
| view_settings | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| edit_settings | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| manage_system | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 3.4 Backend Implementation

#### Middleware: CheckPermission
```php
<?php
// app/Http/Middleware/CheckPermission.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user() || !$request->user()->hasPermission($permission)) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.'
            ], 403);
        }

        return $next($request);
    }
}
```

#### Model: User (Extended)
```php
<?php
// app/Models/User.php

use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    // ... existing code ...

    /**
     * Check if user has permission
     */
    public function hasPermission(string $permission): bool
    {
        return $this->hasPermissionTo($permission);
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->hasAnyPermission($permissions);
    }

    /**
     * Check if user is super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }
}
```

### 3.5 Frontend Implementation

#### Hook: usePermissions
```typescript
// src/hooks/usePermissions.ts

import { useAuthStore } from '@/stores/authStore';

interface UsePermissionsReturn {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some((role) => user.roles?.includes(role));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
}
```

#### Component: Can (Permission Guard)
```typescript
// src/components/auth/Can.tsx

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface CanProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  role?: string;
  roles?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({
  permission,
  permissions,
  requireAll = false,
  role,
  roles,
  fallback = null,
  children,
}: CanProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermissions();

  let authorized = false;

  // Check single permission
  if (permission && hasPermission(permission)) {
    authorized = true;
  }

  // Check multiple permissions
  if (permissions) {
    if (requireAll) {
      authorized = hasAllPermissions(permissions);
    } else {
      authorized = hasAnyPermission(permissions);
    }
  }

  // Check single role
  if (role && hasRole(role)) {
    authorized = true;
  }

  // Check multiple roles
  if (roles && hasAnyRole(roles)) {
    authorized = true;
  }

  if (!authorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

#### Usage Example
```tsx
import { Can } from '@/components/auth/Can';

function NewsManagement() {
  return (
    <div>
      <h1>Управление новостями</h1>

      {/* Show only for users with create_news permission */}
      <Can permission="create_news">
        <Button onClick={handleCreateNews}>Создать новость</Button>
      </Can>

      {/* Show only for users with any of these permissions */}
      <Can permissions={['edit_news', 'delete_news']}>
        <NewsActions />
      </Can>

      {/* Show only for admins or super admins */}
      <Can roles={['admin', 'super_admin']}>
        <AdvancedSettings />
      </Can>
    </div>
  );
}
```

---

## 4. СИСТЕМА УПРАВЛЕНИЯ МЕДИА-ФАЙЛАМИ

### 4.1 Database Schema

#### Таблица `media`
```php
Schema::create('media', function (Blueprint $table) {
    $table->id();
    $table->string('filename'); // original filename
    $table->string('path'); // storage path
    $table->string('disk')->default('public'); // storage disk
    $table->string('mime_type');
    $table->integer('size'); // bytes
    $table->integer('width')->nullable(); // for images
    $table->integer('height')->nullable(); // for images
    $table->json('metadata')->nullable(); // additional info
    $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
    $table->timestamps();

    $table->index(['mime_type', 'created_at']);
});
```

#### Таблица `mediable` (polymorphic)
```php
Schema::create('mediable', function (Blueprint $table) {
    $table->foreignId('media_id')->constrained()->onDelete('cascade');
    $table->morphs('mediable'); // mediable_id, mediable_type
    $table->string('collection')->default('default'); // avatar, gallery, logo

    $table->primary(['media_id', 'mediable_id', 'mediable_type', 'collection']);
});
```

### 4.2 Supported File Types

**Images:**
- Formats: JPG, JPEG, PNG, WebP, GIF, SVG
- Max size: 5MB (configurable)
- Allowed for: News, Events, Members, Partners, Settings

**Documents:**
- Formats: PDF, DOC, DOCX, XLS, XLSX
- Max size: 10MB (configurable)
- Allowed for: News, Events, Programs

**Archives:**
- Formats: ZIP, RAR
- Max size: 20MB (configurable)
- Allowed for: specific content types

### 4.3 Image Processing

**Автоматическая обработка при загрузке:**
1. **Validation** - проверка типа, размера, dimensions
2. **Optimization** - сжатие без потери качества (80-90%)
3. **Thumbnails** - создание превью (200x200, 400x400, 800x800)
4. **Watermark** - опциональный watermark для определенных типов
5. **Storage** - сохранение в storage (local/s3)

**Поддерживаемые размеры:**
- `thumbnail` - 200x200 (квадрат)
- `small` - 400x400 (квадрат)
- `medium` - 800x600 (сохранение пропорций)
- `large` - 1200x900 (сохранение пропорций)
- `original` - оригинальный размер

### 4.4 Backend Implementation

#### Model: Media
```php
<?php
// app/Models/Media.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $fillable = [
        'filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'width',
        'height',
        'metadata',
        'uploaded_by',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user who uploaded the media
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the full URL of the media file
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Get the thumbnail URL
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->metadata && isset($this->metadata['thumbnails']['thumbnail'])) {
            return Storage::disk($this->disk)->url($this->metadata['thumbnails']['thumbnail']);
        }
        return $this->url;
    }

    /**
     * Check if media is an image
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if media is SVG
     */
    public function isSvg(): bool
    {
        return $this->mime_type === 'image/svg+xml';
    }

    /**
     * Get human-readable file size
     */
    public function getHumanSizeAttribute(): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->size;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 2) . ' ' . $units[$unit];
    }
}
```

#### Service: MediaService
```php
<?php
// app/Services/MediaService.php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;

class MediaService
{
    protected array $allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    protected int $maxFileSize = 5 * 1024 * 1024; // 5MB

    protected array $thumbnailSizes = [
        'thumbnail' => 200,
        'small' => 400,
        'medium' => 800,
        'large' => 1200,
    ];

    /**
     * Upload and process file
     */
    public function upload(UploadedFile $file, int $userId): Media
    {
        // Validate
        $this->validateFile($file);

        // Generate unique filename
        $filename = $this->generateFilename($file);
        $path = 'media/' . date('Y/m/d');

        // Store original file
        $fullPath = $file->storeAs($path, $filename, 'public');

        // Get dimensions (for images)
        [$width, $height] = $this->getImageDimensions($file);

        // Create thumbnails
        $thumbnails = $this->createThumbnails($file, $path, $filename);

        // Create media record
        return Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $fullPath,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'metadata' => [
                'thumbnails' => $thumbnails,
            ],
            'uploaded_by' => $userId,
        ]);
    }

    /**
     * Validate uploaded file
     */
    protected function validateFile(UploadedFile $file): void
    {
        // Check mime type
        if (!in_array($file->getMimeType(), $this->allowedMimeTypes)) {
            throw new \Exception('Неподдерживаемый тип файла');
        }

        // Check file size
        if ($file->getSize() > $this->maxFileSize) {
            $maxSizeMB = $this->maxFileSize / 1024 / 1024;
            throw new \Exception("Размер файла не должен превышать {$maxSizeMB}MB");
        }
    }

    /**
     * Generate unique filename
     */
    protected function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        return Str::random(40) . '.' . $extension;
    }

    /**
     * Get image dimensions
     */
    protected function getImageDimensions(UploadedFile $file): array
    {
        if (!str_starts_with($file->getMimeType(), 'image/')) {
            return [null, null];
        }

        if ($file->getMimeType() === 'image/svg+xml') {
            return [null, null]; // SVG doesn't have fixed dimensions
        }

        try {
            $image = Image::make($file);
            return [$image->width(), $image->height()];
        } catch (\Exception $e) {
            return [null, null];
        }
    }

    /**
     * Create thumbnails for images
     */
    protected function createThumbnails(UploadedFile $file, string $path, string $filename): array
    {
        if (!str_starts_with($file->getMimeType(), 'image/')) {
            return [];
        }

        if ($file->getMimeType() === 'image/svg+xml') {
            return []; // Don't create thumbnails for SVG
        }

        $thumbnails = [];
        $image = Image::make($file);

        foreach ($this->thumbnailSizes as $name => $size) {
            $thumbFilename = pathinfo($filename, PATHINFO_FILENAME) . "_{$name}." .
                            pathinfo($filename, PATHINFO_EXTENSION);

            $thumbPath = $path . '/' . $thumbFilename;

            // Resize and optimize
            $thumb = clone $image;
            $thumb->resize($size, $size, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $thumb->encode('jpg', 85);

            // Save thumbnail
            Storage::disk('public')->put($thumbPath, $thumb->stream());

            $thumbnails[$name] = $thumbPath;
        }

        return $thumbnails;
    }

    /**
     * Delete media and its files
     */
    public function delete(Media $media): bool
    {
        // Delete original file
        Storage::disk($media->disk)->delete($media->path);

        // Delete thumbnails
        if ($media->metadata && isset($media->metadata['thumbnails'])) {
            foreach ($media->metadata['thumbnails'] as $thumbnail) {
                Storage::disk($media->disk)->delete($thumbnail);
            }
        }

        // Delete database record
        return $media->delete();
    }
}
```

#### Controller: MediaController
```php
<?php
// app/Http/Controllers/Api/MediaController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function __construct(private MediaService $mediaService)
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:upload_media')->only(['store']);
        $this->middleware('permission:delete_media')->only(['destroy']);
    }

    /**
     * Get all media files
     */
    public function index(Request $request): JsonResponse
    {
        $media = Media::query()
            ->with('uploader:id,name')
            ->when($request->type, function ($query, $type) {
                $query->where('mime_type', 'like', $type . '%');
            })
            ->latest()
            ->paginate(20);

        return response()->json($media);
    }

    /**
     * Upload new media file
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,jpg,png,gif,webp,svg|max:5120',
        ]);

        try {
            $media = $this->mediaService->upload(
                $request->file('file'),
                $request->user()->id
            );

            return response()->json([
                'message' => 'Файл успешно загружен',
                'data' => $media,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get single media file
     */
    public function show(Media $media): JsonResponse
    {
        $media->load('uploader:id,name');
        return response()->json($media);
    }

    /**
     * Delete media file
     */
    public function destroy(Media $media): JsonResponse
    {
        try {
            $this->mediaService->delete($media);

            return response()->json([
                'message' => 'Файл успешно удален',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ошибка при удалении файла',
            ], 500);
        }
    }
}
```

### 4.5 Frontend Implementation

#### Component: MediaUpload
```tsx
// src/components/media/MediaUpload.tsx

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { uploadMedia } from '@/api/endpoints/media';

interface MediaUploadProps {
  onUploadComplete: (media: Media) => void;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
}

interface Media {
  id: number;
  filename: string;
  url: string;
  thumbnail_url: string;
  mime_type: string;
  size: number;
  human_size: string;
}

export function MediaUpload({
  onUploadComplete,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setError(null);
      setUploading(true);

      // Show preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      try {
        const media = await uploadMedia(file);
        onUploadComplete(media);
        setPreview(null);
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке файла');
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled: uploading,
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>

            {isDragActive ? (
              <p className="text-lg font-medium">Отпустите файл здесь...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Перетащите файл сюда или нажмите для выбора
                </p>
                <p className="text-sm text-gray-500">
                  Поддерживаются: JPG, PNG, WebP, SVG, GIF (до {maxSize / 1024 / 1024}MB)
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse w-1/2" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Загрузка...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border-2 border-primary rounded-lg p-4">
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>

          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain rounded"
          />

          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded">
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                  <div className="bg-primary h-2 rounded-full animate-pulse w-1/2" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Загрузка...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
```

#### Component: MediaLibrary
```tsx
// src/components/media/MediaLibrary.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMedia, deleteMedia } from '@/api/endpoints/media';
import { Can } from '@/components/auth/Can';

interface Media {
  id: number;
  filename: string;
  url: string;
  thumbnail_url: string;
  mime_type: string;
  size: number;
  human_size: string;
  width?: number;
  height?: number;
  created_at: string;
  uploader: {
    id: number;
    name: string;
  };
}

interface MediaLibraryProps {
  onSelect?: (media: Media) => void;
  selectable?: boolean;
}

export function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['media'],
    queryFn: getMedia,
  });

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return;

    try {
      await deleteMedia(mediaId);
      refetch();
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const handleSelect = (media: Media) => {
    if (selectable && onSelect) {
      onSelect(media);
    }
    setSelectedMedia(media);
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.data.map((media: Media) => (
          <Card
            key={media.id}
            className={`p-2 cursor-pointer hover:shadow-lg transition-shadow ${
              selectedMedia?.id === media.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(media)}
          >
            <div className="aspect-square relative rounded overflow-hidden bg-gray-100">
              {media.mime_type.startsWith('image/') ? (
                <img
                  src={media.thumbnail_url}
                  alt={media.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-xs truncate font-medium">{media.filename}</p>
              <p className="text-xs text-gray-500">{media.human_size}</p>
            </div>

            <div className="mt-2 flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(media.url, '_blank');
                }}
              >
                <Download className="w-3 h-3" />
              </Button>

              <Can permission="delete_media">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(media.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </Can>
            </div>
          </Card>
        ))}
      </div>

      {selectedMedia && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Информация о файле</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Имя файла</dt>
              <dd className="font-medium">{selectedMedia.filename}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Размер</dt>
              <dd className="font-medium">{selectedMedia.human_size}</dd>
            </div>
            {selectedMedia.width && selectedMedia.height && (
              <div>
                <dt className="text-gray-500">Размеры</dt>
                <dd className="font-medium">
                  {selectedMedia.width} x {selectedMedia.height}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">Тип</dt>
              <dd className="font-medium">{selectedMedia.mime_type}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Загружено</dt>
              <dd className="font-medium">
                {new Date(selectedMedia.created_at).toLocaleDateString('ru-RU')}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Автор</dt>
              <dd className="font-medium">{selectedMedia.uploader.name}</dd>
            </div>
          </dl>
        </Card>
      )}
    </div>
  );
}
```

---

## 5. УПРАВЛЕНИЕ ПАРТНЕРАМИ И ЧЛЕНАМИ

### 5.1 Database Schema Updates

#### Обновление таблицы `members`
```php
Schema::table('members', function (Blueprint $table) {
    $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
    $table->enum('type', ['individual', 'organization'])->default('individual');
    $table->string('phone')->nullable();
    $table->string('website')->nullable();
    $table->text('address')->nullable();
    $table->json('social_links')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->integer('display_order')->default(0);
});
```

#### Новая таблица `partners`
```php
Schema::create('partners', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->string('logo')->nullable(); // media path
    $table->string('website')->nullable();
    $table->string('email')->nullable();
    $table->string('phone')->nullable();
    $table->enum('category', ['platinum', 'gold', 'silver', 'bronze', 'other'])->default('other');
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->boolean('is_featured')->default(false);
    $table->integer('display_order')->default(0);
    $table->json('social_links')->nullable();
    $table->timestamps();

    $table->index(['status', 'category']);
});
```

### 5.2 Backend Implementation

#### Model: Partner
```php
<?php
// app/Models/Partner.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'website',
        'email',
        'phone',
        'category',
        'status',
        'is_featured',
        'display_order',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * Get partner's media files
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable');
    }

    /**
     * Get partner's logo
     */
    public function getLogoUrlAttribute(): ?string
    {
        if ($this->logo) {
            return Storage::url($this->logo);
        }
        return null;
    }

    /**
     * Scope for active partners
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for featured partners
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
```

#### Controller: PartnerController
```php
<?php
// app/Http/Controllers/Api/PartnerController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PartnerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        $this->middleware('permission:create_partners')->only(['store']);
        $this->middleware('permission:edit_partners')->only(['update']);
        $this->middleware('permission:delete_partners')->only(['destroy']);
    }

    /**
     * Get all partners
     */
    public function index(Request $request): JsonResponse
    {
        $partners = Partner::query()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->featured, function ($query) {
                $query->where('is_featured', true);
            })
            ->orderBy('display_order')
            ->orderBy('name')
            ->paginate(20);

        return response()->json($partners);
    }

    /**
     * Create new partner
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'required|in:platinum,gold,silver,bronze,other',
            'status' => 'required|in:active,inactive',
            'is_featured' => 'boolean',
            'display_order' => 'integer|min:0',
            'social_links' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $partner = Partner::create($validated);

        return response()->json([
            'message' => 'Партнер успешно добавлен',
            'data' => $partner,
        ], 201);
    }

    /**
     * Get single partner
     */
    public function show(Partner $partner): JsonResponse
    {
        return response()->json($partner);
    }

    /**
     * Update partner
     */
    public function update(Request $request, Partner $partner): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'category' => 'in:platinum,gold,silver,bronze,other',
            'status' => 'in:active,inactive',
            'is_featured' => 'boolean',
            'display_order' => 'integer|min:0',
            'social_links' => 'nullable|array',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $partner->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $partner->update($validated);

        return response()->json([
            'message' => 'Партнер успешно обновлен',
            'data' => $partner,
        ]);
    }

    /**
     * Delete partner
     */
    public function destroy(Partner $partner): JsonResponse
    {
        $partner->delete();

        return response()->json([
            'message' => 'Партнер успешно удален',
        ]);
    }
}
```

### 5.3 Frontend Implementation

#### Page: PartnersManagement
```tsx
// src/pages/admin/PartnersManagement.tsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Can } from '@/components/auth/Can';
import { PartnerForm } from '@/components/partners/PartnerForm';
import { getPartners, deletePartner } from '@/api/endpoints/partners';

interface Partner {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  is_featured: boolean;
  display_order: number;
}

export function PartnersManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: getPartners,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const handleDelete = async (partnerId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого партнера?')) return;
    deleteMutation.mutate(partnerId);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPartner(null);
  };

  const categoryLabels: Record<string, string> = {
    platinum: 'Платиновый',
    gold: 'Золотой',
    silver: 'Серебряный',
    bronze: 'Бронзовый',
    other: 'Другой',
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление партнерами</h1>

        <Can permission="create_partners">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить партнера
          </Button>
        </Can>
      </div>

      <div className="grid gap-4">
        {data?.data.map((partner: Partner) => (
          <Card key={partner.id} className="p-4">
            <div className="flex items-start gap-4">
              {partner.logo_url && (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-20 h-20 object-contain rounded"
                />
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{partner.name}</h3>
                    <p className="text-sm text-gray-500">
                      {categoryLabels[partner.category]}
                      {partner.is_featured && ' • Избранный'}
                      {' • '}
                      {partner.status === 'active' ? 'Активен' : 'Неактивен'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(partner.website, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Can permission="edit_partners">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(partner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Can>

                    <Can permission="delete_partners">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(partner.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Can>
                  </div>
                </div>

                {partner.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {partner.description}
                  </p>
                )}

                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {partner.email && <span>{partner.email}</span>}
                  {partner.phone && <span>{partner.phone}</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <PartnerForm
          partner={editingPartner}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries({ queryKey: ['partners'] });
          }}
        />
      )}
    </div>
  );
}
```

---

## 6. АДМИНИСТРАТИВНАЯ ПАНЕЛЬ (UX/UI)

### 6.1 Структура административной панели

```
Admin Panel
│
├── Dashboard (Главная)
│   ├── Статистика (пользователи, контент, трафик)
│   ├── Недавние действия
│   └── Быстрые действия
│
├── Контент
│   ├── Новости (список, создание, редактирование)
│   ├── События (список, создание, редактирование)
│   ├── Программы (список, создание, редактирование)
│   └── Страницы (список, создание, редактирование)
│
├── Члены и партнеры
│   ├── Члены КФА (список, управление)
│   ├── Партнеры (список, управление)
│   └── Заявки на членство
│
├── Медиа
│   ├── Медиа-библиотека
│   └── Загрузка файлов
│
├── Пользователи
│   ├── Список пользователей
│   ├── Роли и права
│   └── Активность
│
└── Настройки
    ├── Общие настройки
    ├── SEO настройки
    ├── Социальные сети
    ├── Уведомления
    └── Система
```

### 6.2 UI Components Design System

**Цветовая палитра:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Primary (Brand color КФА)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Secondary
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Success
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        // Warning
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        // Error
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
      },
    },
  },
};
```

**Typography:**
- Headings: Inter Bold
- Body: Inter Regular
- Code: JetBrains Mono

### 6.3 Layout Components

#### AdminLayout
```tsx
// src/components/layout/AdminLayout.tsx

import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Image,
  Settings,
  Menu,
  X,
  LogOut,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { Can } from '@/components/auth/Can';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  permission?: string;
}

const navigation: NavItem[] = [
  {
    title: 'Панель управления',
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'Контент',
    href: '/admin/content',
    icon: <FileText className="w-5 h-5" />,
    permission: 'view_news',
  },
  {
    title: 'Члены и партнеры',
    href: '/admin/members-partners',
    icon: <Users className="w-5 h-5" />,
    permission: 'view_members',
  },
  {
    title: 'Медиа',
    href: '/admin/media',
    icon: <Image className="w-5 h-5" />,
    permission: 'view_media',
  },
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: <UserCircle className="w-5 h-5" />,
    permission: 'view_users',
  },
  {
    title: 'Настройки',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    permission: 'view_settings',
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <span className="text-lg font-bold">КФА Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;

              const navLink = (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              );

              if (item.permission) {
                return (
                  <Can key={item.href} permission={item.permission}>
                    {navLink}
                  </Can>
                );
              }

              return navLink;
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Breadcrumbs or page title */}
              <h1 className="text-xl font-semibold">
                {navigation.find((item) => item.href === location.pathname)
                  ?.title || 'Админ-панель'}
              </h1>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-4">
              {/* Notifications, profile, etc. */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

### 6.4 Dashboard Components

#### AdminDashboard
```tsx
// src/pages/admin/Dashboard.tsx

import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAdminStats } from '@/api/endpoints/admin';

interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
}

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const statCards: Stat[] = [
    {
      title: 'Всего пользователей',
      value: stats?.users_count || 0,
      change: '+12% за месяц',
      changeType: 'positive',
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: 'Новости',
      value: stats?.news_count || 0,
      change: '+5 за неделю',
      changeType: 'positive',
      icon: <FileText className="w-8 h-8" />,
    },
    {
      title: 'События',
      value: stats?.events_count || 0,
      change: '3 предстоящих',
      changeType: 'neutral',
      icon: <Calendar className="w-8 h-8" />,
    },
    {
      title: 'Посещаемость',
      value: stats?.visits_count || 0,
      change: '+18% за месяц',
      changeType: 'positive',
      icon: <TrendingUp className="w-8 h-8" />,
    },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-gray-500 mt-1">
          Добро пожаловать в административную панель КФА
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p
                  className={`text-sm mt-2 ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Недавние новости</h2>
          {/* Recent news list */}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Предстоящие события</h2>
          {/* Upcoming events list */}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Quick action buttons */}
        </div>
      </Card>
    </div>
  );
}
```

---

## 7. УПРАВЛЕНИЕ НАСТРОЙКАМИ САЙТА

### 7.1 Database Schema

#### Таблица `site_settings`
```php
Schema::create('site_settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique(); // site_name, site_description, logo
    $table->text('value')->nullable();
    $table->string('type')->default('text'); // text, textarea, image, boolean, json
    $table->string('category'); // general, seo, social, appearance
    $table->string('label');
    $table->text('description')->nullable();
    $table->timestamps();

    $table->index(['category']);
});
```

### 7.2 Settings Categories

**General Settings:**
- `site_name` - Название сайта
- `site_description` - Описание сайта
- `site_logo` - Логотип сайта
- `site_favicon` - Favicon
- `contact_email` - Контактный email
- `contact_phone` - Контактный телефон
- `contact_address` - Адрес офиса

**SEO Settings:**
- `meta_title` - Default meta title
- `meta_description` - Default meta description
- `meta_keywords` - Default meta keywords
- `og_image` - Default Open Graph image
- `google_analytics_id` - Google Analytics ID
- `yandex_metrika_id` - Yandex Metrika ID

**Social Media:**
- `social_facebook` - Facebook URL
- `social_instagram` - Instagram URL
- `social_twitter` - Twitter URL
- `social_linkedin` - LinkedIn URL
- `social_youtube` - YouTube URL
- `social_telegram` - Telegram URL

**Appearance:**
- `primary_color` - Primary brand color
- `header_type` - Header style
- `footer_text` - Footer copyright text

**Notifications:**
- `email_notifications` - Enable email notifications
- `notification_email` - Notification recipient email

### 7.3 Backend Implementation

#### Model: SiteSetting
```php
<?php
// app/Models/SiteSetting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'category',
        'label',
        'description',
    ];

    /**
     * Get setting value by key
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set setting value
     */
    public static function set(string $key, $value): void
    {
        $setting = static::firstOrCreate(['key' => $key]);
        $setting->value = $value;
        $setting->save();

        // Clear cache
        Cache::forget("setting_{$key}");
    }

    /**
     * Get all settings by category
     */
    public static function getByCategory(string $category): array
    {
        return static::where('category', $category)
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Clear all settings cache
     */
    public static function clearCache(): void
    {
        Cache::tags(['settings'])->flush();
    }
}
```

#### Controller: SettingsController
```php
<?php
// app/Http/Controllers/Api/SettingsController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:view_settings')->only(['index', 'show']);
        $this->middleware('permission:edit_settings')->only(['update']);
    }

    /**
     * Get all settings
     */
    public function index(Request $request): JsonResponse
    {
        $settings = SiteSetting::query()
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->get()
            ->groupBy('category');

        return response()->json($settings);
    }

    /**
     * Get public settings (no auth required)
     */
    public function public(): JsonResponse
    {
        // Only return public-safe settings
        $publicKeys = [
            'site_name',
            'site_description',
            'site_logo',
            'contact_email',
            'contact_phone',
            'social_facebook',
            'social_instagram',
            'social_twitter',
            'social_linkedin',
        ];

        $settings = SiteSetting::whereIn('key', $publicKeys)
            ->get()
            ->pluck('value', 'key');

        return response()->json($settings);
    }

    /**
     * Update settings
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $setting) {
            SiteSetting::set($setting['key'], $setting['value']);
        }

        // Clear cache
        SiteSetting::clearCache();

        return response()->json([
            'message' => 'Настройки успешно обновлены',
        ]);
    }
}
```

### 7.4 Frontend Implementation

#### Page: SiteSettings
```tsx
// src/pages/admin/SiteSettings.tsx

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaUpload } from '@/components/media/MediaUpload';
import { getSettings, updateSettings } from '@/api/endpoints/settings';
import { toast } from 'sonner';

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  category: string;
  label: string;
  description?: string;
}

export function SiteSettings() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    onSuccess: (data) => {
      // Initialize form data from settings
      const initialData: Record<string, any> = {};
      Object.values(data).flat().forEach((setting: Setting) => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Настройки успешно сохранены');
    },
    onError: () => {
      toast.error('Ошибка при сохранении настроек');
    },
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const settingsArray = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
    }));

    updateMutation.mutate({ settings: settingsArray });
  };

  const renderField = (setting: Setting) => {
    const value = formData[setting.key] || '';

    switch (setting.type) {
      case 'textarea':
        return (
          <Textarea
            id={setting.key}
            value={value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={4}
          />
        );

      case 'image':
        return (
          <div>
            {value && (
              <img
                src={value}
                alt={setting.label}
                className="w-32 h-32 object-contain mb-4 border rounded"
              />
            )}
            <MediaUpload
              onUploadComplete={(media) => handleChange(setting.key, media.url)}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={setting.key}
              checked={value === 'true' || value === true}
              onChange={(e) =>
                handleChange(setting.key, e.target.checked.toString())
              }
              className="w-4 h-4 rounded"
            />
            <Label htmlFor={setting.key} className="cursor-pointer">
              Включено
            </Label>
          </div>
        );

      default:
        return (
          <Input
            id={setting.key}
            type="text"
            value={value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
          />
        );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  const categories = [
    { key: 'general', label: 'Общие' },
    { key: 'seo', label: 'SEO' },
    { key: 'social', label: 'Социальные сети' },
    { key: 'appearance', label: 'Внешний вид' },
    { key: 'notifications', label: 'Уведомления' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Настройки сайта</h1>
        <Button onClick={handleSubmit} disabled={updateMutation.isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Сохранить изменения
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category.key} value={category.key}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.key} value={category.key}>
              <Card className="p-6">
                <div className="space-y-6">
                  {(settings?.[category.key] || []).map((setting: Setting) => (
                    <div key={setting.key} className="space-y-2">
                      <Label htmlFor={setting.key}>{setting.label}</Label>
                      {setting.description && (
                        <p className="text-sm text-gray-500">
                          {setting.description}
                        </p>
                      )}
                      {renderField(setting)}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </form>
    </div>
  );
}
```

---

## 8. ПЛАН РЕАЛИЗАЦИИ (TIMELINE)

### Неделя 1-2: Backend Foundation (RBAC + Media)
**Задачи:**
- [ ] Установить и настроить spatie/laravel-permission
- [ ] Создать миграции для RBAC (roles, permissions, role_has_permissions)
- [ ] Создать миграции для медиа (media, mediable)
- [ ] Создать Seeder для ролей и прав доступа
- [ ] Реализовать MediaService для загрузки и обработки файлов
- [ ] Создать MediaController с CRUD endpoints
- [ ] Написать тесты для RBAC и Media

**Deliverables:**
- ✅ RBAC система работает
- ✅ Загрузка изображений работает
- ✅ API endpoints для медиа готовы

---

### Неделя 3-4: Partners & Members Management
**Задачи:**
- [ ] Обновить миграцию members (добавить status, type, social_links)
- [ ] Создать миграцию partners
- [ ] Создать Model Partner с relationships
- [ ] Создать PartnerController с CRUD endpoints
- [ ] Обновить MemberController с поддержкой фото
- [ ] Создать API endpoints для управления партнерами
- [ ] Написать тесты

**Deliverables:**
- ✅ Управление партнерами работает
- ✅ Обновленное управление членами
- ✅ API готов к интеграции с frontend

---

### Неделя 5-6: Site Settings
**Задачи:**
- [ ] Создать миграцию site_settings
- [ ] Создать Model SiteSetting с caching
- [ ] Создать SettingsController
- [ ] Создать Seeder для начальных настроек
- [ ] Реализовать API endpoints для настроек
- [ ] Написать тесты

**Deliverables:**
- ✅ Система настроек работает
- ✅ Кеширование настроек
- ✅ Public API для получения настроек

---

### Неделя 7-9: Frontend Admin Panel (Core)
**Задачи:**
- [ ] Создать AdminLayout компонент
- [ ] Реализовать боковое меню с навигацией
- [ ] Создать AdminDashboard с статистикой
- [ ] Реализовать Can компонент для проверки прав
- [ ] Создать usePermissions hook
- [ ] Настроить routing для admin панели

**Deliverables:**
- ✅ Базовая структура admin панели
- ✅ Система прав доступа на frontend
- ✅ Dashboard с основной статистикой

---

### Неделя 10-11: Frontend Media Management
**Задачи:**
- [ ] Создать MediaUpload компонент
- [ ] Создать MediaLibrary компонент
- [ ] Интегрировать react-dropzone
- [ ] Реализовать preview изображений
- [ ] Создать MediaPicker modal
- [ ] Интегрировать с backend API

**Deliverables:**
- ✅ Загрузка файлов работает
- ✅ Медиа-библиотека функциональна
- ✅ Выбор изображений в формах

---

### Неделя 12-13: Frontend Partners & Members
**Задачи:**
- [ ] Создать PartnersManagement page
- [ ] Создать PartnerForm компонент
- [ ] Обновить MembersManagement page
- [ ] Интегрировать загрузку логотипов
- [ ] Реализовать фильтрацию и поиск
- [ ] Интегрировать с backend API

**Deliverables:**
- ✅ Управление партнерами работает
- ✅ Обновленное управление членами
- ✅ Загрузка логотипов

---

### Неделя 14-15: Frontend Site Settings
**Задачи:**
- [ ] Создать SiteSettings page
- [ ] Реализовать Tabs для категорий
- [ ] Создать форму настроек
- [ ] Интегрировать загрузку логотипа/favicon
- [ ] Реализовать preview изменений
- [ ] Интегрировать с backend API

**Deliverables:**
- ✅ Управление настройками работает
- ✅ Все категории настроек доступны
- ✅ Сохранение настроек

---

### Неделя 16-17: Testing & Polish
**Задачи:**
- [ ] E2E тестирование всех функций
- [ ] Исправление багов
- [ ] Оптимизация производительности
- [ ] Улучшение UX/UI
- [ ] Написание документации
- [ ] Code review

**Deliverables:**
- ✅ Все тесты проходят
- ✅ Баги исправлены
- ✅ Документация готова

---

### Неделя 18: Deployment
**Задачи:**
- [ ] Подготовка production build
- [ ] Настройка production окружения
- [ ] Миграция базы данных
- [ ] Seeding начальных данных
- [ ] Настройка мониторинга
- [ ] Финальное тестирование

**Deliverables:**
- ✅ CMS развернута на production
- ✅ Все функции работают
- ✅ Мониторинг настроен

---

## 9. API ENDPOINTS

### Authentication
```
POST   /api/v1/auth/register       - Регистрация
POST   /api/v1/auth/login          - Вход
POST   /api/v1/auth/logout         - Выход
GET    /api/v1/auth/user           - Текущий пользователь
POST   /api/v1/auth/refresh        - Обновить токен
```

### Users
```
GET    /api/v1/users               - Список пользователей
POST   /api/v1/users               - Создать пользователя
GET    /api/v1/users/{id}          - Получить пользователя
PUT    /api/v1/users/{id}          - Обновить пользователя
DELETE /api/v1/users/{id}          - Удалить пользователя
POST   /api/v1/users/{id}/roles    - Назначить роли
```

### Roles & Permissions
```
GET    /api/v1/roles               - Список ролей
POST   /api/v1/roles               - Создать роль
GET    /api/v1/roles/{id}          - Получить роль
PUT    /api/v1/roles/{id}          - Обновить роль
DELETE /api/v1/roles/{id}          - Удалить роль
GET    /api/v1/permissions         - Список прав
```

### Media
```
GET    /api/v1/media               - Список медиа
POST   /api/v1/media               - Загрузить файл
GET    /api/v1/media/{id}          - Получить медиа
DELETE /api/v1/media/{id}          - Удалить медиа
```

### Partners
```
GET    /api/v1/partners            - Список партнеров
POST   /api/v1/partners            - Создать партнера
GET    /api/v1/partners/{id}       - Получить партнера
PUT    /api/v1/partners/{id}       - Обновить партнера
DELETE /api/v1/partners/{id}       - Удалить партнера
```

### Members
```
GET    /api/v1/members             - Список членов
POST   /api/v1/members             - Создать члена
GET    /api/v1/members/{id}        - Получить члена
PUT    /api/v1/members/{id}        - Обновить члена
DELETE /api/v1/members/{id}        - Удалить члена
```

### News
```
GET    /api/v1/news                - Список новостей
POST   /api/v1/news                - Создать новость
GET    /api/v1/news/{id}           - Получить новость
PUT    /api/v1/news/{id}           - Обновить новость
DELETE /api/v1/news/{id}           - Удалить новость
POST   /api/v1/news/{id}/publish   - Опубликовать новость
```

### Events
```
GET    /api/v1/events              - Список событий
POST   /api/v1/events              - Создать событие
GET    /api/v1/events/{id}         - Получить событие
PUT    /api/v1/events/{id}         - Обновить событие
DELETE /api/v1/events/{id}         - Удалить событие
```

### Programs
```
GET    /api/v1/programs            - Список программ
POST   /api/v1/programs            - Создать программу
GET    /api/v1/programs/{id}       - Получить программу
PUT    /api/v1/programs/{id}       - Обновить программу
DELETE /api/v1/programs/{id}       - Удалить программу
```

### Settings
```
GET    /api/v1/settings            - Все настройки
GET    /api/v1/settings/public     - Публичные настройки
PUT    /api/v1/settings            - Обновить настройки
```

---

## 10. DATABASE SCHEMA

### Roles & Permissions Tables
```sql
-- roles
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- permissions
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- role_has_permissions
CREATE TABLE role_has_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- model_has_roles
CREATE TABLE model_has_roles (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, model_id, model_type)
);
```

### Media Tables
```sql
-- media
CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    disk VARCHAR(50) DEFAULT 'public',
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    metadata JSONB,
    uploaded_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_mime_type (mime_type),
    INDEX idx_created_at (created_at)
);

-- mediable
CREATE TABLE mediable (
    media_id BIGINT REFERENCES media(id) ON DELETE CASCADE,
    mediable_type VARCHAR(255) NOT NULL,
    mediable_id BIGINT NOT NULL,
    collection VARCHAR(100) DEFAULT 'default',
    PRIMARY KEY (media_id, mediable_id, mediable_type, collection)
);
```

### Partners & Members Tables
```sql
-- partners
CREATE TABLE partners (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    category VARCHAR(50) NOT NULL DEFAULT 'other',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    social_links JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_status_category (status, category)
);

-- members (updated)
ALTER TABLE members ADD COLUMN status VARCHAR(20) DEFAULT 'active';
ALTER TABLE members ADD COLUMN type VARCHAR(20) DEFAULT 'individual';
ALTER TABLE members ADD COLUMN phone VARCHAR(255);
ALTER TABLE members ADD COLUMN website VARCHAR(255);
ALTER TABLE members ADD COLUMN address TEXT;
ALTER TABLE members ADD COLUMN social_links JSONB;
ALTER TABLE members ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN display_order INTEGER DEFAULT 0;
```

### Site Settings Table
```sql
-- site_settings
CREATE TABLE site_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_category (category)
);
```

---

## ЗАКЛЮЧЕНИЕ

Этот план реализации предоставляет:

✅ **Полную систему RBAC** с 6 ролями и детальными правами доступа
✅ **Систему управления медиа** с автоматической оптимизацией изображений
✅ **Управление партнерами и членами** с поддержкой логотипов и фото
✅ **Административную панель** с современным UX/UI
✅ **Систему настроек сайта** с кешированием
✅ **18-недельный план реализации** с четкими этапами
✅ **Полную API документацию** для интеграции frontend и backend
✅ **Database schema** для всех новых таблиц

**Готовность к старту:** После утверждения плана можно немедленно начинать реализацию.

**Приоритет задач:**
1. **Неделя 1-2:** RBAC + Media (критично для безопасности)
2. **Неделя 3-6:** Partners, Members, Settings (основной функционал)
3. **Неделя 7-15:** Frontend Admin Panel (UX/UI)
4. **Неделя 16-18:** Testing, Polish, Deployment

---

_© 2025 КФА (Кыргызский Финансовый Альянс) - CMS Implementation Plan v1.0_
