import { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Введите текст...',
  error,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'markdown'>('visual');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = `${beforeText}${before}${selectedText}${after}${afterText}`;
    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Введите URL:');
    if (url) {
      const text = prompt('Введите текст ссылки:') || url;
      insertMarkdown(`[${text}](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      const alt = prompt('Введите описание изображения:') || 'Изображение';
      insertMarkdown(`![${alt}](${url})`);
    }
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      title: 'Заголовок 1',
      onClick: () => insertMarkdown('\n# ', '\n'),
    },
    {
      icon: Heading2,
      title: 'Заголовок 2',
      onClick: () => insertMarkdown('\n## ', '\n'),
    },
    {
      icon: Heading3,
      title: 'Заголовок 3',
      onClick: () => insertMarkdown('\n### ', '\n'),
    },
    {
      icon: Bold,
      title: 'Жирный',
      onClick: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      title: 'Курсив',
      onClick: () => insertMarkdown('_', '_'),
    },
    {
      icon: List,
      title: 'Маркированный список',
      onClick: () => insertMarkdown('\n- '),
    },
    {
      icon: ListOrdered,
      title: 'Нумерованный список',
      onClick: () => insertMarkdown('\n1. '),
    },
    {
      icon: LinkIcon,
      title: 'Ссылка',
      onClick: insertLink,
    },
    {
      icon: ImageIcon,
      title: 'Изображение',
      onClick: insertImage,
    },
    {
      icon: Quote,
      title: 'Цитата',
      onClick: () => insertMarkdown('\n> '),
    },
    {
      icon: Code,
      title: 'Код',
      onClick: () => insertMarkdown('`', '`'),
    },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 flex items-center gap-1">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.onClick}
                title={button.title}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              mode === 'visual'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Визуально
          </button>
          <button
            type="button"
            onClick={() => setMode('markdown')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              mode === 'markdown'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none resize-none ${
          error ? 'border-red-500' : ''
        } ${mode === 'markdown' ? 'font-mono text-sm' : ''}`}
        rows={15}
      />

      {/* Helper Text */}
      <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
        <span className="font-medium">Подсказка:</span> Используйте панель
        инструментов для форматирования текста или пишите напрямую в формате
        Markdown
      </div>

      {error && <p className="px-4 pb-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
