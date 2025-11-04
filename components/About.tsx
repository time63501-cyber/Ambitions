import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center">
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Our Mission</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-amber-500 mx-auto my-6 rounded-full"></div>
        <div className="prose prose-lg max-w-none text-slate-600 text-left md:text-center">
          <p>
            The purpose of <strong>Ambitions</strong> is to create a beautiful digital record of dreams. 
            We believe every ambition, big or small, holds a powerful story of hope, creativity, and human potential.
          </p>
          <p>
            This website serves as a timeless archive for kids and people from all walks of life to list their goals. 
            By sharing these aspirations, we aim to build a global tapestry of inspiration that can be revisited for years to come—a reminder that the future is built on the dreams of today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;