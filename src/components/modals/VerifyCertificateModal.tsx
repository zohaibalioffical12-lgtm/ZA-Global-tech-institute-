import React, { useState } from 'react';
import { Certificate } from '../../types/index.ts';
import { X, Search, CheckCircle2, AlertTriangle, Award, ShieldCheck } from 'lucide-react';

interface VerifyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.valid && data.certificate) {
        setResult(data.certificate);
      } else {
        setErrorMsg(data.message || 'No matching certificate found in institute database.');
      }
    } catch {
      setErrorMsg('Failed to connect to verification server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0b152d] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Verify Digital Certificate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter the unique verification code printed on any ZA Global Tech Institute certificate (or scanned from the QR code) to authenticate genuine student credential records.
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ZA-PE-77291"
                className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Checking...' : 'Verify'}</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Sample verification code for testing:</span>
              <button
                type="button"
                onClick={() => setCode('ZA-PE-77291')}
                className="text-amber-400 font-mono font-bold hover:underline"
              >
                ZA-PE-77291
              </button>
            </div>
          </form>

          {searched && (
            <div className="pt-2">
              {result ? (
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Official Verified Certificate</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Student Name:</span>
                      <span className="text-white font-bold">{result.studentName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Course Title:</span>
                      <span className="text-white font-medium">{result.courseTitle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Issue Date:</span>
                      <span className="text-slate-200">{result.issueDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Certificate ID:</span>
                      <span className="text-amber-300 font-mono font-bold">{result.certificateId}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Issued by:</span>
                      <span className="text-slate-200 font-semibold">{result.issuer || 'Zohaib Ali — Founder & Owner'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically verified against PostgreSQL institute records.</span>
                  </div>
                </div>
              ) : errorMsg ? (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
