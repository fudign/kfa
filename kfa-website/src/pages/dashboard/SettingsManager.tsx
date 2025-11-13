import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { supabaseSettingsAPI as settingsAPI } from '@/lib/supabase-settings';
import { usePermission } from '@/hooks/usePermission';
import type { SiteSetting } from '@/lib/supabase-settings';
import { Settings as SettingsIcon, Save, RefreshCw, X, RotateCcw } from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export function SettingsManagerPage() {
  const { can } = usePermission();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [settings, setSettings] = useState<Record<string, SiteSetting[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<number, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  // Предупреждение о несохраненных изменениях при уходе со страницы
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(editedValues).length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editedValues]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAll();
      setSettings(response);

      // Set first category as active
      const categories = Object.keys(response);
      if (categories.length > 0 && !activeCategory) {
        setActiveCategory(categories[0]);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare settings array for update
      const settingsToUpdate = Object.entries(editedValues).map(([id, value]) => {
        const setting = Object.values(settings)
          .flat()
          .find((s) => s.id === parseInt(id));

        return {
          key: setting!.key,
          value: value,
        };
      });

      if (settingsToUpdate.length === 0) {
        showError('Нет изменений для сохранения');
        return;
      }

      await settingsAPI.update(settingsToUpdate);
      setEditedValues({});
      await loadSettings();
      success(`Сохранено ${settingsToUpdate.length} настроек`);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      showError(err.message || 'Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelChanges = () => {
    if (Object.keys(editedValues).length === 0) return;

    if (confirm('Вы уверены, что хотите отменить все несохраненные изменения?')) {
      setEditedValues({});
      success('Изменения отменены');
    }
  };

  const handleValueChange = (settingId: number, value: any) => {
    setEditedValues({
      ...editedValues,
      [settingId]: value,
    });
  };

  const getValue = (setting: SiteSetting) => {
    if (editedValues[setting.id] !== undefined) {
      return editedValues[setting.id];
    }
    return setting.value;
  };

  const renderInput = (setting: SiteSetting) => {
    const value = getValue(setting);

    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value === 'true' || value === true}
              onChange={(e) => handleValueChange(setting.id, e.target.checked ? 'true' : 'false')}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {(value === 'true' || value === true) ? 'Включено' : 'Выключено'}
            </span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleValueChange(setting.id, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900"
          />
        );

      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleValueChange(setting.id, e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900"
          />
        );

      case 'email':
      case 'url':
        return (
          <input
            type={setting.type}
            value={value || ''}
            onChange={(e) => handleValueChange(setting.id, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleValueChange(setting.id, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900"
          />
        );
    }
  };

  const categories = Object.keys(settings);
  const hasChanges = Object.keys(editedValues).length > 0;

  // Permission check
  if (!can('settings.view')) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            У вас нет доступа к этому разделу
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold text-primary-900 dark:text-primary-100 md:mb-2 md:text-3xl">
              Настройки сайта
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              Конфигурация параметров системы
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadSettings}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            )}
            {hasChanges && (
              <button
                onClick={handleCancelChanges}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="h-4 w-4" />
                Отменить
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Categories Sidebar */}
            <div className="lg:w-64">
              <div className="space-y-1 rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      activeCategory === category
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100'
                        : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {activeCategory && settings[activeCategory] && (
                <div className="space-y-4">
                  {settings[activeCategory].map((setting) => (
                    <div
                      key={setting.id}
                      className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {setting.label || setting.key}
                            </h3>
                            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                              {setting.key}
                            </span>
                          </div>
                          {setting.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {setting.description}
                            </p>
                          )}
                        </div>
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-mono text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                          {setting.type}
                        </span>
                      </div>

                      <div className="mt-3">
                        {renderInput(setting)}
                      </div>

                      {editedValues[setting.id] !== undefined && (
                        <div className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Изменено (не сохранено)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 py-12 dark:border-neutral-700">
            <SettingsIcon className="mb-3 h-12 w-12 text-neutral-400" />
            <p className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Настройки не найдены
            </p>
            <p className="text-sm text-neutral-500">
              Создайте настройки через seeder или вручную в базе данных
            </p>
          </div>
        )}

        {/* Unsaved Changes Warning - Floating */}
        {hasChanges && (
          <div className="fixed bottom-4 right-4 z-40 min-w-[280px] max-w-[320px] rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-xl dark:border-yellow-900 dark:bg-yellow-900/20">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-1 font-semibold text-yellow-900 dark:text-yellow-100">
                  Несохраненные изменения
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  {Object.keys(editedValues).length} настро{Object.keys(editedValues).length === 1 ? 'йка' : Object.keys(editedValues).length < 5 ? 'йки' : 'ек'} изменено
                </p>
              </div>
              <button
                onClick={() => setEditedValues({})}
                className="ml-2 rounded-lg p-1 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-800/30"
                title="Скрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelChanges}
                disabled={saving}
                className="flex-1 rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm font-semibold text-yellow-900 transition-colors hover:bg-yellow-100 disabled:opacity-50 dark:border-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-100 dark:hover:bg-yellow-800/60"
              >
                Отменить
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </DashboardLayout>
  );
}
