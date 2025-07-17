
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import HomeSections from '../components/HomeSections';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MobileLayout from '../components/MobileLayout';
import { useMobile } from '../hooks/use-mobile';

const Home = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <HomeSections />
      <Footer />
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default Home;
