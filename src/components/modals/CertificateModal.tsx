import React from 'react';
import { Certificate } from '../../types/index.ts';
import { Logo } from '../common/Logo.tsx';
import { X, Printer, ShieldCheck, Download, Award, CheckCircle } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-6">
        {/* Top Control Toolbar */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-white/10 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Award className="w-4 h-4" />
            <span>Official Institute Digital Certificate of Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Print Container */}
        <div className="p-4 sm:p-10 flex justify-center bg-slate-950/80">
          <div
            id="certificate-print-area"
            className="relative w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-b from-[#0d1630] via-[#0b152d] to-[#070d1e] text-slate-100 rounded-xl p-8 sm:p-12 border-4 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col justify-between overflow-hidden select-none"
          >
            {/* Guilloché Geometric Corner Accents */}
            <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute inset-4 border border-amber-400/30 rounded pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex justify-center mb-2">
                <Logo size="md" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-400 font-['Space_Grotesk']">
                ZA GLOBAL TECH INSTITUTE
              </div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400">
                LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white uppercase font-['Space_Grotesk'] pt-2 drop-shadow">
                Certificate of Completion
              </h2>
            </div>

            {/* Certificate Recipient Body */}
            <div className="text-center space-y-3 my-auto relative z-10">
              <p className="text-xs text-slate-400 italic">
                This is to officially certify that
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-['Space_Grotesk'] pb-1">
                {certificate.studentName}
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                has successfully fulfilled all curriculum requirements, practical project evaluations, and assessments for the professional course:
              </p>
              <h4 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                "{certificate.courseTitle}"
              </h4>
            </div>

            {/* Certificate Footer / Signature & QR Seal */}
            <div className="pt-4 border-t border-white/10 flex items-end justify-between relative z-10 text-xs">
              {/* Founder Signature */}
              <div className="space-y-1 text-left">
                <div className="font-['Space_Grotesk'] font-bold text-amber-300 text-sm tracking-wide">
                  Zohaib Ali
                </div>
                <div className="w-32 h-[1px] bg-amber-400/60" />
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">
                  Founder & Director
                </div>
                <div className="text-[9px] text-slate-400">
                  ZA Global Tech Institute
                </div>
              </div>

              {/* Anti-Counterfeit Verification Center */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  ID: <span className="text-amber-400 font-bold">{certificate.certificateId}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  Code: <span className="text-white font-bold">{certificate.verificationCode}</span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Issue Date: <span className="text-slate-200">{certificate.issueDate}</span>
                </div>
              </div>

              {/* QR Verification Code */}
              <div className="flex flex-col items-end space-y-1">
                {certificate.qrCodeUrl ? (
                  <img
                    src={certificate.qrCodeUrl}
                    alt="Certificate QR Verification"
                    className="w-16 h-16 rounded bg-white p-1 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px] text-slate-500">
                    QR Sealed
                  </div>
                )}
                <span className="text-[8px] text-slate-400 tracking-wider uppercase font-mono">
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
