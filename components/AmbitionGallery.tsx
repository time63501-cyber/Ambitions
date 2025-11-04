import React, { useState, useEffect, useCallback } from 'react';
import type { Ambition } from '../types';

interface AmbitionGalleryProps {
  ambitions: Ambition[];
}

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const AmbitionGallery: React.FC<AmbitionGalleryProps> = ({ ambitions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === ambitions.length - 1 ? 0 : prevIndex + 1));
  }, [ambitions.length]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? ambitions.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  useEffect(() => {
    if (ambitions.length === 0) return;
    const timer = setTimeout(goToNext, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, ambitions.length, goToNext]);

  if (ambitions.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-100 rounded-2xl">
        <h2 className="text-2xl font-semibold text-slate-600">No ambitions yet.</h2>
        <p className="text-slate-500 mt-2">Be the first one to add yours!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto shadow-2xl rounded-2xl">
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden rounded-2xl">
        <div 
            className="flex transition-transform ease-in-out duration-700 h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {ambitions.map((ambition) => (
            <a 
              href={`/?id=${ambition.id}`}
              key={ambition.id} 
              className="relative block w-full flex-shrink-0 h-full group"
              aria-label={`View ambition story for ${ambition.name}`}
            >
              <img src={ambition.imageUrl} alt={ambition.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                <h3 className="text-3xl md:text-4xl font-bold">{ambition.name}</h3>
                <p className="text-lg md:text-xl mt-1">
                  Dreamt of being a <span className="font-semibold text-amber-300">{ambition.ambition}</span> at age {ambition.age}
                </p>
                 <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block bg-white text-slate-800 font-semibold py-2 px-4 rounded-lg text-sm">View Story →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <button onClick={goToPrevious} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10">
        <ChevronLeftIcon className="h-6 w-6 text-slate-800" />
      </button>
      <button onClick={goToNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white z-10">
        <ChevronRightIcon className="h-6 w-6 text-slate-800" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {ambitions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-4 bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AmbitionGallery;