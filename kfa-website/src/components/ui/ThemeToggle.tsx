import { useState, useRef, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: 'light', icon: Sun, label: 'Светлая' },
    { value: 'dark', icon: Moon, label: 'Темная' },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (value: 'light' | 'dark') => {
    console.log(`🎨 Переключение темы на: ${value}`);
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        aria-label="Выбор темы"
        aria-expanded={isOpen}
      >
        <currentTheme.icon className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-neutral-200 bg-white shadow-lg transition-all duration-200 ease-in-out dark:border-neutral-700 dark:bg-neutral-800">
          <div className="py-1">
            {themes.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  theme === value
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
