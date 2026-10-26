import React, { useMemo } from 'react';
import { splitTextIntoSegments } from '../utils/highlight';
import { SEVERITIES } from '../utils/constants';

export default function HighlightedText({
  text = '',
  findings = [],
  selectedFindingId = null,
  onSelectFinding = () => {},
}) {
  const segments = useMemo(() => {
    return splitTextIntoSegments(text, findings);
  }, [text, findings]);

  const handleHighlightClick = (findingId) => {
    onSelectFinding(findingId);
    // Smooth scroll card into view
    const cardEl = document.getElementById(`finding-card-${findingId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      cardEl.focus({ preventScroll: true });
    }
  };

  const getHighlightClasses = (severity, isSelected) => {
    let base = 'cursor-pointer rounded-xs px-0.5 transition-all duration-150 outline-none focus:ring-2 focus:ring-brand-teal ';
    if (isSelected) {
      return base + 'bg-brand-teal/20 border-b-2 border-brand-teal font-bold text-brand-navy ring-1 ring-brand-teal';
    }

    switch (severity) {
      case SEVERITIES.BLOCKING:
        return base + 'border-b-2 border-rose-500 bg-rose-100/70 text-rose-950 font-semibold hover:bg-rose-200/80';
      case SEVERITIES.SHOULD_FIX:
        return base + 'border-b-2 border-amber-500 bg-amber-100/70 text-amber-950 font-semibold hover:bg-amber-200/80';
      case SEVERITIES.SUGGESTION:
      default:
        return base + 'border-b-2 border-blue-500 bg-blue-100/70 text-blue-950 font-semibold hover:bg-blue-200/80';
    }
  };

  const getSeverityName = (severity) => {
    switch (severity) {
      case SEVERITIES.BLOCKING:
        return 'Blocking Violation';
      case SEVERITIES.SHOULD_FIX:
        return 'Should Fix';
      case SEVERITIES.SUGGESTION:
        return 'Suggestion';
      default:
        return 'Brand Finding';
    }
  };

  return (
    <div
      id="highlighted-text-container"
      className="p-5 rounded-2xl bg-white border border-slate-200 font-sans text-sm leading-relaxed text-slate-800 whitespace-pre-wrap break-words select-text shadow-sm"
      aria-label="Reviewed draft content with guideline violation highlights"
    >
      {segments.map((segment, index) => {
        if (!segment.isHighlight) {
          return <span key={index}>{segment.text}</span>;
        }

        const isSelected = selectedFindingId === segment.findingId;
        const severityName = getSeverityName(segment.severity);
        const tooltipText = `${severityName}: ${segment.finding?.message || ''}`;

        return (
          <mark
            key={index}
            id={`text-highlight-${segment.findingId}`}
            tabIndex={0}
            role="button"
            title={tooltipText}
            aria-label={`${severityName} on: ${segment.text}`}
            onClick={() => handleHighlightClick(segment.findingId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHighlightClick(segment.findingId);
              }
            }}
            className={getHighlightClasses(segment.severity, isSelected)}
          >
            {segment.text}
          </mark>
        );
      })}
    </div>
  );
}
