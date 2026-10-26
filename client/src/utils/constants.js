// Section 4 API Enums and constants - EXACT match to contract
export const ROLES = {
  ADMIN: 'admin',
  CREATOR: 'creator',
  REVIEWER: 'reviewer',
  MANAGER: 'manager',
};

export const CHANNELS = {
  SOCIAL: 'social',
  EMAIL: 'email',
  WEB: 'web',
  DECK: 'deck',
};

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  CHANGES_REQUESTED: 'changes_requested',
  REVIEWER_APPROVED: 'reviewer_approved',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const FINDING_TYPES = {
  TONE: 'tone',
  TERMINOLOGY: 'terminology',
  FACT: 'fact',
  CLAIM: 'claim',
  ACCESSIBILITY: 'accessibility',
  MESSAGING: 'messaging',
};

export const SEVERITIES = {
  BLOCKING: 'blocking',
  SHOULD_FIX: 'should_fix',
  SUGGESTION: 'suggestion',
};

export const FINDING_STATUS = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  EDITED: 'edited',
  DISPUTED: 'disputed',
  DISMISSED: 'dismissed',
};

export const FINDING_ORIGINS = {
  RULE: 'rule',
  AI: 'ai',
};

export const APPROVAL_DECISIONS = {
  APPROVE: 'approve',
  REQUEST_CHANGES: 'request_changes',
  REJECT: 'reject',
};

export const CLAUSE_CATEGORIES = {
  TONE: 'tone',
  TERMINOLOGY: 'terminology',
  MESSAGING: 'messaging',
  CLAIMS: 'claims',
  ACCESSIBILITY: 'accessibility',
  VISUAL: 'visual',
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
};
