
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import HomeSections from '../components/HomeSections';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MobileLayout from '../components/MobileLayout';
import { useIsMobile } from '../hooks/use-mobile';

const Home = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleExploreActivities = () => {
    navigate('/search');
  };

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero onSearch={handleSearch} onExploreActivities={handleExploreActivities} />
      <HomeSections title="Contenuti in evidenza" contents={[]} />
      <Footer />
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default Home;
