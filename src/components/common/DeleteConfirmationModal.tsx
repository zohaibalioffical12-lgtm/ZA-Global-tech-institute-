import React, { useState } from 'react';
import { AlertTriangle, Trash2, Archive, X, Loader2, ShieldAlert } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType: string;
  warningMessage: string;
  statsSummary?: { label: string; value: number | string }[];
  isArchiveOptionAvailable?: boolean;
  isDeleting: boolean;
  requireTypingConfirm?: boolean;
  onConfirmArchive?: () => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType,
  warningMessage,
  statsSummary,
  isArchiveOptionAvailable,
  isDeleting,
  requireTypingConfirm,
  onConfirmArchive,
  onConfirmDelete,
  onCancel,
}) => {
  const [typedConfirm, setTypedConfirm] = useState('');

  if (!isOpen) return null;

  const canConfirm = !requireTypingConfirm || typedConfirm.trim().toUpperCase() === 'DELETE';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0b152d] border border-red-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 text-white space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
                {itemType} Management
              </span>
              <h3 id="delete-dialog-title" className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item Name Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Item</span>
            <p className="text-sm font-bold text-amber-300 truncate font-mono">{itemName}</p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300 uppercase shrink-0">
            {itemType}
          </span>
        </div>

        {/* Warning & Consequence Explanation */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
          <p>{warningMessage}</p>
        </div>

        {/* Stats summary of related records if present */}
        {statsSummary && statsSummary.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
            {statsSummary.map((stat, i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-white/5">
                <span className="text-xs font-mono font-bold text-white block">{stat.value}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Optional typing confirmation for extra security */}
        {requireTypingConfirm && (
          <div className="space-y-1.5 pt-1">
            <label className="text-xs text-slate-400 block">
              Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm permanent deletion:
            </label>
            <input
              type="text"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-red-500/30 text-white text-sm focus:border-red-400 focus:outline-none font-mono"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {isArchiveOptionAvailable && onConfirmArchive && (
            <button
              type="button"
              onClick={onConfirmArchive}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Archive className="w-4 h-4" />
              <span>Archive (Recommended)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onConfirmDelete}
            disabled={isDeleting || !canConfirm}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              canConfirm && !isDeleting
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-red-950/50 text-red-400/50 cursor-not-allowed border border-red-900/40'
            }`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
