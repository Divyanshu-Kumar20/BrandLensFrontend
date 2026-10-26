import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidSpan,
  getNonOverlappingFindings,
  splitTextIntoSegments,
  getConfidenceLevel,
} from './highlight.js';

test('isValidSpan validates correctly', () => {
  const textLen = 50;

  // Valid span
  assert.equal(isValidSpan({ start: 0, end: 10 }, textLen), true);
  assert.equal(isValidSpan({ start: 40, end: 50 }, textLen), true);

  // Out of range start
  assert.equal(isValidSpan({ start: -1, end: 10 }, textLen), false);

  // Inverted or zero length
  assert.equal(isValidSpan({ start: 10, end: 10 }, textLen), false);
  assert.equal(isValidSpan({ start: 15, end: 10 }, textLen), false);

  // Out of range end
  assert.equal(isValidSpan({ start: 10, end: 51 }, textLen), false);
  assert.equal(isValidSpan({ start: 45, end: 100 }, textLen), false);

  // Null or missing
  assert.equal(isValidSpan(null, textLen), false);
  assert.equal(isValidSpan({}, textLen), false);
});

test('getNonOverlappingFindings drops invalid and overlapping spans', () => {
  const text = "Get our CHEAPEST cold brew ever!!! Nimbus is the world's best coffee";
  const textLen = text.length;

  const mockFindings = [
    // Valid 1: CHEAPEST [8..16]
    { id: 'f1', span: { start: 8, end: 16, text: 'CHEAPEST' }, severity: 'blocking' },
    // Overlapping 1: cheap [8..13] (should be dropped because start 8 overlaps with [8..16])
    { id: 'f2', span: { start: 8, end: 13, text: 'CHEAP' }, severity: 'blocking' },
    // Overlapping 2: partial overlap [12..20] (starts before 16, should be dropped)
    { id: 'f3', span: { start: 12, end: 20, text: 'EST cold' }, severity: 'should_fix' },
    // Out of range: [100..120] (should be dropped)
    { id: 'f4', span: { start: 100, end: 120, text: 'invalid' }, severity: 'suggestion' },
    // Negative start: [-5..5] (should be dropped)
    { id: 'f5', span: { start: -5, end: 5, text: 'invalid' }, severity: 'suggestion' },
    // Valid 2: cold brew [17..26]
    { id: 'f6', span: { start: 17, end: 26, text: 'cold brew' }, severity: 'suggestion' },
    // Valid 3: world's best [49..61]
    { id: 'f7', span: { start: 49, end: 61, text: "world's best" }, severity: 'blocking' },
  ];

  const result = getNonOverlappingFindings(mockFindings, textLen);

  assert.equal(result.length, 3);
  assert.equal(result[0].id, 'f1');
  assert.equal(result[1].id, 'f6');
  assert.equal(result[2].id, 'f7');
});

test('splitTextIntoSegments preserves entire string and creates accurate segments', () => {
  const text = "Hello world! This is brand new.";
  const findings = [
    { id: 'f1', span: { start: 6, end: 11, text: 'world' }, severity: 'blocking' },
    { id: 'f2', span: { start: 21, end: 30, text: 'brand new' }, severity: 'suggestion' },
  ];

  const segments = splitTextIntoSegments(text, findings);

  assert.equal(segments.length, 5);

  // Segment 1: "Hello "
  assert.equal(segments[0].isHighlight, false);
  assert.equal(segments[0].text, "Hello ");

  // Segment 2: "world"
  assert.equal(segments[1].isHighlight, true);
  assert.equal(segments[1].text, "world");
  assert.equal(segments[1].findingId, "f1");
  assert.equal(segments[1].severity, "blocking");

  // Segment 3: "! This is "
  assert.equal(segments[2].isHighlight, false);
  assert.equal(segments[2].text, "! This is ");

  // Segment 4: "brand new"
  assert.equal(segments[3].isHighlight, true);
  assert.equal(segments[3].text, "brand new");
  assert.equal(segments[3].findingId, "f2");

  // Segment 5: "."
  assert.equal(segments[4].isHighlight, false);
  assert.equal(segments[4].text, ".");

  // Joined text must exactly equal original text
  const reconstructed = segments.map((s) => s.text).join('');
  assert.equal(reconstructed, text);
});

test('splitTextIntoSegments handles empty text and empty findings', () => {
  assert.deepEqual(splitTextIntoSegments('', []), []);

  const plainText = "Simple plain text";
  const segments = splitTextIntoSegments(plainText, []);
  assert.equal(segments.length, 1);
  assert.equal(segments[0].isHighlight, false);
  assert.equal(segments[0].text, plainText);
});

test('getConfidenceLevel returns correct levels', () => {
  assert.equal(getConfidenceLevel(1.0), 'High');
  assert.equal(getConfidenceLevel(0.91), 'High');
  assert.equal(getConfidenceLevel(0.85), 'High');
  assert.equal(getConfidenceLevel(0.84), 'Medium');
  assert.equal(getConfidenceLevel(0.60), 'Medium');
  assert.equal(getConfidenceLevel(0.59), 'Low');
  assert.equal(getConfidenceLevel(0.1), 'Low');
  assert.equal(getConfidenceLevel(undefined), 'Medium');
});
