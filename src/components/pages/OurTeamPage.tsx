import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Code, Layout, Cpu, CheckCircle2, Award } from 'lucide-react';
import { TeamMember, Course } from '../../types/index.ts';

interface OurTeamPageProps {
  onSelectCourse?: (course: Course) => void;
  onExploreCourses?: () => void;
}

export const OurTeamPage: React.FC<OurTeamPageProps> = ({
  onExploreCourses,
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Zohaib Ali',
      role: 'Founder & Owner',
      image: 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png',
      bio: 'Founder and CEO of ZA GLOBAL TECH INSTITUTE. Software architect, tech strategist, and educator dedicated to transforming digital education across Pakistan and globally. With over a decade of commercial engineering experience, he leads institute strategy and directly mentors courses in freelancing mastery and artificial intelligence systems.',
      order: 1,
      isVisible: true,
      specialization: 'Institute Leadership, Enterprise Architecture & Freelancing Strategy',
    },
    {
      id: 2,
      name: 'Shehzade Ali',
      role: 'Principal Engineer — Web Development',
      image: 'https://i.ibb.co/Y7PVkCsk/file-0000000022788211a0243870be1c4d08.png',
      bio: 'Principal Engineer specializing in high-throughput modern web architectures, React, Next.js, full-stack microservices, and enterprise production deployments. Shehzade trains students on production codebases, automated pipelines, database scaling, and modern frontend design principles.',
      order: 2,
      isVisible: true,
      specialization: 'Full-Stack Web Engineering, React, Node.js & Cloud Architecture',
    },
    {
      id: 3,
      name: 'Sher Ali',
      role: 'Lead Instructor — UI/UX & Product Design',
      image: 'https://i.ibb.co/PvdjLh15/Whats-App-Image-2026-09-08-at-9-16-57-PM.jpg',
      bio: 'Design lead with extensive experience in UX research, commercial design systems, Figma component architecture, and high-conversion product interfaces. Sher mentors students through real-world client design briefs, usability heuristics, and interactive prototyping.',
      order: 3,
      isVisible: true,
      specialization: 'UI/UX Design Systems, Figma Architecture & Usability Engineering',
    },
    {
      id: 4,
      name: 'Rahmat Ali',
      role: 'Faculty Lead — Artificial Intelligence',
      image: 'https://i.ibb.co/WWbYPHC5/Whats-App-Image-2026-10-30-at-10-15-55-PM.jpg',
      bio: 'AI researcher and practitioner focused on Large Language Models, autonomous agent workflows, LangChain, deep learning pipelines, and prompt engineering. Rahmat guides students through building functional AI agents, retrieval-augmented generation (RAG), and automation systems.',
      order: 4,
      isVisible: true,
      specialization: 'Artificial Intelligence, LLM Orchestration & Autonomous Agentic Workflows',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ZA GLOBAL TECH INSTITUTE FACULTY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Our Professional Team
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Meet the experienced technology architects, senior full-stack engineers, and design leaders responsible for developing our world-class curriculum and mentoring our students.
        </p>
      </div>

      {/* Featured Founder Banner Card */}
      {displayList.slice(0, 1).map((founder) => (
        <div
          key={founder.id}
          className="rounded-3xl bg-gradient-to-br from-[#0d1a38] via-[#091530] to-[#040a1c] border-2 border-cyan-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 rounded-3xl blur-xl opacity-50" />
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-400/60 shadow-2xl">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040a1c] via-transparent to-transparent opacity-60" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-900 border border-cyan-400/50 shadow-xl text-center whitespace-nowrap">
                  <span className="text-xs font-bold text-amber-300 font-['Space_Grotesk']">
                    Founder & Visionary
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Leadership</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
                {founder.name}
              </h2>

              <p className="text-base font-semibold text-cyan-400 font-['Space_Grotesk']">
                {founder.role} — ZA GLOBAL TECH INSTITUTE
              </p>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {founder.bio}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Core Area of Mastery:
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {founder.specialization}
                </p>
              </div>

              {onExploreCourses && (
                <div className="pt-2">
                  <button
                    onClick={onExploreCourses}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Explore Masterclasses Mentored by {founder.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Other 3 Team Profiles */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Engineering & Instructional Leadership
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Subject-matter specialists directing curriculums in web engineering, user experience, and generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.slice(1).map((member) => (
            <div
              key={member.id}
              className="rounded-3xl bg-[#0d1a38] border border-white/10 hover:border-cyan-500/40 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-transparent to-transparent opacity-60" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-['Space_Grotesk'] block">
                    {member.role}
                  </span>

                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    {member.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </div>

              {member.specialization && (
                <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Specialization
                  </span>
                  <p className="text-xs text-slate-200 font-semibold truncate">
                    {member.specialization}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
