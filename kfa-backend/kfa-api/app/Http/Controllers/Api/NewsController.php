<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NewsController extends Controller
{
    /**
     * Получить список новостей с фильтрацией и пагинацией
     */
    public function index(Request $request)
    {
        $query = News::with(['author:id,name,email', 'featuredImage']);

        // Фильтрация по статусу
        if ($request->has('status')) {
            $query->status($request->status);
        }

        // Фильтрация по категории
        if ($request->has('category')) {
            $query->category($request->category);
        }

        // Фильтрация по автору
        if ($request->has('author_id')) {
            $query->byAuthor($request->author_id);
        }

        // Фильтрация по избранным
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Поиск
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Фильтрация по датам
        if ($request->has('from_date')) {
            $query->whereDate('published_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('published_at', '<=', $request->to_date);
        }

        // Сортировка
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (in_array($sortBy, ['published_at', 'created_at', 'title', 'status'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->latest();
        }

        // Пагинация
        $perPage = min($request->get('per_page', 15), 100); // Максимум 100
        $news = $query->paginate($perPage);

        return NewsResource::collection($news);
    }

    /**
     * Создать новость
     */
    public function store(StoreNewsRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = auth()->id();

        // Создать новость
        $news = News::create($data);

        // Прикрепить изображения галереи, если указаны
        if (!empty($data['gallery_ids'])) {
            foreach ($data['gallery_ids'] as $index => $mediaId) {
                $news->addToGallery($mediaId, $index);
            }
        }

        // Загрузить связи для ответа
        $news->load(['author', 'featuredImage', 'gallery']);

        return new NewsResource($news);
    }

    /**
     * Показать одну новость
     */
    public function show(News $news)
    {
        $news->load(['author', 'featuredImage', 'gallery']);
        return new NewsResource($news);
    }

    /**
     * Обновить новость
     */
    public function update(UpdateNewsRequest $request, News $news)
    {
        // Авторизация обрабатывается в UpdateNewsRequest::authorize()
        $data = $request->validated();

        // Обновить основные данные
        $news->update($data);

        // Обновить галерею, если указана
        if (isset($data['gallery_ids'])) {
            // Открепить все текущие изображения галереи
            $news->media()->wherePivot('type', 'gallery')->detach();

            // Прикрепить новые
            foreach ($data['gallery_ids'] as $index => $mediaId) {
                $news->addToGallery($mediaId, $index);
            }
        }

        // Перезагрузить связи
        $news->load(['author', 'featuredImage', 'gallery']);

        return new NewsResource($news);
    }

    /**
     * Удалить новость
     */
    public function destroy(News $news): JsonResponse
    {
        $user = auth()->user();

        // Проверка прав: автор или администратор
        if ($news->author_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'У вас нет прав для удаления этой новости.'
            ], 403);
        }

        // Открепить все медиафайлы перед удалением
        $news->media()->detach();

        $news->delete();

        return response()->json([
            'message' => 'Новость успешно удалена'
        ]);
    }

    // =============== МЕТОДЫ УПРАВЛЕНИЯ МЕДИА ===============

    /**
     * Прикрепить медиафайл к новости
     */
    public function attachMedia(Request $request, News $news): JsonResponse
    {
        $request->validate([
            'media_id' => 'required|exists:media,id',
            'type' => 'required|in:featured,gallery',
            'order' => 'nullable|integer|min:0',
        ]);

        $type = $request->input('type');
        $mediaId = $request->input('media_id');
        $order = $request->input('order', 0);

        if ($type === 'featured') {
            // Установить как главное изображение
            $news->setFeaturedImage($mediaId);
        } else {
            // Добавить в галерею
            $news->addToGallery($mediaId, $order);
        }

        $news->load(['featuredImage', 'gallery']);

        return response()->json([
            'message' => 'Медиафайл успешно прикреплен',
            'data' => new NewsResource($news),
        ]);
    }

    /**
     * Открепить медиафайл от новости
     */
    public function detachMedia(News $news, int $mediaId): JsonResponse
    {
        $news->removeFromGallery($mediaId);

        // Если это было главное изображение, убрать его
        if ($news->featured_image_id == $mediaId) {
            $news->update(['featured_image_id' => null]);
        }

        $news->load(['featuredImage', 'gallery']);

        return response()->json([
            'message' => 'Медиафайл успешно откреплен',
            'data' => new NewsResource($news),
        ]);
    }

    /**
     * Изменить порядок изображений в галерее
     */
    public function reorderMedia(Request $request, News $news): JsonResponse
    {
        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'exists:media,id',
        ]);

        $news->reorderGallery($request->input('media_ids'));

        $news->load(['gallery']);

        return response()->json([
            'message' => 'Порядок изображений обновлен',
            'data' => new NewsResource($news),
        ]);
    }

    // =============== МЕТОДЫ МОДЕРАЦИИ (только для админов) ===============

    /**
     * Одобрить новость
     */
    public function approve(News $news): NewsResource
    {
        $news->approve();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Отклонить новость
     */
    public function reject(News $news): NewsResource
    {
        $news->reject();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Переключить статус "избранное"
     */
    public function toggleFeatured(News $news): NewsResource
    {
        $news->toggleFeatured();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Опубликовать новость
     */
    public function publish(News $news): NewsResource
    {
        $news->publish();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Снять с публикации
     */
    public function unpublish(News $news): NewsResource
    {
        $news->unpublish();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Архивировать
     */
    public function archive(News $news): NewsResource
    {
        $news->archive();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    /**
     * Отправить на модерацию
     */
    public function submit(News $news): NewsResource
    {
        // Проверка, что пользователь - автор
        if ($news->author_id !== auth()->id()) {
            abort(403, 'Вы не можете отправить на модерацию чужую новость');
        }

        $news->submit();
        $news->load(['author', 'featuredImage']);
        return new NewsResource($news);
    }

    // =============== СТАТИСТИКА ===============

    /**
     * Получить статистику по новостям
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => News::count(),
            'published' => News::published()->count(),
            'draft' => News::draft()->count(),
            'pending' => News::pending()->count(),
            'featured' => News::featured()->count(),
            'archived' => News::status('archived')->count(),
        ];

        return response()->json($stats);
    }
}
