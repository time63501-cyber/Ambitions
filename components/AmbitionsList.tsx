import React, { useState, useMemo } from 'react';
import type { Ambition } from '../types';

interface AmbitionsListProps {
  ambitions: Ambition[];
}

const GridViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75h2.25A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const ListViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const AmbitionsList: React.FC<AmbitionsListProps> = ({ ambitions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const displayedAmbitions = useMemo(() => {
    let filtered = ambitions.filter(ambition =>
      ambition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambition.ambition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'name_az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'age_asc':
        filtered.sort((a, b) => a.age - b.age);
        break;
      case 'age_desc':
        filtered.sort((a, b) => b.age - b.age);
        break;
      case 'target_asc':
        filtered.sort((a, b) => a.targetYear - b.targetYear);
        break;
      case 'target_desc':
        filtered.sort((a, b) => b.targetYear - a.targetYear);
        break;
    }

    return filtered;
  }, [ambitions, searchTerm, sortOption]);

  const renderContent = () => {
    if (displayedAmbitions.length === 0) {
      return (
        <div className="text-center py-20 bg-stone-100 rounded-2xl">
          <h2 className="text-2xl font-semibold text-slate-600">No Ambitions Found</h2>
          <p className="text-slate-500 mt-2">Try adjusting your search or filter.</p>
        </div>
      );
    }
    
    if (viewMode === 'list') {
        return (
            <div className="space-y-4 max-w-4xl mx-auto">
                {displayedAmbitions.map(ambition => (
                     <a
                        key={ambition.id}
                        href={`/?id=${ambition.id}`}
                        className="group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        aria-label={`Read the story of ${ambition.name}`}
                    >
                        <img src={ambition.imageUrl} alt={ambition.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" decoding="async" />
                        <div className="flex-grow">
                             <h3 className="text-xl md:text-2xl font-bold text-slate-800">{ambition.name}</h3>
                             <p className="text-slate-500 mt-1">
                                Dreamt of being a <span className="font-semibold text-slate-600">{ambition.ambition}</span> at age {ambition.age}, aiming for {ambition.targetYear}.
                             </p>
                        </div>
                        <ChevronRightIcon className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors flex-shrink-0" />
                    </a>
                ))}
            </div>
        )
    }

    // Grid view is default
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedAmbitions.map((ambition) => (
            <a
              key={ambition.id}
              href={`/?id=${ambition.id}`}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              aria-label={`Read the story of ${ambition.name}`}
            >
              <div className="relative">
                <img src={ambition.imageUrl} alt={ambition.ambition} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <p className="text-sm text-rose-500 font-semibold">Age {ambition.age}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{ambition.name}</h3>
                <p className="text-slate-500 mt-1">Dreamt of being a <span className="font-semibold text-slate-600">{ambition.ambition}</span></p>
                <p className="text-sm text-slate-400 font-medium mt-2">Target Year: <span className="font-semibold text-slate-500">{ambition.targetYear}</span></p>
                <span className="inline-block mt-4 text-amber-600 font-semibold group-hover:text-amber-500 transition-colors">
                  Read Story &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight">The Ambitions Archive</h2>
        <p className="mt-2 text-lg text-slate-500 max-w-2xl mx-auto">A collection of dreams, big and small, from inspired minds around the globe.</p>
      </header>

      {/* Controls */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            <input
            type="text"
            placeholder="Search by name or ambition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition flex-grow"
            aria-label="Search ambitions"
            />
            <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition bg-white"
            aria-label="Sort ambitions"
            >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_az">Name (A-Z)</option>
            <option value="name_za">Name (Z-A)</option>
            <option value="age_asc">Age (Youngest)</option>
            <option value="age_desc">Age (Oldest)</option>
            <option value="target_asc">Target Year (Soonest)</option>
            <option value="target_desc">Target Year (Latest)</option>
            </select>
        </div>
        <div className="flex justify-center md:justify-end items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">View As:</span>
            <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-white text-slate-500 hover:bg-stone-100 border'}`}
                aria-label="Switch to Grid View"
            >
                <GridViewIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-white text-slate-500 hover:bg-stone-100 border'}`}
                aria-label="Switch to List View"
            >
                <ListViewIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default AmbitionsList;