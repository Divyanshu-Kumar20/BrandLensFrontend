import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Palette as PaletteIcon,
  Search,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  fetchAllKnowledge,
  addClause,
  editClause,
  removeClause,
  addFact,
  editFact,
  removeFact,
  addTerm,
  editTerm,
  removeTerm,
} from '../store/knowledgeSlice';
import { ROLES, CLAUSE_CATEGORIES } from '../utils/constants';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import usePageTitle from '../utils/usePageTitle';
import { updateOrgSettings } from '../store/authSlice';

export default function Knowledge() {
  usePageTitle('Knowledge Base');
  const dispatch = useDispatch();
  const { user, org } = useSelector((state) => state.auth);
  const { clauses, facts, terms, loading, error } = useSelector((state) => state.knowledge);
  const [updatingAiSetting, setUpdatingAiSetting] = useState(false);

  const [activeTab, setActiveTab] = useState('guidelines'); // guidelines | facts | terms | palette
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalType, setModalType] = useState(null); // 'clause' | 'fact' | 'term'
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type, id, title }

  // Form states
  const [clauseForm, setClauseForm] = useState({ code: '', title: '', text: '', category: 'tone' });
  const [factForm, setFactForm] = useState({ key: '', label: '', keywords: '', approvedValue: '', statement: '' });
  const [termForm, setTermForm] = useState({ term: '', kind: 'banned', replacement: '', clauseCode: '', note: '' });

  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    dispatch(fetchAllKnowledge());
  }, [dispatch]);

  // Handle open add modal
  const openAddModal = (type) => {
    setEditingItem(null);
    setModalType(type);
    if (type === 'clause') setClauseForm({ code: '', title: '', text: '', category: 'tone' });
    if (type === 'fact') setFactForm({ key: '', label: '', keywords: '', approvedValue: '', statement: '' });
    if (type === 'term') setTermForm({ term: '', kind: 'banned', replacement: '', clauseCode: 'TONE-2.1', note: '' });
  };

  // Handle open edit modal
  const openEditModal = (type, item) => {
    setEditingItem(item);
    setModalType(type);
    if (type === 'clause') {
      setClauseForm({ code: item.code, title: item.title, text: item.text, category: item.category });
    } else if (type === 'fact') {
      setFactForm({
        key: item.key,
        label: item.label,
        keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords || '',
        approvedValue: item.approvedValue,
        statement: item.statement,
      });
    } else if (type === 'term') {
      setTermForm({
        term: item.term,
        kind: item.kind,
        replacement: item.replacement || '',
        clauseCode: item.clauseCode || '',
        note: item.note || '',
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  // Submit Clause
  const handleSaveClause = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const res = await dispatch(editClause({ id: editingItem.id, payload: clauseForm }));
      if (!res.error) toast.success('Guideline clause updated');
    } else {
      const res = await dispatch(addClause(clauseForm));
      if (!res.error) toast.success('New guideline clause created');
    }
    closeModal();
  };

  // Submit Fact
  const handleSaveFact = async (e) => {
    e.preventDefault();
    const formattedPayload = {
      ...factForm,
      keywords: factForm.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    };
    if (editingItem) {
      const res = await dispatch(editFact({ id: editingItem.id, payload: formattedPayload }));
      if (!res.error) toast.success('Approved fact updated');
    } else {
      const res = await dispatch(addFact(formattedPayload));
      if (!res.error) toast.success('New approved fact created');
    }
    closeModal();
  };

  // Submit Term
  const handleSaveTerm = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const res = await dispatch(editTerm({ id: editingItem.id, payload: termForm }));
      if (!res.error) toast.success('Term updated');
    } else {
      const res = await dispatch(addTerm(termForm));
      if (!res.error) toast.success(`Added ${termForm.kind} term: "${termForm.term}"`);
    }
    closeModal();
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id } = deleteConfirmation;
    if (type === 'clause') {
      await dispatch(removeClause(id));
      toast.success('Clause deleted');
    } else if (type === 'fact') {
      await dispatch(removeFact(id));
      toast.success('Fact deleted');
    } else if (type === 'term') {
      await dispatch(removeTerm(id));
      toast.success('Term deleted');
    }
    setDeleteConfirmation(null);
  };

  // Filtered entries
  const filteredClauses = clauses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacts = facts.filter(
    (f) =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.approvedValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(f.keywords) && f.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredTerms = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.kind.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.replacement && t.replacement.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.clauseCode && t.clauseCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const brandColors = [
    { name: 'Navy Brand Primary', hex: '#1F2A44', role: 'Dominant headers, navigation, high emphasis', textLight: true },
    { name: 'Teal Accent', hex: '#0E7C86', role: 'Interactive elements, focus highlights, CTAs', textLight: true },
    { name: 'Light Background', hex: '#EAF4F5', role: 'Tonal surface tint, secondary pill containers', textLight: false },
    { name: 'Neutral White', hex: '#FFFFFF', role: 'Clean card backgrounds and surface elevations', textLight: false },
    { name: 'Blocking Severity (Red)', hex: '#DC2626', role: 'Critical brand violations requiring mandatory resolution', textLight: true },
    { name: 'Should-Fix Severity (Amber)', hex: '#D97706', role: 'Important guideline deviations needing reviewer attention', textLight: true },
    { name: 'Suggestion Severity (Blue)', hex: '#2563EB', role: 'Recommended phrasing polish or stylistic enhancements', textLight: true },
  ];

  const handleToggleAiSettings = async () => {
    if (!isAdmin) return;
    const newAiState = !(org?.aiEnabled ?? true);
    setUpdatingAiSetting(true);
    const res = await dispatch(updateOrgSettings({ aiEnabled: newAiState }));
    setUpdatingAiSetting(false);
    if (!res.error) {
      toast.success(newAiState ? 'AI Review enabled organization-wide' : 'AI Review disabled organization-wide');
    } else {
      toast.error('Failed to update organization settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* First-time user guide callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">First time using the Knowledge Base?</span>
            <p className="text-slate-600">
              Explore guidelines for brand voice and claims, verified factual assertions, banned/preferred terms, and approved visual palette tokens. Administrators can create, edit, or remove rules.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Switch for AI (PATCH /org/settings) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              org?.aiEnabled ?? true ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Organization AI Review Setting
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  org?.aiEnabled ?? true
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {org?.aiEnabled ?? true ? 'AI Enabled (Gemini)' : 'Deterministic Rules Only'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin
                ? 'Administrators can toggle whether Gemini AI evaluates tone and superlative claims organization-wide.'
                : 'Current organization-wide status configured by an administrator via PATCH /org/settings.'}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <button
            type="button"
            id="admin-toggle-ai-switch"
            onClick={handleToggleAiSettings}
            disabled={updatingAiSetting}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-teal ${
              org?.aiEnabled ?? true
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-brand-teal hover:bg-brand-teal-dark text-white'
            }`}
          >
            <span>
              {updatingAiSetting
                ? 'Updating...'
                : (org?.aiEnabled ?? true)
                ? 'Disable AI Org-wide'
                : 'Enable AI Org-wide'}
            </span>
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Managed by Admin
          </span>
        )}
      </div>

      {/* Required Plan Banner */}
      <div
        id="knowledge-citation-banner"
        className="bg-brand-navy text-white rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center flex-shrink-0 text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
              Findings can only cite what is stored here.
            </h2>
            <p className="text-xs text-brand-light/90">
              Deterministic rule checks and Gemini AI citations are strictly grounded in this knowledge base.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span
            className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold uppercase ${
              isAdmin
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isAdmin ? 'Admin: Read/Write' : `Role: ${user?.role || 'Guest'} (Read-Only)`}
          </span>
        </div>
      </div>

      {/* Tabs and Search Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Tab buttons */}
          <nav className="flex space-x-1 sm:space-x-2" role="tablist" aria-label="Knowledge Base Categories">
            {[
              { id: 'guidelines', label: 'Guidelines', count: clauses.length },
              { id: 'facts', label: 'Facts', count: facts.length },
              { id: 'terms', label: 'Terms', count: terms.length },
              { id: 'palette', label: 'Palette', count: brandColors.length },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                    active
                      ? 'bg-brand-teal text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Search bar & Add Button */}
          <div className="flex items-center gap-2">
            {activeTab !== 'palette' && (
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 focus:bg-white transition"
                />
              </div>
            )}

            {isAdmin && activeTab !== 'palette' && (
              <button
                type="button"
                id={`btn-add-${activeTab}`}
                onClick={() => openAddModal(activeTab === 'guidelines' ? 'clause' : activeTab === 'facts' ? 'fact' : 'term')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add {activeTab === 'guidelines' ? 'Clause' : activeTab === 'facts' ? 'Fact' : 'Term'}
              </button>
            )}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && <ErrorMessage message={error} onRetry={() => dispatch(fetchAllKnowledge())} />}

        {/* Loading State */}
        {loading && <Loading message="Loading brand governance entries..." rows={4} />}

        {/* TAB 1: GUIDELINES (CLAUSES) */}
        {!loading && activeTab === 'guidelines' && (
          <div>
            {filteredClauses.length === 0 ? (
              <EmptyState
                title="No guideline clauses found"
                description={searchQuery ? 'Try adjusting your search criteria.' : 'No guidelines have been entered yet.'}
                action={
                  isAdmin ? (
                    <button
                      onClick={() => openAddModal('clause')}
                      className="px-3 py-1.5 rounded-lg bg-brand-teal text-white text-xs font-semibold"
                    >
                      Add First Clause
                    </button>
                  ) : null
                }
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Guideline Text</th>
                      {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredClauses.map((clause) => (
                      <tr key={clause.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-brand-navy whitespace-nowrap">
                          {clause.code}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                          {clause.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 capitalize border border-slate-200">
                            {clause.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-md">
                          {clause.text}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => openEditModal('clause', clause)}
                              className="p-1 rounded text-slate-400 hover:text-brand-teal hover:bg-slate-100 transition"
                              title="Edit Clause"
                              aria-label={`Edit ${clause.code}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({ type: 'clause', id: clause.id, title: clause.code })}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Clause"
                              aria-label={`Delete ${clause.code}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FACTS */}
        {!loading && activeTab === 'facts' && (
          <div>
            {filteredFacts.length === 0 ? (
              <EmptyState
                title="No approved facts found"
                description={searchQuery ? 'Try adjusting your search criteria.' : 'No verified company facts have been entered.'}
                action={
                  isAdmin ? (
                    <button
                      onClick={() => openAddModal('fact')}
                      className="px-3 py-1.5 rounded-lg bg-brand-teal text-white text-xs font-semibold"
                    >
                      Add First Fact
                    </button>
                  ) : null
                }
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Key / Label</th>
                      <th className="px-4 py-3">Approved Value</th>
                      <th className="px-4 py-3">Statement</th>
                      <th className="px-4 py-3">Keywords</th>
                      {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredFacts.map((fact) => (
                      <tr key={fact.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{fact.label}</div>
                          <div className="text-[11px] font-mono text-slate-600">{fact.key}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-teal whitespace-nowrap">
                          {fact.approvedValue}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-sm">
                          {fact.statement}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(fact.keywords) &&
                              fact.keywords.map((kw, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                                  {kw}
                                </span>
                              ))}
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => openEditModal('fact', fact)}
                              className="p-1 rounded text-slate-400 hover:text-brand-teal hover:bg-slate-100 transition"
                              title="Edit Fact"
                              aria-label={`Edit ${fact.label}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({ type: 'fact', id: fact.id, title: fact.label })}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Fact"
                              aria-label={`Delete ${fact.label}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TERMS (BANNED / PREFERRED) */}
        {!loading && activeTab === 'terms' && (
          <div>
            {filteredTerms.length === 0 ? (
              <EmptyState
                title="No terminology rules found"
                description={searchQuery ? 'Try adjusting your search criteria.' : 'No banned or preferred terms defined.'}
                action={
                  isAdmin ? (
                    <button
                      onClick={() => openAddModal('term')}
                      className="px-3 py-1.5 rounded-lg bg-brand-teal text-white text-xs font-semibold"
                    >
                      Add First Term
                    </button>
                  ) : null
                }
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Term</th>
                      <th className="px-4 py-3">Classification</th>
                      <th className="px-4 py-3">Approved Replacement</th>
                      <th className="px-4 py-3">Associated Clause</th>
                      <th className="px-4 py-3">Usage Note</th>
                      {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredTerms.map((term) => (
                      <tr key={term.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                          &ldquo;{term.term}&rdquo;
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              term.kind === 'banned'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {term.kind}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-brand-teal whitespace-nowrap">
                          {term.replacement || <span className="text-slate-600 italic">None specified</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                          {term.clauseCode || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs">
                          {term.note || '—'}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => openEditModal('term', term)}
                              className="p-1 rounded text-slate-400 hover:text-brand-teal hover:bg-slate-100 transition"
                              title="Edit Term"
                              aria-label={`Edit ${term.term}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({ type: 'term', id: term.id, title: term.term })}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Term"
                              aria-label={`Delete ${term.term}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PALETTE */}
        {activeTab === 'palette' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <Info className="w-4 h-4 text-brand-teal flex-shrink-0" />
              <span>
                <strong>VIS-5.1 Brand Colours Guideline:</strong> All brand assets must adhere to approved color swatches with sufficient WCAG AA contrast (minimum 4.5:1).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandColors.map((color, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div
                    className="h-24 p-4 flex flex-col justify-between"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        color.textLight ? 'text-white/80' : 'text-slate-800/80'
                      }`}
                    >
                      Brand Token
                    </div>
                    <div
                      className={`text-lg font-mono font-extrabold ${
                        color.textLight ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {color.hex}
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="text-xs font-bold text-slate-800">{color.name}</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Modal Form: Clause / Fact / Term */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 id="modal-title" className="text-sm font-bold text-brand-navy">
                {editingItem ? 'Edit' : 'Add New'}{' '}
                {modalType === 'clause' ? 'Guideline Clause' : modalType === 'fact' ? 'Approved Fact' : 'Terminology Rule'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM: Clause */}
            {modalType === 'clause' && (
              <form onSubmit={handleSaveClause} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="clause-code" className="block text-xs font-semibold text-slate-700 mb-1">
                      Clause Code
                    </label>
                    <input
                      id="clause-code"
                      type="text"
                      required
                      placeholder="TONE-2.1"
                      value={clauseForm.code}
                      onChange={(e) => setClauseForm({ ...clauseForm, code: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="clause-category" className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      id="clause-category"
                      value={clauseForm.category}
                      onChange={(e) => setClauseForm({ ...clauseForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal capitalize bg-white"
                    >
                      {Object.values(CLAUSE_CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="clause-title" className="block text-xs font-semibold text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    id="clause-title"
                    type="text"
                    required
                    placeholder="Warm and calm voice"
                    value={clauseForm.title}
                    onChange={(e) => setClauseForm({ ...clauseForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label htmlFor="clause-text" className="block text-xs font-semibold text-slate-700 mb-1">
                    Guideline Rule Description
                  </label>
                  <textarea
                    id="clause-text"
                    required
                    rows={3}
                    placeholder="Voice is warm, calm and plain; no hype or heavy exclamation marks."
                    value={clauseForm.text}
                    onChange={(e) => setClauseForm({ ...clauseForm, text: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg transition shadow-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Create Clause'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM: Fact */}
            {modalType === 'fact' && (
              <form onSubmit={handleSaveFact} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="fact-key" className="block text-xs font-semibold text-slate-700 mb-1">
                      Identifier Key
                    </label>
                    <input
                      id="fact-key"
                      type="text"
                      required
                      placeholder="delivery_threshold"
                      value={factForm.key}
                      onChange={(e) => setFactForm({ ...factForm, key: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="fact-label" className="block text-xs font-semibold text-slate-700 mb-1">
                      Fact Label
                    </label>
                    <input
                      id="fact-label"
                      type="text"
                      required
                      placeholder="Delivery Threshold"
                      value={factForm.label}
                      onChange={(e) => setFactForm({ ...factForm, label: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="fact-approved-value" className="block text-xs font-semibold text-slate-700 mb-1">
                    Approved Value
                  </label>
                  <input
                    id="fact-approved-value"
                    type="text"
                    required
                    placeholder="free delivery above Rs 499"
                    value={factForm.approvedValue}
                    onChange={(e) => setFactForm({ ...factForm, approvedValue: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal font-semibold text-brand-teal"
                  />
                </div>

                <div>
                  <label htmlFor="fact-keywords" className="block text-xs font-semibold text-slate-700 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    id="fact-keywords"
                    type="text"
                    placeholder="delivery, free shipping, minimum order"
                    value={factForm.keywords}
                    onChange={(e) => setFactForm({ ...factForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div>
                  <label htmlFor="fact-statement" className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Ground-Truth Statement
                  </label>
                  <textarea
                    id="fact-statement"
                    required
                    rows={2}
                    placeholder="Free delivery applies to orders above Rs 499 only."
                    value={factForm.statement}
                    onChange={(e) => setFactForm({ ...factForm, statement: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg transition shadow-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Create Fact'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM: Term */}
            {modalType === 'term' && (
              <form onSubmit={handleSaveTerm} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="term-text" className="block text-xs font-semibold text-slate-700 mb-1">
                      Term
                    </label>
                    <input
                      id="term-text"
                      type="text"
                      required
                      placeholder="cheap"
                      value={termForm.term}
                      onChange={(e) => setTermForm({ ...termForm, term: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor="term-kind" className="block text-xs font-semibold text-slate-700 mb-1">
                      Classification
                    </label>
                    <select
                      id="term-kind"
                      value={termForm.kind}
                      onChange={(e) => setTermForm({ ...termForm, kind: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal uppercase font-bold bg-white"
                    >
                      <option value="banned">Banned</option>
                      <option value="preferred">Preferred</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="term-replacement" className="block text-xs font-semibold text-slate-700 mb-1">
                      Approved Replacement
                    </label>
                    <input
                      id="term-replacement"
                      type="text"
                      placeholder="most affordable"
                      value={termForm.replacement}
                      onChange={(e) => setTermForm({ ...termForm, replacement: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal text-brand-teal font-semibold"
                    />
                  </div>
                  <div>
                    <label htmlFor="term-clause-code" className="block text-xs font-semibold text-slate-700 mb-1">
                      Associated Clause Code
                    </label>
                    <input
                      id="term-clause-code"
                      type="text"
                      placeholder="TONE-2.1"
                      value={termForm.clauseCode}
                      onChange={(e) => setTermForm({ ...termForm, clauseCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="term-note" className="block text-xs font-semibold text-slate-700 mb-1">
                    Guideline Usage Note
                  </label>
                  <textarea
                    id="term-note"
                    rows={2}
                    placeholder="'cheap' diminishes our premium artisanal position."
                    value={termForm.note}
                    onChange={(e) => setTermForm({ ...termForm, note: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="btn-save-term"
                    className="px-4 py-2 text-xs font-bold bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg transition shadow-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Create Term'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Knowledge Entry?</h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove &ldquo;{deleteConfirmation.title}&rdquo;? Findings can no longer cite this item.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
