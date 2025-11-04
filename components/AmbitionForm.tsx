import React, { useState } from 'react';
import type { Ambition } from '../types';

interface AmbitionFormProps {
  // FIX: Updated the Omit type to also exclude 'createdAt', as this is generated in the parent App component.
  onAddAmbition: (ambition: Omit<Ambition, 'id' | 'imageUrl' | 'createdAt'>) => void;
}

const AmbitionForm: React.FC<AmbitionFormProps> = ({ onAddAmbition }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [ambition, setAmbition] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !ambition) {
      setError('Please fill out all fields.');
      return;
    }
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
        setError('Please enter a valid age.');
        return;
    }

    onAddAmbition({ name, age: ageNumber, ambition });

    // Reset form
    setName('');
    setAge('');
    setAmbition('');
    setError('');
  };

  return (
    <section id="add-ambition" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Get Your Ambition Listed Too</h2>
        <p className="text-center text-slate-500 mb-8">Share your dream with the world.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"/>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Age of Ambition</label>
              <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 10" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"/>
            </div>
          </div>
          <div>
            <label htmlFor="ambition" className="block text-sm font-medium text-slate-700 mb-1">Your Ambition</label>
            <input type="text" id="ambition" value={ambition} onChange={(e) => setAmbition(e.target.value)} placeholder="e.g., Astronaut" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"/>
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