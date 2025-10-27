import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, X } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [svg, setSvg] = useState<string>('');

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Initialize and render mermaid diagram
  useEffect(() => {
    if (!chart) return;

    const renderDiagram = async () => {
      try {
        // Configure mermaid with theme
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          themeVariables: isDark
            ? {
                primaryColor: '#3b82f6',
                primaryTextColor: '#fff',
                primaryBorderColor: '#1e40af',
                lineColor: '#60a5fa',
                secondaryColor: '#1e293b',
                tertiaryColor: '#334155',
                background: '#0f172a',
                mainBkg: '#1e293b',
                secondBkg: '#334155',
                textColor: '#e2e8f0',
                border1: '#475569',
                border2: '#64748b',
                nodeBorder: '#3b82f6',
                clusterBkg: '#1e293b',
                clusterBorder: '#475569',
                defaultLinkColor: '#60a5fa',
                titleColor: '#f1f5f9',
                edgeLabelBackground: '#1e293b',
                nodeTextColor: '#f1f5f9',
              }
            : {
                primaryColor: '#3b82f6',
                primaryTextColor: '#fff',
                primaryBorderColor: '#1e40af',
                lineColor: '#2563eb',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#e2e8f0',
                background: '#fff',
                mainBkg: '#f8fafc',
                secondBkg: '#f1f5f9',
                textColor: '#1e293b',
                border1: '#cbd5e1',
                border2: '#94a3b8',
                nodeBorder: '#3b82f6',
                clusterBkg: '#f8fafc',
                clusterBorder: '#cbd5e1',
                defaultLinkColor: '#2563eb',
                titleColor: '#0f172a',
                edgeLabelBackground: '#ffffff',
                nodeTextColor: '#1e293b',
              },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
          },
          sequence: {
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
          },
          gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
          },
        });

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        setSvg('<p class="text-red-600 dark:text-red-400">Failed to render diagram</p>');
      }
    };

    renderDiagram();
  }, [chart, isDark]);

  return (
    <>
      {/* Main diagram container */}
      <div className={`relative group my-8 ${className}`}>
        <div
          ref={containerRef}
          className="mermaid-container overflow-x-auto rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900"
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        {/* Zoom button */}
        {svg && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute right-4 top-4 rounded-lg bg-primary-600 p-2 text-white opacity-0 shadow-lg transition-opacity hover:bg-primary-700 group-hover:opacity-100"
            aria-label="Увеличить диаграмму"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Modal for zoomed view - Full screen */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close button - fixed in top right */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="fixed right-6 top-6 z-10 rounded-lg bg-red-600 p-3 text-white shadow-lg hover:bg-red-700"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Info badge - fixed in top left */}
          <div className="fixed left-6 top-6 z-10 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            Увеличение: 2x
          </div>

          {/* Scrollable container for zoomed diagram */}
          <div className="h-full w-full overflow-auto p-24" onClick={(e) => e.stopPropagation()}>
            {/* Wrapper with scale transformation */}
            <div className="inline-block origin-top-left" style={{ transform: 'scale(2)' }}>
              {/* Diagram container with proper background */}
              <div
                className="rounded-lg bg-white p-8 shadow-2xl dark:bg-neutral-900"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
