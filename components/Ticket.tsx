import React, { useRef, useState } from 'react';
import type { Ambition } from '../types';
import { GOOGLE_SHEET_APP_SCRIPT_URL } from '../constants';

declare const htmlToImage: any;

interface TicketProps {
  ambition: Ambition;
  onClose: () => void;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 142 133"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="logo-main-grad-ticket" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="30%" stopColor="#7C3AED" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="75%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
      <linearGradient id="logo-wing-grad-ticket" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
      <filter id="logo-glow-ticket" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" in="SourceGraphic" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M71 0 L91 25 H51 Z"
      fill="#FBBF24"
      opacity="0.7"
      filter="url(#logo-glow-ticket)"
    />
    <path
      d="M71 8 L97 44 H81 V78 H61 V44 H45 Z"
      fill="url(#logo-main-grad-ticket)"
    />
    <path
      d="M71 84 L95 108 L71 132 L47 108 Z"
      fill="url(#logo-main-grad-ticket)"
    />
    <path
      d="M95 45 C 120 40, 140 55, 130 80 C 125 90, 108 72, 95 45 Z"
      fill="url(#logo-wing-grad-ticket)"
    />
  </svg>
);


const Ticket: React.FC<TicketProps> = ({ ambition, onClose }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'>('idle');

  const handleDownload = () => {
    if (ticketRef.current === null) {
      return;
    }

    htmlToImage.toPng(ticketRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // for higher resolution
    })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = `ambitions-ticket-${ambition.name.toLowerCase().replace(/\s/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  const handleAddToArchive = async () => {
    if (!GOOGLE_SHEET_APP_SCRIPT_URL || GOOGLE_SHEET_APP_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      setSubmissionStatus('unconfigured');
      return;
    }

    setSubmissionStatus('submitting');

    const submissionData = { 
      ...ambition,
      status: 'pending'
    };

    try {
      const response = await fetch(GOOGLE_SHEET_APP_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.result === 'success') {
        setSubmissionStatus('success');
      } else {
        throw new Error(result.error || 'The script returned an unsuccessful status.');
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionStatus('error');
    }
  };


  const formattedDate = new Date(ambition.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="max-w-md w-full">
        {/* The Ticket Itself */}
        <div ref={ticketRef} className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl flex">
          {/* Main content */}
          <div className="p-8 text-white w-full">
            <header className="text-center border-b-2 border-dashed border-slate-600 pb-4 mb-6">
              <Logo className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500 tracking-tight">Ambitions</h2>
              <p className="text-slate-400 text-sm tracking-widest uppercase">Official Record of Ambition</p>
            </header>
            <div className="space-y-5 text-center">
              <div>
                <p className="text-slate-400 text-xs">NAME</p>
                <p className="text-2xl font-bold">{ambition.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">DREAM</p>
                <p className="text-4xl font-bold text-amber-300 leading-tight">{ambition.ambition}</p>
              </div>
              <div className="flex justify-around items-center pt-2">
                <div>
                  <p className="text-slate-400 text-xs">AT AGE</p>
                  <p className="text-2xl font-bold">{ambition.age}</p>
                </div>
                <div className="h-10 w-px bg-slate-600"></div>
                <div>
                  <p className="text-slate-400 text-xs">TARGET</p>
                  <p className="text-2xl font-bold">{ambition.targetYear}</p>
                </div>
              </div>
            </div>
            <footer className="mt-8 pt-4 border-t-2 border-dashed border-slate-600 flex justify-between items-center text-slate-500 text-xs">
              <span>ID: {ambition.id}</span>
              <span>{formattedDate}</span>
            </footer>
          </div>
          {/* Perforated edge */}
          <div className="w-8 bg-slate-800 flex-shrink-0 relative" style={{background: 'radial-gradient(circle at 0 10px, transparent 0, transparent 5px, #1e293b 5px) repeat-y'}}>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg"
          >
            <DownloadIcon className="w-5 h-5" />
            Download Ticket
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 text-white font-semibold py-3 px-5 rounded-lg hover:bg-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
            Close
          </button>
        </div>

        {/* Public Submission */}
        <div className="mt-8 text-center bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
          {submissionStatus === 'idle' && (
            <>
              <h3 className="font-bold text-white text-lg">Make it Permanent!</h3>
              <p className="text-slate-300 text-sm mt-2">
                Add your dream to the permanent public archive for the world to see.
              </p>
              <button
                onClick={handleAddToArchive}
                className="mt-4 inline-block w-full bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-white transition-colors transform hover:scale-105"
              >
                Add to Public Archive
              </button>
            </>
          )}

          {submissionStatus === 'submitting' && (
            <div className="flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-400"></div>
                <p className="mt-4 font-semibold">Submitting to the archive...</p>
            </div>
          )}

          {submissionStatus === 'success' && (
            <div className="flex flex-col items-center justify-center text-green-400">
                <CheckCircleIcon className="w-12 h-12"/>
                <h3 className="font-bold text-white text-lg mt-2">Success!</h3>
                <p className="text-slate-300 text-sm mt-1">
                    Your ambition has been submitted for review.
                </p>
            </div>
          )}

          {submissionStatus === 'unconfigured' && (
            <div className="flex flex-col items-center justify-center text-amber-400">
                <ExclamationTriangleIcon className="w-12 h-12"/>
                <h3 className="font-bold text-white text-lg mt-2">Configuration Needed</h3>
                <p className="text-slate-300 text-sm mt-1">
                    This feature is not yet configured. The Google Apps Script URL is missing.
                </p>
                 <button
                    onClick={() => setSubmissionStatus('idle')}
                    className="mt-4 text-sm font-semibold text-slate-300 hover:text-white underline"
                >
                    Try Again
                </button>
            </div>
          )}

          {submissionStatus === 'error' && (
             <div className="flex flex-col items-center justify-center text-amber-400">
                <ExclamationTriangleIcon className="w-12 h-12"/>
                <h3 className="font-bold text-white text-lg mt-2">Submission Failed</h3>
                <p className="text-slate-300 text-sm mt-1">
                    Could not connect to the archive. Please try again later.
                </p>
                 <button
                    onClick={() => setSubmissionStatus('idle')}
                    className="mt-4 text-sm font-semibold text-slate-300 hover:text-white underline"
                >
                    Try Again
                </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Ticket;
