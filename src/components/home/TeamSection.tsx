import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Code, Layout, Cpu } from 'lucide-react';
import { TeamMember } from '../../types/index.ts';

interface TeamSectionProps {
  onViewTeamPage?: () => void;
  onExploreCourses?: () => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  onViewTeamPage,
  onExploreCourses,
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback default team with exact photos from prompt
  const fallbackMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Zohaib Ali',
      role: 'Founder & Owner',
      image: 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png',
      bio: 'Founder & CEO of ZA Global Tech Institute. Software architect, tech strategist, and educator dedicated to transforming digital education across Pakistan and globally.',
      order: 1,
      isVisible: true,
      specialization: 'Institute Leadership & Technology Architecture',
    },
    {
      id: 2,
      name: 'Shehzade Ali',
      role: 'Principal Engineer — Web Development',
      image: 'https://i.ibb.co/Y7PVkCsk/file-0000000022788211a0243870be1c4d08.png',
      bio: 'Principal Engineer specializing in high-throughput modern web architectures, React, Next.js, full-stack microservices, and enterprise production deployments.',
      order: 2,
      isVisible: true,
      specialization: 'Full-Stack Web Engineering & Cloud Systems',
    },
    {
      id: 3,
      name: 'Sher Ali',
      role: 'Lead Instructor — UI/UX & Product Design',
      image: 'https://i.ibb.co/PvdjLh15/Whats-App-Image-2026-09-08-at-9-16-57-PM.jpg',
      bio: 'Design lead with extensive experience in UX research, commercial design systems, Figma component architecture, and high-conversion product interfaces.',
      order: 3,
      isVisible: true,
      specialization: 'UI/UX Design Systems & Product Strategy',
    },
    {
      id: 4,
      name: 'Rahmat Ali',
      role: 'Faculty Lead — Artificial Intelligence',
      image: 'https://i.ibb.co/WWbYPHC5/Whats-App-Image-2026-10-30-at-10-15-55-PM.jpg',
      bio: 'AI researcher and practitioner focused on Large Language Models, autonomous agent workflows, LangChain, deep learning pipelines, and prompt engineering.',
      order: 4,
      isVisible: true,
      specialization: 'Artificial Intelligence & Autonomous Agentic Systems',
    },
  ];

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
        } else {
          setMembers(fallbackMembers);
        }
      })
      .catch(() => setMembers(fallbackMembers))
      .finally(() => setLoading(false));
  }, []);

  const displayList = members.length > 0 ? members : fallbackMembers;

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('founder') || role.toLowerCase().includes('owner')) {
      return <ShieldCheck className="w-4 h-4 text-amber-400" />;
    }
    if (role.toLowerCase().includes('web') || role.toLowerCase().includes('engineer')) {
      return <Code className="w-4 h-4 text-cyan-400" />;
    }
    if (role.toLowerCase().includes('ui') || role.toLowerCase().includes('design')) {
      return <Layout className="w-4 h-4 text-teal-400" />;
    }
    return <Cpu className="w-4 h-4 text-blue-400" />;
  };

  return (
    <section className="py-20 lg:py-28 bg-[#040918] relative overflow-hidden border-t border-white/5">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Institute Leadership & Faculty</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Our Professional Team
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Learn directly from experienced technology leaders, senior engineers, and industry design practitioners at ZA GLOBAL TECH INSTITUTE.
            </p>
          </div>

          {onViewTeamPage && (
            <button
              onClick={onViewTeamPage}
              className="self-start md:self-end px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-2 group shadow-lg"
            >
              <span>View Full Team Page</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* 4 Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((member) => (
            <div
              key={member.id}
              className="group rounded-3xl bg-gradient-to-b from-[#0d1a38]/90 via-[#0a1530]/90 to-[#060e22]/95 border border-white/10 hover:border-cyan-500/40 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Image Frame */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group-hover:border-cyan-400/50 transition-colors shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-transparent to-transparent opacity-60" />

                  {/* Badge */}
                  {member.role.toLowerCase().includes('founder') && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      Founder & Owner
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {getRoleIcon(member.role)}
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-['Space_Grotesk'] line-clamp-1">
                      {member.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Specialization Footer */}
              {member.specialization && (
                <div className="pt-4 mt-4 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Core Specialization
                  </span>
                  <span className="text-[11px] text-slate-200 font-semibold mt-0.5 block truncate">
                    {member.specialization}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
