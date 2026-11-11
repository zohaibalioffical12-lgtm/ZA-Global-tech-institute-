import React from 'react';
import { FileText, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';

interface TermsPageProps {
  settings?: SiteSettings | null;
}

export const TermsPage: React.FC<TermsPageProps> = ({ settings }) => {
  const customTerms = settings?.terms_conditions;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Academic Honor Code & Platform Usage • ZA GLOBAL TECH INSTITUTE
        </p>
      </div>

      <div className="rounded-3xl bg-[#0d1a38] border border-white/10 p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {customTerms ? (
          <div className="whitespace-pre-line text-slate-200">
            {customTerms}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>1. Acceptance of Terms</span>
              </h2>
              <p>
                By creating an account, enrolling in free or paid courses, or submitting project assessments on ZA GLOBAL TECH INSTITUTE, you agree to comply with these terms, our code of conduct, and all applicable digital laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>2. Academic Integrity & Course Completion</span>
              </h2>
              <p>
                Students must submit original work for assignments and independently answer quiz questions. Official certificates of completion with QR verification codes are issued exclusively upon fulfilling 100% of lecture and curriculum evaluations as determined by course instructors and the institute founder.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>3. Course Pricing & Fee Policy</span>
              </h2>
              <p>
                Free courses are provided at PKR 0 without tuition fees. For paid courses, verified payment is required before full lecture access is unlocked. Previously enrolled students preserve their active course access according to institute policy even if course pricing is subsequently updated by administration.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                4. Intellectual Property & Lecture Videos
              </h2>
              <p>
                All course curriculums, lesson notes, and custom instructional assets remain the intellectual property of ZA GLOBAL TECH INSTITUTE and its founder Zohaib Ali. Students are granted personal, non-transferable access for their own education and are prohibited from unauthorized redistribution of unlisted video links or proprietary learning materials.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
