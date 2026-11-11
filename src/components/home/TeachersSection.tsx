import React from 'react';
import { Award, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export const TeachersSection: React.FC = () => {
  const faculty = [
    {
      name: 'Zohaib Ali',
      role: 'Founder & Owner',
      specialty: 'Technology Architecture & Global Freelancing',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Visionary technology educator and founder of ZA Global Tech Institute. Direct mentor on winning international client retainers and building sustainable tech businesses.',
      badge: 'Founder & Owner',
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
    },
    {
      name: 'Dr. Ahmed Khan',
      role: 'Faculty Lead — Artificial Intelligence',
      specialty: 'Deep Learning, LLMs & AI Automations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'PhD in Computational Intelligence. Specialist in Transformer architectures, fine-tuning large language models, and agentic workflows.',
      badge: 'Senior Faculty',
      badgeColor: 'bg-blue-600/30 text-blue-300 font-bold',
    },
    {
      name: 'Sara Fatima',
      role: 'Lead Instructor — UI/UX & Product Design',
      specialty: 'Figma Systems, Design Thinking & Prototyping',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Over 8 years crafting user experiences for international fintech and SaaS products. Leads hands-on Figma workshops and portfolio reviews.',
      badge: 'Design Lead',
      badgeColor: 'bg-purple-600/30 text-purple-300 font-bold',
    },
    {
      name: 'Hamza Tariq',
      role: 'Principal Engineer — Web Development',
      specialty: 'React 19, Node.js, Express & PostgreSQL',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: 'Full-stack cloud architect specializing in modern TypeScript, reactive frontend engineering, REST APIs, and database performance tuning.',
      badge: 'Engineering Lead',
      badgeColor: 'bg-emerald-600/30 text-emerald-300 font-bold',
    },
  ];

  return (
    <section className="py-20 bg-[#0b152d]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Distinguished Faculty</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Learn From Industry Leaders & Technologists
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Our courses are designed and taught by passionate software architects, design leads, and our founder Zohaib Ali.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faculty.map((teacher, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#0f1c3d] border border-white/10 hover:border-amber-400/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1 shadow-xl"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3d] via-transparent to-transparent opacity-80" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider ${teacher.badgeColor}`}>
                  {teacher.badge}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-['Space_Grotesk']">
                    {teacher.name}
                  </h3>
                  <div className="text-xs font-medium text-amber-400">
                    {teacher.role}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {teacher.specialty}
                  </div>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
