import { lazy, Suspense } from 'react';

// Lazy load MermaidDiagram component for better performance
const MermaidDiagram = lazy(() =>
  import('./MermaidDiagram').then((module) => ({
    default: module.MermaidDiagram,
  }))
);

interface LazyMermaidDiagramProps {
  chart: string;
}

/**
 * Lazy loaded Mermaid Diagram wrapper
 * Improves performance by only loading Mermaid when needed
 */
export function LazyMermaidDiagram({ chart }: LazyMermaidDiagramProps) {
  return (
    <Suspense
      fallback={
        <div className="my-8 flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Загрузка диаграммы...
            </p>
          </div>
        </div>
      }
    >
      <MermaidDiagram chart={chart} />
    </Suspense>
  );
}
