import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  href: string;
  submenu?: { title: string; href: string; description?: string }[];
}

interface NavbarMenuProps {
  items: MenuItem[];
  className?: string;
}

export function NavbarMenu({ items, className }: NavbarMenuProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const closeTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (title: string) => {
    // Отменить таймер закрытия, если он есть
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveItem(title);
  };

  const handleMouseLeave = () => {
    // Добавить небольшую задержку перед закрытием
    closeTimer.current = setTimeout(() => {
      setActiveItem(null);
    }, 150); // 150ms задержка
  };

  return (
    <div className={cn('relative flex items-center gap-6', className)}>
      {items.map((item) => (
        <div
          key={item.title}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          {item.submenu ? (
            <>
              <button className="text-sm font-medium text-neutral-700 transition-colors hover:text-primary-700 dark:text-neutral-300 dark:hover:text-primary-400">
                {item.title}
              </button>
              {activeItem === item.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full z-50 mt-0 w-64 rounded-lg border border-neutral-200 bg-white pt-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="space-y-1 p-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="block rounded-md p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {subItem.title}
                        </div>
                        {subItem.description && (
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <Link
              to={item.href}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-primary-700 dark:text-neutral-300 dark:hover:text-primary-400"
            >
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
