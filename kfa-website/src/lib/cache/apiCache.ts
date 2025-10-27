/**
 * API Cache System
 *
 * Продвинутая система кэширования для API запросов
 * Поддерживает offline работу и background sync
 */

interface CacheConfig {
  maxAge: number; // Время жизни в миллисекундах
  staleWhileRevalidate?: boolean; // Использовать устаревший кэш пока обновляется
  key: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class APICache {
  private readonly CACHE_PREFIX = 'kfa-api-cache';
  private readonly DB_NAME = 'KFA_DB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'api_cache';

  private db: IDBDatabase | null = null;

  /**
   * Инициализация IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * Получить данные из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(this.getCacheKey(key));

      request.onsuccess = () => {
        const entry: CacheEntry<T> | undefined = request.result;

        if (!entry) {
          resolve(null);
          return;
        }

        // Проверяем актуальность
        if (Date.now() > entry.expiresAt) {
          // Кэш устарел, удаляем
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Сохранить данные в кэш
   */
  async set<T>(key: string, data: T, maxAge: number): Promise<void> {
    if (!this.db) await this.init();

    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + maxAge,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({ key: this.getCacheKey(key), ...entry });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Удалить из кэша
   */
  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(this.getCacheKey(key));

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Очистить весь кэш
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Очистить устаревший кэш
   */
  async cleanExpired(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('expiresAt');
      const now = Date.now();

      const request = index.openCursor(IDBKeyRange.upperBound(now));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Получить размер кэша
   */
  async getSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private getCacheKey(key: string): string {
    return `${this.CACHE_PREFIX}:${key}`;
  }
}

// Singleton instance
export const apiCache = new APICache();

/**
 * Fetcher с кэшированием
 */
export async function cachedFetch<T>(
  url: string,
  config: CacheConfig,
  fetchOptions?: RequestInit
): Promise<T> {
  const { key, maxAge, staleWhileRevalidate = false } = config;

  // Проверяем кэш
  const cached = await apiCache.get<T>(key);

  if (cached && !staleWhileRevalidate) {
    return cached;
  }

  // Offline - возвращаем кэш если есть
  if (!navigator.onLine && cached) {
    return cached;
  }

  // Если staleWhileRevalidate - возвращаем кэш сразу и обновляем в фоне
  if (cached && staleWhileRevalidate) {
    // Обновляем в фоне
    fetch(url, fetchOptions)
      .then((res) => res.json())
      .then((data) => apiCache.set(key, data, maxAge))
      .catch(console.error);

    return cached;
  }

  // Запрашиваем данные
  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Сохраняем в кэш
    await apiCache.set(key, data, maxAge);

    return data;
  } catch (error) {
    // В случае ошибки возвращаем кэш если есть
    if (cached) {
      console.warn('API request failed, using cached data:', error);
      return cached;
    }

    throw error;
  }
}

/**
 * Периодическая очистка устаревшего кэша (вызывать при инициализации)
 */
export function startCacheCleanup(): void {
  // Очищаем при загрузке
  apiCache.cleanExpired();

  // И каждый час
  setInterval(() => {
    apiCache.cleanExpired();
  }, 60 * 60 * 1000);
}
