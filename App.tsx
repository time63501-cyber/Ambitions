import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AmbitionGallery from './components/AmbitionGallery';
import AmbitionForm from './components/AmbitionForm';
import Footer from './components/Footer';
import AmbitionDetail from './components/AmbitionDetail';
import AmbitionsList from './components/AmbitionsList';
import About from './components/About'; // Import the new component
import { INITIAL_AMBITIONS } from './constants';
import type { Ambition } from './types';

type View = 'gallery' | 'list' | 'detail' | 'about';

const App: React.FC = () => {
  const [ambitions, setAmbitions] = useState<Ambition[]>(() => {
    try {
      const storedAmbitions = window.localStorage.getItem('ambitions');
      return storedAmbitions ? JSON.parse(storedAmbitions) : INITIAL_AMBITIONS;
    } catch (error) {
      console.error("Failed to parse ambitions from localStorage", error);
      return INITIAL_AMBITIONS;
    }
  });
  
  const [view, setView] = useState<View>('gallery');
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('ambitions', JSON.stringify(ambitions));
    } catch (error) {
      console.error("Failed to save ambitions to localStorage", error);
    }
  }, [ambitions]);


  useEffect(() => {
    const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const params = new URLSearchParams(window.location.search);
    const ambitionId = params.get('id');
    const viewParam = params.get('view');

    const defaultTitle = 'Ambitious | Share & Discover Inspiring Dreams';
    const defaultDescription = 'Explore a gallery of dreams and ambitions from people around the world. Get inspired, share your own goals, and see what others aspire to achieve.';
    const defaultUrl = 'https://ambitions.vercel.app.com';
    const defaultImage = 'https://picsum.photos/seed/ambitious-og/1200/630';

    if (ambitionId) {
      const foundAmbition = ambitions.find(a => a.id === parseInt(ambitionId, 10));
      setView('detail');
      setDetailId(foundAmbition ? foundAmbition.id : null);

      if (foundAmbition) {
        const { name, age, ambition, imageUrl } = foundAmbition;
        const title = `${name} - Ambition: ${ambition} | Ambitious`;
        const description = `Discover the story of ${name}, who at age ${age} dreamt of becoming a pioneering ${ambition}. Explore inspiring ambitions from around the world on Ambitious.`;
        const url = `${defaultUrl}/?id=${foundAmbition.id}`;

        document.title = title;
        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:title', title);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:url', url);
        setMetaTag('property', 'og:image', imageUrl);
        setMetaTag('property', 'twitter:title', title);
        setMetaTag('property', 'twitter:description', description);
        setMetaTag('property', 'twitter:image', imageUrl);
      }
    } else if (viewParam === 'list') {
      setView('list');
      setDetailId(null);
      const title = 'All Ambitions | A Collection of Dreams';
      const description = 'Browse a complete collection of ambitions shared by our community. A blog of dreams, from aspiring astronauts to visionary artists.';
      const url = `${defaultUrl}/?view=list`;

      document.title = title;
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'og:url', url);
      setMetaTag('property', 'og:image', defaultImage);
      setMetaTag('property', 'twitter:title', title);
      setMetaTag('property', 'twitter:description', description);
      setMetaTag('property', 'twitter:image', defaultImage);
    } else if (viewParam === 'about') {
      setView('about');
      setDetailId(null);
      const title = 'About | Ambitious';
      const description = 'Learn about our mission. Ambitious is a digital record of dreams, a place to archive the goals of kids and people everywhere for inspiration and reflection.';
      const url = `${defaultUrl}/?view=about`;
      
      document.title = title;
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:title', title);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'og:url', url);
      setMetaTag('property', 'og:image', defaultImage);
      setMetaTag('property', 'twitter:title', title);
      setMetaTag('property', 'twitter:description', description);
      setMetaTag('property', 'twitter:image', defaultImage);
    } else {
      setView('gallery');
      setDetailId(null);

      document.title = defaultTitle;
      setMetaTag('name', 'description', defaultDescription);
      setMetaTag('property', 'og:title', defaultTitle);
      setMetaTag('property', 'og:description', defaultDescription);
      setMetaTag('property', 'og:url', defaultUrl);
      setMetaTag('property', 'og:image', defaultImage);
      setMetaTag('property', 'twitter:title', defaultTitle);
      setMetaTag('property', 'twitter:description', defaultDescription);
      setMetaTag('property', 'twitter:image', defaultImage);
    }
  }, [ambitions]);

  const handleAddAmbition = (newAmbitionData: Omit<Ambition, 'id' | 'imageUrl' | 'createdAt'>) => {
    const newAmbition: Ambition = {
      ...newAmbitionData,
      id: Date.now(),
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      createdAt: Date.now(),
    };
    
    const updatedAmbitions = [...ambitions, newAmbition];
    setAmbitions(updatedAmbitions);

    // Create and download the JSON file
    const jsonData = JSON.stringify(updatedAmbitions, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ambitions_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (view) {
      case 'detail':
        const ambition = ambitions.find(a => a.id === detailId);
        return ambition ? <AmbitionDetail ambition={ambition} /> : <div>Ambition not found.</div>;
      case 'list':
        return <AmbitionsList ambitions={ambitions} />;
      case 'about':
        return <About />;
      case 'gallery':
      default:
        return (
          <div className="container mx-auto px-4 space-y-16 md:space-y-24">
            <AmbitionGallery ambitions={ambitions} />
            <AmbitionForm onAddAmbition={handleAddAmbition} />
          </div>
        );
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-slate-800 antialiased">
      <Header />
      <main>
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
