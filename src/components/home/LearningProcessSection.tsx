import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  PlayCircle,
  FileCode,
  CheckCircle,
  Award,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface LearningProcessSectionProps {
  onStartLearning: () => void;
}

export const LearningProcessSection: React.FC<LearningProcessSectionProps> = ({
  onStartLearning,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Select Your Discipline',
      subtitle: 'Free Foundational or Paid Masterclasses',
      icon: BookOpen,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-400/30',
      desc: 'Explore 14 cutting-edge domains including AI, Prompt Engineering, Web Development, and Freelancing. Choose between 100% Free foundational tracks or comprehensive Paid masterclasses with no hidden tuition barriers.',
      deliverable: 'Personalized Roadmap & Learning Objective Checklist',
    },
    {
      num: '02',
      title: 'Stream Structured HD Video Lectures',
      subtitle: 'Unlisted YouTube Masterclasses',
      icon: PlayCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/30',
      desc: 'Access curated, sequential modules hosted via high-definition YouTube unlisted player. Follow along with practical code walkthroughs, design exercises, and real-time screen demonstrations.',
      deliverable: 'Lecture Notes, Cheatsheets & Downloadable PDF Resources',
    },
    {
      num: '03',
      title: 'Build Commercial Projects',
      subtitle: 'Real-World Production Deliverables',
      icon: FileCode,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-400/30',
      desc: 'Put theory into practice by developing tangible projects—from AI agents to full-stack web platforms and client branding kits. Every lesson requires active building rather than passive watching.',
      deliverable: 'GitHub Repositories, Live Deployed URLs & Figma Prototypes',
    },
    {
      num: '04',
      title: 'Pass Evaluated Quizzes & Assignments',
      subtitle: 'Faculty Review & Academic Rigor',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-400/30',
      desc: 'Demonstrate subject mastery through multi-choice assessments and project submissions. Qualified instructors review your assignments, providing actionable recommendations for production readiness.',
      deliverable: 'Scored Quiz Records & Faculty Feedback Reports',
    },
    {
      num: '05',
      title: 'Receive Verifiable Digital Certificate',
      subtitle: 'QR Validated & Globally Recognized',
      icon: Award,
      color: 'text-amber-300',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-300/40',
      desc: 'Upon 100% completion of course requirements, an official digital certificate of completion is issued with a unique serial number and tamper-proof verification page for employers and freelance clients.',
      deliverable: 'High-Resolution PDF Certificate with QR Verification Link',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#040918] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Structured Pedagogy</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Learning Process — Step by Step
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
            Our systematic 5-stage framework takes you from absolute beginner to industry-certified practitioner with commercial freelance readiness.
          </p>
        </div>

        {/* Steps Grid / Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selector List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0d1a38] border-cyan-400/50 shadow-xl shadow-cyan-950/40 translate-x-1'
                      : 'bg-[#060e22] border-white/5 hover:border-white/15 hover:bg-[#091530]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-black font-['Space_Grotesk'] px-2.5 py-1 rounded-lg ${
                        isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.num}
                    </span>
                    <div>
                      <h3
                        className={`text-sm font-bold font-['Space_Grotesk'] ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{step.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-400 rotate-90 sm:rotate-0' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase (7 cols) */}
          <div className="lg:col-span-7">
            {(() => {
              const current = steps[activeStep];
              const Icon = current.icon;
              return (
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#09132c] to-[#050a1b] border-2 border-cyan-500/30 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${current.bgColor} border ${current.borderColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${current.color}`} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Space_Grotesk']">
                          Phase {current.num} of 05
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                          {current.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    {current.desc}
                  </p>

                  {/* Concrete Deliverable Box */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Student Milestone Deliverable:
                    </span>
                    <p className="text-xs text-slate-200 font-medium font-sans">
                      {current.deliverable}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      Step {activeStep + 1} of 5 in your career launch pipeline
                    </div>
                    <button
                      onClick={onStartLearning}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Begin Step 1 Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
