import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import type { Ambition } from './types';
import { storyTemplates } from './storyTemplates';

// Lazy load components that are not needed for the initial render or are view-dependent.
const AmbitionGallery = lazy(() => import('./components/AmbitionGallery'));
const AmbitionForm = lazy(() => import('./components/AmbitionForm'));
const AmbitionDetail = lazy(() => import('./components/AmbitionDetail'));
const AmbitionsList = lazy(() => import('./components/AmbitionsList'));
const About = lazy(() => import('./components/About'));
const Ticket = lazy(() => import('./components/Ticket'));

type View = 'gallery' | 'list' | 'detail' | 'about';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-40">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-500"></div>
  </div>
);

const App: React.FC = () => {
  const [ambitions, setAmbitions] = useState<Ambition[]>([]);
  const [ticketData, setTicketData] = useState<Ambition | null>(null);
  
  const [view, setView] = useState<View>('gallery');
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    const loadAmbitions = async () => {
      try {
        const storedAmbitions = window.localStorage.getItem('ambitions');
        if (storedAmbitions && storedAmbitions !== '[]') {
          setAmbitions(JSON.parse(storedAmbitions));
        } else {
          const response = await fetch('/data.json');
           if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const initialAmbitions = await response.json();
          setAmbitions(initialAmbitions);
        }
      } catch (error) {
        console.error("Failed to load ambitions:", error);
        setAmbitions([]); // Fallback to empty array on error
      }
    };
    loadAmbitions();
  }, []);

  useEffect(() => {
    if (ambitions.length > 0) {
      try {
        window.localStorage.setItem('ambitions', JSON.stringify(ambitions));
      } catch (error) {
        console.error("Failed to save ambitions to localStorage", error);
      }
    }
  }, [ambitions]);


  useEffect(() => {
    if (ambitions.length === 0) return;

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
  }, [ambitions, view]);

  const handleAddAmbition = (newAmbitionData: Omit<Ambition, 'id' | 'createdAt'>) => {
    let story = newAmbitionData.story;

    // If no story is provided, pick a template
    if (!story || story.trim() === '') {
        const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
        story = template
            .replace(/{{name}}/g, newAmbitionData.name)
            .replace(/{{age}}/g, String(newAmbitionData.age))
            .replace(/{{ambition}}/g, newAmbitionData.ambition);
    }
      
    const newAmbition: Ambition = {
      ...newAmbitionData,
      story, // Use the (potentially generated) story
      id: Date.now(),
      imageUrl: newAmbitionData.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
      createdAt: Date.now(),
    };
    
    const updatedAmbitions = [...ambitions, newAmbition];
    setAmbitions(updatedAmbitions);
    setTicketData(newAmbition); // Set the new ambition data to show the ticket
  };
  
  const handleCloseTicket = () => {
    setTicketData(null);
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
        <Suspense fallback={<LoadingSpinner />}>
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        {ticketData && <Ticket ambition={ticketData} onClose={handleCloseTicket} />}
      </Suspense>
    </div>
  );
};

export default App;