import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <a href="/" aria-label="Back to homepage">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500 tracking-tight hover:opacity-80 transition-opacity">
            Ambitious
          </h1>
        </a>
        <p className="text-center text-slate-500 mt-2 text-lg">
          Showcase your dreams. Inspire the world.
        </p>

        <nav className="mt-8">
          <ul className="flex justify-center items-center gap-6 md:gap-8 border-t border-b border-slate-200 py-3">
            <li>
              <a href="/?view=list" className="text-slate-600 font-medium hover:text-rose-500 transition-colors pb-1 border-b-2 border-transparent hover:border-rose-500">
                Ambitions
              </a>
            </li>
             <li>
              <a href="/?view=about" className="text-slate-600 font-medium hover:text-rose-500 transition-colors pb-1 border-b-2 border-transparent hover:border-rose-500">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;