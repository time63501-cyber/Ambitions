import React, { useState, useMemo } from 'react';
import type { Ambition } from '../types';

interface AmbitionsListProps {
  ambitions: Ambition[];
}

const AmbitionsList: React.FC<AmbitionsListProps> = ({ ambitions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');

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
        filtered.sort((a, b) => b.age - a.age);
        break;
    }

    return filtered;
  }, [ambitions, searchTerm, sortOption]);

  return (
    <div className="container mx-auto px-4">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight">The Ambitions Archive</h2>
        <p className="mt-2 text-lg text-slate-500 max-w-2xl mx-auto">A collection of dreams, big and small, from inspired minds around the globe.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
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
        </select>
      </div>

      {displayedAmbitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedAmbitions.map((ambition) => (
            <a
              key={ambition.id}
              href={`/?id=${ambition.id}`}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              aria-label={`Read the story of ${ambition.name}`}
            >
              <div className="relative">
                <img src={ambition.imageUrl} alt={ambition.ambition} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <p className="text-sm text-rose-500 font-semibold">Age {ambition.age}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{ambition.name}</h3>
                <p className="text-slate-500 mt-1">Dreamt of being a <span className="font-semibold text-slate-600">{ambition.ambition}</span></p>
                <span className="inline-block mt-4 text-amber-600 font-semibold group-hover:text-amber-500 transition-colors">
                  Read Story &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-100 rounded-2xl">
          <h2 className="text-2xl font-semibold text-slate-600">No Ambitions Found</h2>
          <p className="text-slate-500 mt-2">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default AmbitionsList;
