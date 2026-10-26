import { ROLES, CONTENT_STATUS, SEVERITIES, FINDING_TYPES, FINDING_STATUS, FINDING_ORIGINS } from '../utils/constants.js';

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial seed data for Nimbus Coffee Co.
const SEED_USERS = [
  { id: 'u1', name: 'Asha (Creator)', email: 'creator@nimbus.demo', role: ROLES.CREATOR, orgId: 'o1' },
  { id: 'u2', name: 'Rohan (Reviewer)', email: 'reviewer@nimbus.demo', role: ROLES.REVIEWER, orgId: 'o1' },
  { id: 'u3', name: 'Maya (Manager)', email: 'manager@nimbus.demo', role: ROLES.MANAGER, orgId: 'o1' },
  { id: 'u4', name: 'Dev (Admin)', email: 'admin@nimbus.demo', role: ROLES.ADMIN, orgId: 'o1' },
];

const SEED_ORG = {
  id: 'o1',
  name: 'Nimbus Coffee Co.',
  aiEnabled: true,
};

const SEED_CLAUSES = [
  { id: 'cl1', code: 'TONE-2.1', title: 'Warm, calm voice', text: 'Voice is warm, calm and plain; no hype or heavy exclamation marks.', category: 'tone' },
  { id: 'cl2', code: 'TONE-2.3', title: 'Customer terminology', text: "Write 'customers', never 'users'.", category: 'terminology' },
  { id: 'cl3', code: 'MSG-1.2', title: 'Free delivery threshold', text: 'Delivery messaging must state the free-delivery threshold.', category: 'messaging' },
  { id: 'cl4', code: 'CLM-3.1', title: 'Claims & Superlatives', text: 'Superlatives and absolute claims (best, no.1, guaranteed) need approved evidence and reviewer sign-off.', category: 'claims' },
  { id: 'cl5', code: 'CLM-3.2', title: 'No health or medical claims', text: 'No health or medical claims.', category: 'claims' },
  { id: 'cl6', code: 'A11Y-4.1', title: 'Descriptive link text', text: "Link text must describe the destination; avoid 'click here'.", category: 'accessibility' },
  { id: 'cl7', code: 'A11Y-4.2', title: 'Formatting & Emoji', text: 'Avoid all-caps words and decorative emoji.', category: 'accessibility' },
  { id: 'cl8', code: 'VIS-5.1', title: 'Brand colours only', text: 'Use brand colours only (Round 3).', category: 'visual' },
];

const SEED_FACTS = [
  { id: 'f1', key: 'delivery_threshold', label: 'Delivery Threshold', keywords: ['delivery', 'free delivery', 'order'], approvedValue: 'free delivery above Rs 499', statement: 'Free delivery applies only to orders above Rs 499.' },
  { id: 'f2', key: 'return_window', label: 'Return Window', keywords: ['return', 'returns', 'window'], approvedValue: '7 days', statement: 'Returns are accepted within 7 days of purchase.' },
  { id: 'f3', key: 'machine_warranty', label: 'Machine Warranty', keywords: ['warranty', 'machine'], approvedValue: '2 years', statement: 'Espresso machines have a 2-year warranty.' },
  { id: 'f4', key: 'cold_brew_price', label: 'Cold Brew Price', keywords: ['cold brew', 'price', 'pack'], approvedValue: 'Rs 549 for a 6-pack', statement: 'Cold brew cans retail at Rs 549 for a 6-pack.' },
];

const SEED_TERMS = [
  { id: 't1', term: 'cheap', kind: 'banned', replacement: 'most affordable', clauseCode: 'TONE-2.1', note: "'cheap' diminishes premium brand value" },
  { id: 't2', term: 'guaranteed', kind: 'banned', replacement: 'crafted to help', clauseCode: 'CLM-3.1', note: 'Requires legal substantiate sign-off' },
  { id: 't3', term: 'miracle', kind: 'banned', replacement: 'exceptional', clauseCode: 'CLM-3.2', note: 'Medical claim violation' },
  { id: 't4', term: 'world\'s best', kind: 'banned', replacement: 'masterfully crafted', clauseCode: 'CLM-3.1', note: 'Unsubstantiated absolute claim' },
  { id: 't5', term: 'cure', kind: 'banned', replacement: 'revitalize', clauseCode: 'CLM-3.2', note: 'Prohibited medical claim' },
  { id: 't6', term: 'users', kind: 'banned', replacement: 'customers', clauseCode: 'TONE-2.3', note: 'Refer to people as customers' },
  { id: 't7', term: 'customers', kind: 'preferred', replacement: '', clauseCode: 'TONE-2.3', note: 'Preferred audience terminology' },
  { id: 't8', term: 'cold brew', kind: 'preferred', replacement: '', clauseCode: 'TONE-2.1', note: 'Preferred over iced concentrate' },
];

// In-memory state store
let state = {
  users: [...SEED_USERS],
  org: { ...SEED_ORG },
  clauses: [...SEED_CLAUSES],
  facts: [...SEED_FACTS],
  terms: [...SEED_TERMS],
  contentList: [],
  contentDetails: {}, // id -> { content, versions: [Version] }
  findingsByVersion: {}, // versionId -> [Finding]
  commentsByContent: {}, // contentId -> [Comment]
  auditByContent: {}, // contentId -> [Audit]
};

// Helper: Seed initial sample content if empty
const initDemoDraftIfNeeded = () => {
  if (state.contentList.length > 0) return;

  const demoText = `Get our CHEAPEST cold brew ever!!! Nimbus is the world's best coffee and guaranteed to boost your energy. Free delivery on all orders, and returns within 30 days.\nClick here to order: nimbus.example`;

  const contentId = 'c1';
  const versionId = 'v1';

  const demoContent = {
    id: contentId,
    title: 'Summer Launch Announcement',
    channel: 'social',
    status: CONTENT_STATUS.DRAFT,
    currentVersion: 1,
    createdByName: 'Asha (Creator)',
    updatedAt: new Date().toISOString(),
  };

  const demoVersion = {
    id: versionId,
    number: 1,
    text: demoText,
    aiUsed: true,
    aiModel: 'gemini-1.5-pro',
    checkedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Generate findings using indexOf to guarantee exact span matches
  const findings = [];

  const addFinding = ({ id, phrase, message, suggestion, type, severity, origin, confidence, sourceRef }) => {
    const start = demoText.indexOf(phrase);
    if (start !== -1) {
      findings.push({
        id,
        versionId,
        origin,
        ruleId: origin === FINDING_ORIGINS.RULE ? `R-${sourceRef.id}` : null,
        type,
        severity,
        span: {
          start,
          end: start + phrase.length,
          text: phrase,
        },
        message,
        suggestion,
        confidence,
        sourceRef,
        status: FINDING_STATUS.OPEN,
        disputeReason: null,
        resolvedByName: null,
        resolvedAt: null,
      });
    }
  };

  // 1. CHEAPEST -> Banned term (rule, blocking)
  addFinding({
    id: 'f1',
    phrase: 'CHEAPEST',
    message: "'cheap' is a banned term in our brand language.",
    suggestion: 'most affordable',
    type: FINDING_TYPES.TERMINOLOGY,
    severity: SEVERITIES.BLOCKING,
    origin: FINDING_ORIGINS.RULE,
    confidence: 1.0,
    sourceRef: { kind: 'term', id: 't1', label: 'Banned term: cheap', code: 'TONE-2.1', text: "Voice is warm, calm and plain; no hype." },
  });

  // 2. world's best -> Superlative claim (ai, blocking)
  addFinding({
    id: 'f2',
    phrase: "world's best",
    message: 'Superlative claim without approved evidence; needs reviewer sign-off.',
    suggestion: 'award-winning',
    type: FINDING_TYPES.CLAIM,
    severity: SEVERITIES.BLOCKING,
    origin: FINDING_ORIGINS.AI,
    confidence: 0.92,
    sourceRef: { kind: 'clause', id: 'cl4', label: 'Claims policy', code: 'CLM-3.1', text: 'Superlatives and absolute claims need approved evidence.' },
  });

  // 3. guaranteed -> Absolute claim (rule, should_fix)
  addFinding({
    id: 'f3',
    phrase: 'guaranteed',
    message: "Absolute claim 'guaranteed' requires substantiation or softer phrasing.",
    suggestion: 'crafted to help',
    type: FINDING_TYPES.CLAIM,
    severity: SEVERITIES.SHOULD_FIX,
    origin: FINDING_ORIGINS.RULE,
    confidence: 1.0,
    sourceRef: { kind: 'clause', id: 'cl4', label: 'Claims policy', code: 'CLM-3.1', text: 'Superlatives and absolute claims need approved evidence.' },
  });

  // 4. Free delivery on all orders -> Fact contradiction (ai, blocking)
  addFinding({
    id: 'f4',
    phrase: 'Free delivery on all orders',
    message: 'Contradicts verified fact: Free delivery applies only to orders above Rs 499.',
    suggestion: 'Free delivery above Rs 499',
    type: FINDING_TYPES.FACT,
    severity: SEVERITIES.BLOCKING,
    origin: FINDING_ORIGINS.AI,
    confidence: 0.95,
    sourceRef: { kind: 'fact', id: 'f1', label: 'Free Delivery Threshold', code: 'MSG-1.2', text: 'free delivery above Rs 499' },
  });

  // 5. 30 days -> Fact contradiction (rule, blocking)
  addFinding({
    id: 'f5',
    phrase: '30 days',
    message: 'Incorrect return policy. Approved return window is 7 days.',
    suggestion: '7 days',
    type: FINDING_TYPES.FACT,
    severity: SEVERITIES.BLOCKING,
    origin: FINDING_ORIGINS.RULE,
    confidence: 1.0,
    sourceRef: { kind: 'fact', id: 'f2', label: 'Return Window Policy', code: 'CLM-3.1', text: '7 days' },
  });

  // 6. Click here -> Accessibility guideline (rule, suggestion)
  addFinding({
    id: 'f6',
    phrase: 'Click here',
    message: "Vague link text violates accessibility guidelines. Use descriptive action words.",
    suggestion: 'Browse our menu',
    type: FINDING_TYPES.ACCESSIBILITY,
    severity: SEVERITIES.SUGGESTION,
    origin: FINDING_ORIGINS.RULE,
    confidence: 1.0,
    sourceRef: { kind: 'clause', id: 'cl6', label: 'Accessible Link Text', code: 'A11Y-4.1', text: "Link text must describe destination; avoid 'click here'." },
  });

  // 7. !!! -> Tone exclamation marks (ai, should_fix)
  addFinding({
    id: 'f7',
    phrase: '!!!',
    message: 'Excessive punctuation creates unnecessary hype, violating brand tone.',
    suggestion: '.',
    type: FINDING_TYPES.TONE,
    severity: SEVERITIES.SHOULD_FIX,
    origin: FINDING_ORIGINS.AI,
    confidence: 0.88,
    sourceRef: { kind: 'clause', id: 'cl1', label: 'Tone of voice', code: 'TONE-2.1', text: 'Voice is warm, calm and plain; no heavy exclamation marks.' },
  });

  state.contentList.push(demoContent);
  state.contentDetails[contentId] = {
    content: demoContent,
    versions: [demoVersion],
  };
  state.findingsByVersion[versionId] = findings;
  state.commentsByContent[contentId] = [
    {
      id: 'comm1',
      authorName: 'Rohan (Reviewer)',
      authorRole: ROLES.REVIEWER,
      text: 'Please check the claim and free shipping threshold before we can move to manager approval.',
      findingId: null,
      versionId: 'v1',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
  state.auditByContent[contentId] = [
    {
      id: 'aud1',
      action: 'DRAFT_CREATED',
      userName: 'Asha (Creator)',
      meta: { version: 1 },
      at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'aud2',
      action: 'REVIEW_REQUESTED',
      userName: 'Asha (Creator)',
      meta: { versionId: 'v1', useAi: true },
      at: new Date(Date.now() - 7100000).toISOString(),
    },
  ];
};

initDemoDraftIfNeeded();

export const mockApi = {
  // GET /health
  async getHealth() {
    await delay(100);
    return {
      status: 'ok',
      db: 'connected (mock)',
    };
  },

  // POST /auth/demo
  async loginDemo(role) {
    await delay();
    const user = state.users.find((u) => u.role === role) || {
      id: `u-${role}`,
      name: `Demo ${role}`,
      email: `${role}@nimbus.demo`,
      role,
      orgId: state.org.id,
    };
    const token = `mock-token-${role}-${Date.now()}`;
    return {
      token,
      user,
      org: state.org,
    };
  },

  // POST /auth/login
  async login(email, password) {
    await delay();
    const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const err = new Error('Invalid email or password');
      err.code = 'UNAUTHENTICATED';
      err.status = 401;
      throw err;
    }
    const token = `mock-token-${user.role}-${Date.now()}`;
    return {
      token,
      user,
      org: state.org,
    };
  },

  // GET /auth/me
  async getMe(token) {
    await delay(80);
    const roleMatch = token?.match(/mock-token-([a-z]+)/);
    const role = roleMatch ? roleMatch[1] : ROLES.CREATOR;
    const user = state.users.find((u) => u.role === role) || state.users[0];
    return {
      user,
      org: state.org,
    };
  },

  // GET /knowledge/clauses | facts | terms
  async getClauses() {
    await delay();
    return [...state.clauses];
  },

  async createClause(payload) {
    await delay();
    const newClause = { id: `cl_${Date.now()}`, ...payload };
    state.clauses.unshift(newClause);
    return newClause;
  },

  async updateClause(id, payload) {
    await delay();
    const index = state.clauses.findIndex((c) => c.id === id);
    if (index === -1) throw { code: 'NOT_FOUND', message: 'Clause not found' };
    state.clauses[index] = { ...state.clauses[index], ...payload };
    return state.clauses[index];
  },

  async deleteClause(id) {
    await delay();
    state.clauses = state.clauses.filter((c) => c.id !== id);
    return { deleted: true };
  },

  async getFacts() {
    await delay();
    return [...state.facts];
  },

  async createFact(payload) {
    await delay();
    const newFact = { id: `fact_${Date.now()}`, ...payload };
    state.facts.unshift(newFact);
    return newFact;
  },

  async updateFact(id, payload) {
    await delay();
    const index = state.facts.findIndex((f) => f.id === id);
    if (index === -1) throw { code: 'NOT_FOUND', message: 'Fact not found' };
    state.facts[index] = { ...state.facts[index], ...payload };
    return state.facts[index];
  },

  async deleteFact(id) {
    await delay();
    state.facts = state.facts.filter((f) => f.id !== id);
    return { deleted: true };
  },

  async getTerms() {
    await delay();
    return [...state.terms];
  },

  async createTerm(payload) {
    await delay();
    const newTerm = { id: `term_${Date.now()}`, ...payload };
    state.terms.unshift(newTerm);
    return newTerm;
  },

  async updateTerm(id, payload) {
    await delay();
    const index = state.terms.findIndex((t) => t.id === id);
    if (index === -1) throw { code: 'NOT_FOUND', message: 'Term not found' };
    state.terms[index] = { ...state.terms[index], ...payload };
    return state.terms[index];
  },

  async deleteTerm(id) {
    await delay();
    state.terms = state.terms.filter((t) => t.id !== id);
    return { deleted: true };
  },

  // PATCH /org/settings
  async updateOrgSettings({ aiEnabled }) {
    await delay();
    state.org.aiEnabled = aiEnabled;
    return { ...state.org };
  },

  // Content Endpoints
  async getContentList(status) {
    await delay();
    if (!status) return [...state.contentList];
    return state.contentList.filter((c) => c.status === status);
  },

  async getContentById(id) {
    await delay();
    const item = state.contentDetails[id];
    if (!item) throw { code: 'NOT_FOUND', message: 'Content not found' };
    return { ...item };
  },

  async createContent({ title, channel, text, userName = 'Asha (Creator)' }) {
    await delay();
    const contentId = `c_${Date.now()}`;
    const versionId = `v_${Date.now()}`;

    const content = {
      id: contentId,
      title,
      channel,
      status: CONTENT_STATUS.DRAFT,
      currentVersion: 1,
      createdByName: userName,
      updatedAt: new Date().toISOString(),
    };

    const version = {
      id: versionId,
      number: 1,
      text,
      aiUsed: false,
      aiModel: null,
      checkedAt: null,
      createdAt: new Date().toISOString(),
    };

    state.contentList.unshift(content);
    state.contentDetails[contentId] = {
      content,
      versions: [version],
    };
    state.findingsByVersion[versionId] = [];
    state.commentsByContent[contentId] = [];
    state.auditByContent[contentId] = [
      {
        id: `aud_${Date.now()}`,
        action: 'DRAFT_CREATED',
        userName,
        meta: { title, channel },
        at: new Date().toISOString(),
      },
    ];

    return { content, version };
  },

  async reviewContent(contentId, { versionId, useAi }) {
    await delay(350);
    const detail = state.contentDetails[contentId];
    if (!detail) throw { code: 'NOT_FOUND', message: 'Content not found' };

    const version = detail.versions.find((v) => v.id === versionId);
    if (!version) throw { code: 'NOT_FOUND', message: 'Version not found' };

    const text = version.text;
    const findings = [];

    // Check banned terms
    state.terms.filter((t) => t.kind === 'banned').forEach((t) => {
      let idx = text.toLowerCase().indexOf(t.term.toLowerCase());
      while (idx !== -1) {
        findings.push({
          id: `f_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          versionId,
          origin: FINDING_ORIGINS.RULE,
          ruleId: `R-${t.id}`,
          type: FINDING_TYPES.TERMINOLOGY,
          severity: SEVERITIES.BLOCKING,
          span: {
            start: idx,
            end: idx + t.term.length,
            text: text.slice(idx, idx + t.term.length),
          },
          message: `'${t.term}' is a banned term in brand language.`,
          suggestion: t.replacement || 'appropriate alternative',
          confidence: 1.0,
          sourceRef: { kind: 'term', id: t.id, label: `Banned term: ${t.term}`, code: t.clauseCode },
          status: FINDING_STATUS.OPEN,
          disputeReason: null,
          resolvedByName: null,
          resolvedAt: null,
        });
        idx = text.toLowerCase().indexOf(t.term.toLowerCase(), idx + t.term.length);
      }
    });

    // Check superlative words (AI check simulation if useAi and org.aiEnabled)
    const effectiveAi = useAi && state.org.aiEnabled;
    if (effectiveAi) {
      if (text.includes("world's best")) {
        const start = text.indexOf("world's best");
        findings.push({
          id: `f_ai_${Date.now()}_1`,
          versionId,
          origin: FINDING_ORIGINS.AI,
          ruleId: null,
          type: FINDING_TYPES.CLAIM,
          severity: SEVERITIES.BLOCKING,
          span: { start, end: start + "world's best".length, text: "world's best" },
          message: 'Superlative claim without approved evidence; requires reviewer sign-off.',
          suggestion: 'award-winning',
          confidence: 0.91,
          sourceRef: { kind: 'clause', id: 'cl4', label: 'Claims policy', code: 'CLM-3.1' },
          status: FINDING_STATUS.OPEN,
          disputeReason: null,
        });
      }
    }

    // Free delivery check
    if (text.includes('Free delivery on all orders')) {
      const start = text.indexOf('Free delivery on all orders');
      findings.push({
        id: `f_ai_${Date.now()}_2`,
        versionId,
        origin: effectiveAi ? FINDING_ORIGINS.AI : FINDING_ORIGINS.RULE,
        ruleId: effectiveAi ? null : 'R-FACT-1',
        type: FINDING_TYPES.FACT,
        severity: SEVERITIES.BLOCKING,
        span: { start, end: start + 'Free delivery on all orders'.length, text: 'Free delivery on all orders' },
        message: 'Conflicts with fact: free delivery requires Rs 499 minimum.',
        suggestion: 'Free delivery above Rs 499',
        confidence: 0.94,
        sourceRef: { kind: 'fact', id: 'f1', label: 'Delivery threshold', code: 'MSG-1.2' },
        status: FINDING_STATUS.OPEN,
        disputeReason: null,
      });
    }

    // 30 days check
    if (text.includes('30 days')) {
      const start = text.indexOf('30 days');
      findings.push({
        id: `f_rule_${Date.now()}_3`,
        versionId,
        origin: FINDING_ORIGINS.RULE,
        ruleId: 'R-FACT-2',
        type: FINDING_TYPES.FACT,
        severity: SEVERITIES.BLOCKING,
        span: { start, end: start + '30 days'.length, text: '30 days' },
        message: 'Conflicts with fact: return window is 7 days.',
        suggestion: '7 days',
        confidence: 1.0,
        sourceRef: { kind: 'fact', id: 'f2', label: 'Return window', code: 'CLM-3.1' },
        status: FINDING_STATUS.OPEN,
        disputeReason: null,
      });
    }

    // Click here check
    if (text.includes('Click here')) {
      const start = text.indexOf('Click here');
      findings.push({
        id: `f_rule_${Date.now()}_4`,
        versionId,
        origin: FINDING_ORIGINS.RULE,
        ruleId: 'R-A11Y-1',
        type: FINDING_TYPES.ACCESSIBILITY,
        severity: SEVERITIES.SUGGESTION,
        span: { start, end: start + 'Click here'.length, text: 'Click here' },
        message: "Vague link text. Avoid 'click here'.",
        suggestion: 'Order cold brew',
        confidence: 1.0,
        sourceRef: { kind: 'clause', id: 'cl6', label: 'Accessible link text', code: 'A11Y-4.1' },
        status: FINDING_STATUS.OPEN,
        disputeReason: null,
      });
    }

    // Exclamations check
    if (text.includes('!!!')) {
      const start = text.indexOf('!!!');
      findings.push({
        id: `f_tone_${Date.now()}_5`,
        versionId,
        origin: FINDING_ORIGINS.RULE,
        ruleId: 'R-TONE-1',
        type: FINDING_TYPES.TONE,
        severity: SEVERITIES.SHOULD_FIX,
        span: { start, end: start + '!!!'.length, text: '!!!' },
        message: 'Excessive punctuation violates calm brand voice.',
        suggestion: '.',
        confidence: 0.89,
        sourceRef: { kind: 'clause', id: 'cl1', label: 'Tone of voice', code: 'TONE-2.1' },
        status: FINDING_STATUS.OPEN,
        disputeReason: null,
      });
    }

    version.aiUsed = effectiveAi;
    version.aiModel = effectiveAi ? 'gemini-1.5-pro' : null;
    version.checkedAt = new Date().toISOString();

    state.findingsByVersion[versionId] = findings;

    return {
      findings,
      aiUsed: effectiveAi,
      aiFailed: false,
      droppedCount: 0,
    };
  },

  async getVersionFindings(contentId, versionNumber) {
    await delay();
    const detail = state.contentDetails[contentId];
    if (!detail) return [];
    const version = detail.versions.find((v) => v.number === Number(versionNumber));
    if (!version) return [];
    return state.findingsByVersion[version.id] || [];
  },

  async patchFinding(findingId, { status, disputeReason, editedText, resolvedByName = 'Asha' }) {
    await delay();
    for (const vId in state.findingsByVersion) {
      const finding = state.findingsByVersion[vId].find((f) => f.id === findingId);
      if (finding) {
        if (status) finding.status = status;
        if (disputeReason !== undefined) finding.disputeReason = disputeReason;
        if (editedText !== undefined) finding.suggestion = editedText;
        finding.resolvedByName = resolvedByName;
        finding.resolvedAt = new Date().toISOString();
        return { ...finding };
      }
    }
    throw { code: 'NOT_FOUND', message: 'Finding not found' };
  },

  async createVersion(contentId, { text, basedOnVersionId, fixes = [] }) {
    await delay();
    const detail = state.contentDetails[contentId];
    if (!detail) throw { code: 'NOT_FOUND', message: 'Content not found' };

    let newText = text;
    if (!newText && basedOnVersionId) {
      const baseVersion = detail.versions.find((v) => v.id === basedOnVersionId);
      if (!baseVersion) throw { code: 'NOT_FOUND', message: 'Base version not found' };
      const baseFindings = state.findingsByVersion[basedOnVersionId] || [];

      // Server applies fixes by span, last span first
      let currentText = baseVersion.text;
      const sortedFixes = [...fixes]
        .map((f) => {
          const finding = baseFindings.find((bf) => bf.id === f.findingId);
          return { ...f, span: finding?.span };
        })
        .filter((f) => f.span)
        .sort((a, b) => b.span.start - a.span.start);

      for (const fix of sortedFixes) {
        const { start, end } = fix.span;
        currentText = currentText.slice(0, start) + fix.replacement + currentText.slice(end);
      }
      newText = currentText;
    }

    const newNumber = detail.versions.length + 1;
    const newVersion = {
      id: `v_${Date.now()}`,
      number: newNumber,
      text: newText,
      aiUsed: false,
      aiModel: null,
      checkedAt: null,
      createdAt: new Date().toISOString(),
    };

    detail.versions.unshift(newVersion);
    detail.content.currentVersion = newNumber;
    detail.content.updatedAt = new Date().toISOString();
    state.findingsByVersion[newVersion.id] = [];

    return newVersion;
  },

  async submitContent(contentId, userName = 'Asha (Creator)') {
    await delay();
    const detail = state.contentDetails[contentId];
    if (!detail) throw { code: 'NOT_FOUND', message: 'Content not found' };

    // Check for open blocking findings on the latest version
    const latestVersion = detail.versions[0];
    const findings = state.findingsByVersion[latestVersion?.id] || [];
    const openBlocking = findings.some(
      (f) => f.severity === SEVERITIES.BLOCKING && f.status === FINDING_STATUS.OPEN
    );

    if (openBlocking) {
      const error = new Error('Resolve or dispute blocking findings first');
      error.code = 'CONFLICT';
      error.status = 409;
      throw error;
    }

    detail.content.status = CONTENT_STATUS.IN_REVIEW;
    detail.content.updatedAt = new Date().toISOString();

    state.auditByContent[contentId].unshift({
      id: `aud_${Date.now()}`,
      action: 'SUBMITTED_FOR_REVIEW',
      userName,
      meta: { versionNumber: latestVersion?.number },
      at: new Date().toISOString(),
    });

    return { ...detail.content };
  },

  async approveContent(contentId, { decision, note, userName = 'Rohan (Reviewer)', role = ROLES.REVIEWER }) {
    await delay();
    const detail = state.contentDetails[contentId];
    if (!detail) throw { code: 'NOT_FOUND', message: 'Content not found' };

    let newStatus = detail.content.status;
    if (decision === 'approve') {
      if (role === ROLES.REVIEWER) {
        newStatus = CONTENT_STATUS.REVIEWER_APPROVED;
      } else if (role === ROLES.MANAGER) {
        newStatus = CONTENT_STATUS.APPROVED;
      }
    } else if (decision === 'request_changes') {
      newStatus = CONTENT_STATUS.CHANGES_REQUESTED;
    } else if (decision === 'reject') {
      newStatus = CONTENT_STATUS.REJECTED;
    }

    detail.content.status = newStatus;
    detail.content.updatedAt = new Date().toISOString();

    const approval = {
      id: `appr_${Date.now()}`,
      stage: role === ROLES.MANAGER ? 'manager' : 'reviewer',
      decision,
      note,
      userName,
      createdAt: new Date().toISOString(),
    };

    state.auditByContent[contentId].unshift({
      id: `aud_${Date.now()}`,
      action: `WORKFLOW_${decision.toUpperCase()}`,
      userName,
      meta: { stage: approval.stage, note, resultingStatus: newStatus },
      at: new Date().toISOString(),
    });

    return {
      content: { ...detail.content },
      approval,
    };
  },

  async getComments(contentId) {
    await delay();
    return [...(state.commentsByContent[contentId] || [])];
  },

  async addComment(contentId, { text, findingId = null, versionId = null, authorName = 'Asha', authorRole = ROLES.CREATOR }) {
    await delay();
    const newComment = {
      id: `comm_${Date.now()}`,
      authorName,
      authorRole,
      text,
      findingId,
      versionId,
      createdAt: new Date().toISOString(),
    };

    if (!state.commentsByContent[contentId]) {
      state.commentsByContent[contentId] = [];
    }
    state.commentsByContent[contentId].push(newComment);
    return newComment;
  },

  async getAudit(contentId) {
    await delay();
    return [...(state.auditByContent[contentId] || [])];
  },

  async getInsightsSummary() {
    await delay();
    return {
      totals: {
        analyzedCount: 42,
        findingsCount: 128,
        approvedCount: 31,
        rejectionRate: 0.08,
      },
      byType: {
        tone: 38,
        terminology: 32,
        claim: 24,
        fact: 19,
        accessibility: 15,
      },
      byStatus: {
        open: 14,
        accepted: 62,
        edited: 28,
        disputed: 24,
      },
      topDisputedClauses: [
        { code: 'CLM-3.1', title: 'Claims & Superlatives', count: 12 },
        { code: 'TONE-2.1', title: 'Warm and calm voice', count: 7 },
        { code: 'MSG-1.2', title: 'Free delivery threshold', count: 5 },
      ],
    };
  },

  async resetSeed() {
    await delay();
    state = {
      users: [...SEED_USERS],
      org: { ...SEED_ORG },
      clauses: [...SEED_CLAUSES],
      facts: [...SEED_FACTS],
      terms: [...SEED_TERMS],
      contentList: [],
      contentDetails: {},
      findingsByVersion: {},
      commentsByContent: {},
      auditByContent: {},
    };
    initDemoDraftIfNeeded();
    return { reset: true };
  },
};
