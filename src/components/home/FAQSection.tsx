import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the YouTube unlisted video lecture player work?',
      a: 'All course lectures are recorded in high-definition and organized into modular playlists using YouTube’s robust infrastructure. Enrolled students watch protected video content directly inside our dedicated player without advertisements or distractions, with automatic lesson progress tracking.',
    },
    {
      q: 'What is the difference between Free and Paid courses?',
      a: 'Free courses require zero tuition fee (PKR 0) and allow immediate self-enrollment upon sign-in. Paid courses offer specialized pro-level certifications with instructor code reviews, graded assignments, personal mentor support, and downloadable project source files.',
    },
    {
      q: 'What payment methods can I use to pay course fees in Pakistan?',
      a: 'We support EasyPaisa, JazzCash, direct Pakistani Bank Transfer (Meezan Bank IBAN), and Debit Card. After submitting your payment reference or transaction ID, the admin finance department verifies your transaction and activates your course access.',
    },
    {
      q: 'How are digital certificates verified?',
      a: 'Every student who completes 100% of course lessons and required evaluations receives an official digital certificate featuring a unique Certificate ID, verification code, and QR seal. Anyone (clients, employers) can verify its authenticity on our public verification portal.',
    },
    {
      q: 'Can existing students lose access if a free course becomes paid?',
      a: 'No. The institute respects student progress: previously enrolled students retain access according to institute policy even if an administrator adjusts course pricing for future cohorts.',
    },
    {
      q: 'Who is the founder of ZA Global Tech Institute?',
      a: 'ZA Global Tech Institute was founded and is owned by Zohaib Ali with the mission: "LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE."',
    },
  ];

  return (
    <section className="py-20 bg-[#070d1e] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-300">
            Everything you need to know about enrollments, YouTube lectures, payments in PKR, and certificates.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0f1c3d]/70 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors"
                >
                  <span className="font-['Space_Grotesk'] pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
