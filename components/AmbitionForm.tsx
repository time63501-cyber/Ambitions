import React, { useState } from 'react';
import type { Ambition } from '../types';

interface AmbitionFormProps {
  onAddAmbition: (ambition: Omit<Ambition, 'id' | 'createdAt'>) => void;
}

const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const AmbitionForm: React.FC<AmbitionFormProps> = ({ onAddAmbition }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ambition, setAmbition] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [story, setStory] = useState('');
  const [instagram, setInstagram] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !ambition || !targetYear) {
      setError('Please fill out all required fields.');
      return;
    }
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
        setError('Please enter a valid age.');
        return;
    }
    
    const currentYear = new Date().getFullYear();
    const targetYearNumber = parseInt(targetYear, 10);
    if (isNaN(targetYearNumber) || targetYearNumber <= currentYear) {
        setError(`Please enter a valid target year after ${currentYear}.`);
        return;
    }

    const newAmbitionData: Omit<Ambition, 'id' | 'createdAt'> = {
        name,
        age: ageNumber,
        ambition,
        story,
        imageUrl: imagePreview || '',
        targetYear: targetYearNumber,
    };

    if (instagram) {
        newAmbitionData.instagram = instagram.replace('@','');
    }

    onAddAmbition(newAmbitionData);

    // Reset form
    setName('');
    setAge('');
    setAmbition('');
    setTargetYear('');
    setStory('');
    setInstagram('');
    setImagePreview(null);
    setError('');
  };

  const requiredInputStyle = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-rose-500 transition";

  return (
    <section id="add-ambition" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Get Your Ambition Listed Too</h2>
        <p className="text-center text-slate-500 mb-8">
          Share your dream with the world. After submitting, you'll get a beautiful, downloadable ticket as a memento.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Picture (Optional)</label>
                <div className="mt-2 flex items-center gap-4">
                    <span className="h-20 w-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <PhotoIcon className="h-10 w-10 text-slate-400" />
                    )}
                    </span>
                    <label htmlFor="file-upload" className="cursor-pointer rounded-lg bg-white py-2 px-3 border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
                    </label>
                </div>
            </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" className={requiredInputStyle} required/>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Current Age</label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 10" className={requiredInputStyle} required/>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="ambition" className="block text-sm font-medium text-slate-700 mb-1">Your Ambition</label>
                <input type="text" id="ambition" value={ambition} onChange={(e) => setAmbition(e.target.value)} placeholder="e.g., Astronaut" className={requiredInputStyle} required/>
            </div>
            <div>
                <label htmlFor="targetYear" className="block text-sm font-medium text-slate-700 mb-1">Target Year</label>
                <input type="number" id="targetYear" value={targetYear} onChange={(e) => setTargetYear(e.target.value)} placeholder={`e.g., ${new Date().getFullYear() + 5}`} className={requiredInputStyle} required/>
            </div>
          </div>
           <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-slate-700 mb-1">Instagram Handle (Optional)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-500 sm:text-sm">@</span>
              </div>
              <input type="text" id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="your_username" className="w-full px-4 py-2 pl-7 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"/>
            </div>
          </div>
          <div>
            <label htmlFor="story" className="block text-sm font-medium text-slate-700 mb-1">Your Story (Optional)</label>
            <textarea id="story" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Tell us more about your dream..." rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"></textarea>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 shadow-lg">
            Share My Ambition
          </button>
        </form>
      </div>
    </section>
  );
};

export default AmbitionForm;