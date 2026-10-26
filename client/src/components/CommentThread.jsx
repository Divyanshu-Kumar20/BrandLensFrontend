import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Tag, User, Clock, Filter } from 'lucide-react';
import { postComment } from '../store/contentSlice';
import { ROLES } from '../utils/constants';

export default function CommentThread({ contentId, findings = [], selectedFindingId = null }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { comments = [] } = useSelector((state) => state.content);

  const [text, setText] = useState('');
  const [targetFindingId, setTargetFindingId] = useState(selectedFindingId || 'GENERAL');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'SELECTED'
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    const result = await dispatch(
      postComment({
        contentId,
        text: text.trim(),
        findingId: targetFindingId === 'GENERAL' ? null : targetFindingId,
        authorName: user?.name || 'User',
        authorRole: user?.role || ROLES.CREATOR,
      })
    );
    setSubmitting(false);

    if (!result.error) {
      setText('');
      toast.success('Comment added to discussion thread');
    } else {
      toast.error('Failed to post comment');
    }
  };

  const filteredComments =
    filterMode === 'SELECTED' && selectedFindingId
      ? comments.filter((c) => c.findingId === selectedFindingId)
      : comments;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getRoleBadgeClasses = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case ROLES.MANAGER:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ROLES.REVIEWER:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-teal" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Discussion &amp; Governance Notes ({comments.length})
          </h3>
        </div>

        {selectedFindingId && (
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-2.5 py-0.5 rounded font-medium transition ${
                filterMode === 'ALL' ? 'bg-white shadow-xs font-bold text-brand-navy' : 'text-slate-600'
              }`}
            >
              All ({comments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('SELECTED')}
              className={`px-2.5 py-0.5 rounded font-medium transition ${
                filterMode === 'SELECTED' ? 'bg-white shadow-xs font-bold text-brand-navy' : 'text-slate-600'
              }`}
            >
              On Selected Finding
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {filteredComments.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No discussion comments yet. Start the conversation below.
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <span>{comment.authorName}</span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${getRoleBadgeClasses(
                      comment.authorRole
                    )}`}
                  >
                    {comment.authorRole}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  {formatDate(comment.createdAt)}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed font-sans">{comment.text}</p>

              {comment.findingId && (
                <div className="pt-1 flex items-center gap-1 text-[10px] text-brand-teal font-mono">
                  <Tag className="w-3 h-3" />
                  <span>Referenced to finding: {comment.findingId}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="comment-input" className="font-semibold text-slate-700">
            Add to Discussion
          </label>

          <select
            value={targetFindingId}
            onChange={(e) => setTargetFindingId(e.target.value)}
            className="text-[11px] border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-teal"
          >
            <option value="GENERAL">General discussion note</option>
            {findings.map((f) => (
              <option key={f.id} value={f.id}>
                Finding on &ldquo;{f.span?.text || f.id}&rdquo; ({f.type})
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <textarea
            id="comment-input"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share feedback, clarification or context..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white pr-20"
          />

          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="absolute right-2.5 bottom-3.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-[11px] font-bold shadow-xs disabled:opacity-40 transition"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
