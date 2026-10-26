import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ExternalLink, X, Shield, CheckCircle, Tag } from 'lucide-react';

export default function SourceChip({ sourceRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  if (!sourceRef) return null;

  const { kind, id, label, code, text } = sourceRef;
  const chipLabel = label || code || (kind ? `${kind.toUpperCase()} ref` : 'Knowledge Ref');

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-brand-light text-slate-700 hover:text-brand-navy border border-slate-200 hover:border-brand-teal/40 transition group focus:outline-none focus:ring-2 focus:ring-brand-teal"
        title={`View knowledge source: ${chipLabel}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <BookOpen className="w-3 h-3 text-brand-teal group-hover:scale-105 transition-transform" />
        <span className="font-semibold">{chipLabel}</span>
        {code && (
          <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
            {code}
          </span>
        )}
      </button>

      {/* Popover / Modal with Knowledge Source Ground Truth */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="source-chip-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center text-brand-teal">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="source-chip-title" className="text-xs font-bold text-slate-900">
                    Knowledge Ground Truth
                  </h3>
                  <div className="text-[10px] uppercase font-mono text-slate-500">
                    Source: {kind} {code ? `(${code})` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Rule / Fact Citation
                </span>
                <div className="text-sm font-bold text-brand-navy mt-0.5">
                  {label || 'Brand Standard'}
                </div>
              </div>

              {text ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                  {text}
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                  Referenced from approved brand governance knowledge base.
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">Brand: Nimbus Coffee Co.</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-light transition"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
