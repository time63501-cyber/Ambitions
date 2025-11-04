
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12 mt-16 md:mt-24">
      <div className="container mx-auto px-4 text-center">
        <p className="font-light italic text-lg text-slate-400">"The future belongs to those who believe in the beauty of their dreams."</p>
        <p className="text-sm mt-6 text-slate-500">&copy; {new Date().getFullYear()} Ambitions. Created with inspiration.</p>
      </div>
    </footer>
  );
};

export default Footer;