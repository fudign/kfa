import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Светлая' },
    { value: 'dark', icon: Moon, label: 'Темная' },
  ] as const;

  return (
    <div className="relative inline-flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => {
            console.log(`🎨 Переключение темы на: ${value}`);
            setTheme(value);
          }}
          className={`relative rounded-md px-3 py-2 text-sm font-medium transition-all ${
            theme === value
              ? 'bg-white text-primary-700 shadow-sm dark:bg-neutral-700 dark:text-primary-300'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
