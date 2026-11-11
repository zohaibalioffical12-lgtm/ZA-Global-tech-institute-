import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';

interface PrivacyPolicyPageProps {
  settings?: SiteSettings | null;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings }) => {
  const customPolicy = settings?.privacy_policy;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Legal & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Last Updated: November 2026 • ZA GLOBAL TECH INSTITUTE
        </p>
      </div>

      <div className="rounded-3xl bg-[#0d1a38] border border-white/10 p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {customPolicy ? (
          <div className="whitespace-pre-line text-slate-200">
            {customPolicy}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>1. Commitment to Student Privacy</span>
              </h2>
              <p>
                ZA GLOBAL TECH INSTITUTE ("we", "our", "the Institute") is dedicated to protecting the privacy and personal data of our learners, teachers, and website visitors. We operate under strict privacy practices designed to safeguard academic, contact, and enrollment information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>2. Information We Collect</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong className="text-white">Account Details:</strong> Full name, verified email address, phone number, and optional profile image via Firebase Authentication and Google OAuth.</li>
                <li><strong className="text-white">Academic Records:</strong> Course enrollments, video lecture playback progress, assignment submissions, quiz attempt scores, and earned digital completion certificates.</li>
                <li><strong className="text-white">Transaction Information:</strong> Transaction reference IDs, bank deposit references, or EasyPaisa/JazzCash sender details for paid course fee verification. We do not store full credit card numbers on our servers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>3. How Information is Used</span>
              </h2>
              <p>
                Data collected is used exclusively to facilitate course streaming, record learning completion milestones, generate verifiable digital certificates, communicate administrative announcements, and process student support tickets. We never sell, rent, or trade your personal data with third-party advertising brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                4. YouTube Lecture Data
              </h2>
              <p>
                Our video curriculum utilizes the official YouTube IFrame Player API. When viewing unlisted video lectures, your interactions are handled securely within our application shell, and video playback complies with YouTube terms of service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                5. Contact the Data Protection Officer
              </h2>
              <p>
                If you have questions regarding your data or wish to request profile updates or account closure, please email our administrative office at <span className="text-cyan-400 font-semibold">{settings?.official_email || 'info@zaglobaltech.com'}</span>.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
