import React, { useState, useMemo } from 'react';
import { Course, CourseCategory } from '../../types/index.ts';
import { CourseCard } from './CourseCard.tsx';
import { Search, X, Sparkles, BookOpen, SlidersHorizontal, Tag } from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  categories: CourseCategory[];
  onSelectCourse: (course: Course) => void;
  enrolledCourseIds?: number[];
  initialFilter?: 'all' | 'free' | 'paid';
  initialCategory?: number | 'all';
}

const POPULAR_KEYWORDS = [
  'Artificial Intelligence',
  'Prompt Engineering',
  'Web Development',
  'Python',
  'UI/UX',
  'WordPress',
  'Cybersecurity',
  'AI Automation',
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  categories,
  onSelectCourse,
  enrolledCourseIds = [],
  initialFilter = 'all',
  initialCategory = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'paid'>(initialFilter);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');

  // Real-time filtering by title and description keywords
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        // Free / Paid filter
        if (typeFilter === 'free' && !c.isFree) return false;
        if (typeFilter === 'paid' && c.isFree) return false;

        // Category filter
        if (selectedCategory !== 'all' && c.categoryId !== selectedCategory) return false;

        // Difficulty filter
        if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;

        // Real-Time Search filter across title and description
        if (searchTerm.trim()) {
          const rawTokens = searchTerm
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

          const matchesAllTokens = rawTokens.every((token) => {
            const inTitle = (c.title || '').toLowerCase().includes(token);
            const inDesc = (c.description || '').toLowerCase().includes(token);
            const inCat = (c.categoryName || '').toLowerCase().includes(token);
            const inDiff = (c.difficulty || '').toLowerCase().includes(token);
            return inTitle || inDesc || inCat || inDiff;
          });

          if (!matchesAllTokens) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
        return (b.id || 0) - (a.id || 0);
      });
  }, [courses, typeFilter, selectedCategory, selectedDifficulty, searchTerm, sortBy]);

  const handleKeywordClick = (kw: string) => {
    if (searchTerm.toLowerCase() === kw.toLowerCase()) {
      setSearchTerm('');
    } else {
      setSearchTerm(kw);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleResetAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Explore All Technology Courses
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          From free beginner learning tracks to professional paid masterclasses. Discover our curriculum organized across 17 high-growth technology domains.
        </p>
      </div>

      {/* Primary Real-Time Search & Filtering Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#0f1c3d] border border-white/10 space-y-5 shadow-2xl">
        {/* Row 1: Real-Time Keyword Search Bar */}
        <div className="space-y-2">
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none flex items-center text-slate-400">
              <Search
                className={`w-5 h-5 transition-colors duration-200 ${
                  searchTerm.trim() ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by title, description, or keyword (e.g. 'Python', 'AI Automation', 'Frontend')..."
              className="w-full pl-12 pr-32 py-3.5 text-sm bg-slate-900/95 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              aria-label="Real-time course search input"
            />

            {/* Right side controls: live result count & instant clear button */}
            <div className="absolute right-3.5 flex items-center gap-2">
              {searchTerm.trim() && (
                <>
                  <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'match' : 'matches'}
                  </span>
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Clear search query"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick-Filter Keyword Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Popular searches:</span>
            </span>
            {POPULAR_KEYWORDS.map((kw) => {
              const isActive = searchTerm.toLowerCase() === kw.toLowerCase();
              return (
                <button
                  key={kw}
                  onClick={() => handleKeywordClick(kw)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium text-[11px] flex items-center gap-1 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{kw}</span>
                  {isActive && <X className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Course Tier Model Tabs (All / Free / Paid) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                typeFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setTypeFilter('free')}
              className={`px-4 py-2 rounded-lg transition-all ${
                typeFilter === 'free'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Free (PKR 0)
            </button>
            <button
              onClick={() => setTypeFilter('paid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                typeFilter === 'paid'
                  ? 'bg-blue-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paid Certified
            </button>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Row 3: 17 Category Chips */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Space_Grotesk']">
              Filter by Domain ({categories.length} categories)
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-[11px] text-amber-400 hover:underline font-bold"
              >
                Clear Domain Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-semibold ${
                selectedCategory === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Domains
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-semibold ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Difficulty Level Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Difficulty:</span>
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedDifficulty === lvl
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="text-white font-bold">{filteredCourses.length}</span> of {courses.length} courses
          </div>
        </div>
      </div>

      {/* Active Search Results Banner */}
      {searchTerm.trim() && (
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-300">
                Real-time keyword filter: <span className="text-white font-bold">"{searchTerm}"</span>
              </p>
              <p className="text-[11px] text-cyan-300 font-medium">
                Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} matching title or description
              </p>
            </div>
          </div>

          <button
            onClick={handleClearSearch}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onSelect={onSelectCourse}
              isEnrolled={enrolledCourseIds.includes(c.id)}
              searchQuery={searchTerm}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-white/5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-7 h-7 text-slate-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {searchTerm.trim() ? `No courses found matching "${searchTerm}"` : 'No courses match your filter'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {searchTerm.trim()
                ? 'We searched across all course titles and descriptions. Try searching with a broader keyword (e.g. "AI", "Web", "Design", or "Python").'
                : 'Try adjusting your domain category or difficulty level to see more courses.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {searchTerm.trim() && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all"
              >
                Clear Search Keyword
              </button>
            )}
            <button
              onClick={handleResetAllFilters}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-white/10 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
