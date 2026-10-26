import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  PenTool,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Send,
  Share2,
  Mail,
  Globe,
  Presentation,
  Info,
} from 'lucide-react';
import { createAndReviewContent } from '../store/contentSlice';
import { CHANNELS } from '../utils/constants';
import usePageTitle from '../utils/usePageTitle';
import AiDisclosureBanner from '../components/AiDisclosureBanner';

const DEMO_DRAFT = {
  title: 'Summer Launch Announcement',
  channel: CHANNELS.SOCIAL,
  text: `Get our CHEAPEST cold brew ever!!! Nimbus is the world's best coffee and guaranteed to boost your energy. Free delivery on all orders, and returns within 30 days.\nClick here to order: nimbus.example`,
};

export default function NewContent() {
  usePageTitle('New Draft');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, org } = useSelector((state) => state.auth);
  const { reviewing, error } = useSelector((state) => state.content);

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState(CHANNELS.SOCIAL);
  const [text, setText] = useState('');
  const [useAi, setUseAi] = useState(org?.aiEnabled ?? true);

  // Fill sample draft
  const handleTrySampleDraft = () => {
    setTitle(DEMO_DRAFT.title);
    setChannel(DEMO_DRAFT.channel);
    setText(DEMO_DRAFT.text);
    setUseAi(true);
    toast.success('Loaded Nimbus Coffee demo draft');
  };

  const handleReset = () => {
    setTitle('');
    setText('');
    setChannel(CHANNELS.SOCIAL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      toast.error('Please provide both a title and draft text.');
      return;
    }

    const result = await dispatch(
      createAndReviewContent({
        title: title.trim(),
        channel,
        text: text.trim(),
        useAi,
        userName: user?.name || 'Asha (Creator)',
      })
    );

    if (result.type === 'content/createAndReview/fulfilled') {
      const createdContent = result.payload.content;
      toast.success('Draft verified! Redirecting to review screen...');
      navigate(`/content/${createdContent.id}`);
    } else {
      toast.error(result.payload || 'Failed to review draft');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header and Quick action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Nimbus Coffee Co. &bull; Content Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            New Marketing Draft
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Draft and inspect promotional copy before submission to reviewer and manager approval.
          </p>
        </div>

        <button
          type="button"
          id="btn-try-sample-draft"
          onClick={handleTrySampleDraft}
          disabled={reviewing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          Try sample draft
        </button>
      </div>

      {/* First-time user guide callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Tips for drafting marketing copy:</span>
            <p className="text-slate-600">
              Select your publication channel, input draft text or click <strong>&quot;Try sample draft&quot;</strong> to fill our demo copy. When you click <strong>&quot;Check content&quot;</strong>, BrandLens validates your text against stored brand rules and Gemini AI.
            </p>
          </div>
        </div>
      </div>

      {/* AI Transparency & Governance Disclosure Banner */}
      <AiDisclosureBanner />

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Error banner if submission failed */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <div className="font-bold">Failed to analyze content</div>
              <div className="text-[11px] text-rose-700">{error}</div>
            </div>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label htmlFor="draft-title" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Content Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="draft-title"
            type="text"
            required
            disabled={reviewing}
            placeholder="e.g. Summer Launch Announcement"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal bg-slate-50 focus:bg-white transition"
          />
        </div>

        {/* Channel Selector */}
        <div>
          <label htmlFor="draft-channel" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Distribution Channel <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: CHANNELS.SOCIAL, label: 'Social Media', icon: Share2 },
              { id: CHANNELS.EMAIL, label: 'Email Newsletter', icon: Mail },
              { id: CHANNELS.WEB, label: 'Website / Landing', icon: Globe },
              { id: CHANNELS.DECK, label: 'Pitch Deck / PDF', icon: Presentation },
            ].map((ch) => {
              const active = channel === ch.id;
              const Icon = ch.icon;
              return (
                <button
                  key={ch.id}
                  type="button"
                  disabled={reviewing}
                  onClick={() => setChannel(ch.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                    active
                      ? 'border-brand-teal bg-teal-50/50 text-brand-navy shadow-sm ring-1 ring-brand-teal'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-teal' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold capitalize">{ch.id}</div>
                    <div className="text-[10px] text-slate-500">{ch.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Draft Text Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="draft-text" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Marketing Copy / Draft Text <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-600">
              {text.length} characters
            </span>
          </div>
          <textarea
            id="draft-text"
            required
            rows={6}
            disabled={reviewing}
            placeholder="Paste or write your promotional text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal bg-slate-50 focus:bg-white transition font-sans leading-relaxed"
          />
        </div>

        {/* AI Review Toggle & Clear Disclosure */}
        {(() => {
          const isOrgAiDisabled = org && org.aiEnabled === false;
          return (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <label htmlFor="toggle-ai-review" className="text-xs font-bold text-slate-900 cursor-pointer">
                    Use AI review (Gemini Model)
                  </label>
                  {isOrgAiDisabled && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                      Disabled by Admin
                    </span>
                  )}
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="toggle-ai-review"
                    type="checkbox"
                    checked={useAi && !isOrgAiDisabled}
                    disabled={reviewing || isOrgAiDisabled}
                    onChange={(e) => setUseAi(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal peer-disabled:opacity-40"></div>
                </label>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 border-t border-slate-200 pt-2.5">
                <strong>Disclosure of external data transmission:</strong>{' '}
                {isOrgAiDisabled ? (
                  <span className="text-amber-800 font-medium">
                    AI review is currently disabled organization-wide by an administrator (PATCH /org/settings). Content checks will run strictly against local deterministic rules stored in the knowledge base.
                  </span>
                ) : useAi ? (
                  <span>
                    When enabled, your draft title and text will be sent to the external Google Gemini API through our secure backend for deep semantic analysis and superlative claim verification. Deterministic brand rules execute concurrently.
                  </span>
                ) : (
                  <span>
                    AI review is disabled. Only deterministic brand rules (banned terms, exact fact thresholds, punctuation) stored in your local knowledge base will be checked.
                  </span>
                )}
              </p>
            </div>
          );
        })()}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={reviewing || (!title && !text)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset form
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition text-center flex-1 sm:flex-initial"
            >
              Cancel
            </Link>

            <button
              type="submit"
              id="btn-check-content"
              disabled={reviewing || !title.trim() || !text.trim()}
              className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal flex items-center justify-center gap-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reviewing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-brand-teal-light" />
                  <span>Checking content...</span>
                </>
              ) : (
                <>
                  <span>Check content</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
