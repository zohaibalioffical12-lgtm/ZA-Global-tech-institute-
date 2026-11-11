import React from 'react';
import { ExternalLink, Github, Code, Sparkles, Award } from 'lucide-react';

export const StudentProjectsSection: React.FC = () => {
  const projects = [
    {
      title: 'AI Multi-Agent Workflow Engine',
      category: 'Artificial Intelligence',
      author: 'Usman Ghani (Student Batch 2)',
      description: 'An autonomous agent framework that automates document summarization, sentiment extraction, and automatic Jira ticket creation using Python and modern LLMs.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=700&q=80',
      tags: ['Python', 'LangChain', 'FastAPI', 'Gemini'],
      liveUrl: '#',
    },
    {
      title: 'PakShop — Modern Full-Stack E-Commerce',
      category: 'Web Development',
      author: 'Fatima Zahra (Student Batch 3)',
      description: 'A full-stack e-commerce marketplace with custom shopping cart, EasyPaisa / JazzCash payment checkout, and PostgreSQL order management system.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=700&q=80',
      tags: ['React 19', 'TypeScript', 'Tailwind', 'PostgreSQL'],
      liveUrl: '#',
    },
    {
      title: 'AuraPay — Fintech Mobile App UI/UX',
      category: 'UI/UX Design',
      author: 'Bilal Hassan (Student Batch 1)',
      description: 'A 45-screen high-fidelity Figma prototype and complete design system with auto-layout, interactive micro-animations, and accessible color tokens.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
      tags: ['Figma', 'Design System', 'Prototyping', 'UX Research'],
      liveUrl: '#',
    },
    {
      title: 'Client Proposal Intelligence Automator',
      category: 'Prompt Engineering',
      author: 'Ali Raza (Student Batch 4)',
      description: 'A prompt engineering system that digests client job postings on Upwork, generates tailored proposals, and optimizes portfolio matches.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
      tags: ['Prompt Engineering', 'Automation', 'Upwork API', 'JSON-Schema'],
      liveUrl: '#',
    },
  ];

  return (
    <section className="py-20 bg-[#070d1e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Student Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Built by Our Students. Proven in Production.
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Real software, systems, and creative prototypes constructed by students during their course assignments at ZA Global Tech Institute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0f1c3d] border border-white/10 hover:border-amber-400/30 overflow-hidden flex flex-col justify-between group shadow-xl transition-all"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/20">
                  {proj.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400">
                    Creator: <span className="text-white font-bold">{proj.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-['Space_Grotesk']">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {proj.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
