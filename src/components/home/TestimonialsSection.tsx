import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fallback reviews if database is freshly initialized
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      studentName: 'Ali Raza',
      studentPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      courseTitle: 'Prompt Engineering & Generative AI for Professionals',
      rating: 5,
      reviewText: 'Completed this course in 2 weeks. The system prompt templates helped me automate tasks immediately for my international clients on Upwork.',
    },
    {
      id: 2,
      studentName: 'Hamza Malik',
      studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      courseTitle: 'Artificial Intelligence & Modern LLMs Masterclass',
      rating: 5,
      reviewText: 'The clarity of explanations on transformer models and neural networks is world class. Best tech institute in Pakistan!',
    },
    {
      id: 3,
      studentName: 'Khadija Bibi',
      studentPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      courseTitle: 'Mastering UI/UX Design & Figma Systems',
      rating: 5,
      reviewText: 'The auto-layout and design token modules are so detailed. I landed my first junior UI designer job right after completing the final assessment.',
    },
  ];

  return (
    <section className="py-20 bg-[#0b152d]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Student Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Trusted by Ambitious Learners
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Read authentic reviews from students who completed courses and received official certificates from ZA Global Tech Institute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((rev, i) => (
            <div
              key={rev.id || i}
              className="p-6 rounded-2xl bg-[#0f1c3d] border border-white/10 flex flex-col justify-between space-y-4 shadow-xl relative"
            >
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />

              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.reviewText}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                <img
                  src={rev.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.studentName}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/30"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{rev.studentName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-medium line-clamp-1">
                    {rev.courseTitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
