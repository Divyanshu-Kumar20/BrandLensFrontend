/**
 * highlight.js
 * Utility to process findings spans and segment draft text safely.
 * Rules:
 *  1. Sort spans by start ascending (and end descending if starts match).
 *  2. Drop invalid spans (start < 0, end <= start, end > text.length, missing span).
 *  3. Drop any span that overlaps with a previously accepted span.
 *  4. Split the text into contiguous alternating normal and highlighted segments.
 */

/**
 * Validates whether a finding has a valid text span.
 */
export function isValidSpan(span, textLength) {
  if (!span) return false;
  const { start, end } = span;
  if (typeof start !== 'number' || typeof end !== 'number') return false;
  if (start < 0) return false;
  if (end <= start) return false;
  if (end > textLength) return false;
  return true;
}

/**
 * Filter out invalid findings and drop overlapping spans.
 * Returns sorted, non-overlapping findings.
 */
export function getNonOverlappingFindings(findings = [], textLength = 0) {
  if (!findings || findings.length === 0 || textLength <= 0) return [];

  // 1. Filter valid spans
  const validFindings = findings.filter((f) => isValidSpan(f?.span, textLength));

  // 2. Sort by start asc, end desc
  validFindings.sort((a, b) => {
    if (a.span.start !== b.span.start) {
      return a.span.start - b.span.start;
    }
    return b.span.end - a.span.end;
  });

  // 3. Drop overlapping spans
  const accepted = [];
  let lastEnd = 0;

  for (const finding of validFindings) {
    if (finding.span.start >= lastEnd) {
      accepted.push(finding);
      lastEnd = finding.span.end;
    }
    // Else: overlaps with previous span; safely skip it
  }

  return accepted;
}

/**
 * Splits text into contiguous segments for rendering.
 * Returns array of:
 *  - { text: string, isHighlight: false }
 *  - { text: string, isHighlight: true, finding: Finding, findingId: string, severity: string }
 */
export function splitTextIntoSegments(text = '', findings = []) {
  if (!text) return [];
  const textLength = text.length;
  const nonOverlapping = getNonOverlappingFindings(findings, textLength);

  if (nonOverlapping.length === 0) {
    return [{ text, isHighlight: false }];
  }

  const segments = [];
  let cursor = 0;

  for (const finding of nonOverlapping) {
    const { start, end } = finding.span;

    // Normal text preceding highlight
    if (start > cursor) {
      segments.push({
        text: text.slice(cursor, start),
        isHighlight: false,
      });
    }

    // Highlighted segment
    segments.push({
      text: text.slice(start, end),
      isHighlight: true,
      finding,
      findingId: finding.id,
      severity: finding.severity,
    });

    cursor = end;
  }

  // Trailing normal text
  if (cursor < textLength) {
    segments.push({
      text: text.slice(cursor),
      isHighlight: false,
    });
  }

  return segments;
}

/**
 * Converts a confidence float (0..1) to labelled level: High, Medium, Low
 */
export function getConfidenceLevel(confidence) {
  if (typeof confidence !== 'number') return 'Medium';
  if (confidence >= 0.85) return 'High';
  if (confidence >= 0.6) return 'Medium';
  return 'Low';
}
