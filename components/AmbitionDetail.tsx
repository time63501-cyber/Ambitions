import React, { useState } from 'react';
import type { Ambition } from '../types';

interface AmbitionDetailProps {
  ambition: Ambition;
}

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" />
  </svg>
);


const AmbitionDetail: React.FC<AmbitionDetailProps> = ({ ambition }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/?id=${ambition.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <a href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-500 transition-colors font-semibold">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </a>
      </div>

      <article className="max-w-4xl mx-auto pb-16 md:pb-24">
        <header className="px-4">
          <img src={ambition.imageUrl} alt={`Portrait of ${ambition.name}`} className="w-full h-96 object-cover rounded-2xl shadow-2xl" />
        </header>

        <div className="bg-white p-8 md:p-12 lg:p-16 -mt-20 mx-4 md:mx-8 relative rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6 mb-8">
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">{ambition.name}</h1>
              <p className="mt-2 text-xl md:text-2xl text-slate-500">
                At age <span className="font-bold text-rose-500">{ambition.age}</span>, the dream was to become a pioneering <span className="font-bold text-amber-500">{ambition.ambition}</span>.
              </p>
            </div>
            <button 
              onClick={handleShare}
              className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-100 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-stone-200 transition-all duration-200"
              aria-label="Share this ambition story"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{isCopied ? 'Link Copied!' : 'Share Story'}</span>
            </button>
          </div>

          <div className="prose prose-lg max-w-none text-slate-600">
            <p>Every great journey begins with a single, powerful dream. For {ambition.name}, that dream took shape early, painting a future filled with discovery, innovation, and passion. The ambition to be a {ambition.ambition} is not just a career choice; it's a testament to curiosity and the desire to make a mark on the world.</p>
            <p>This vision, born at a young age, serves as a powerful reminder that our dreams are the blueprints for our future achievements. They fuel our determination, guide our choices, and inspire us to reach for the extraordinary.</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AmbitionDetail;