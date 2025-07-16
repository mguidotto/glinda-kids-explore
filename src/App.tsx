import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import About from './pages/About';
import Contact from './pages/Contact';
import ContentDetail from './pages/ContentDetail';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import CategoryPage from './pages/CategoryPage';
import ComingSoon from './pages/ComingSoon';
import Sitemap from "./pages/Sitemap";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        
        {/* Category and Content Detail with Slugs */}
        <Route path="/:categorySlug/:contentSlug" element={<ContentDetail />} />

        {/* Coming Soon Page */}
        <Route path="/coming-soon" element={<ComingSoon />} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/sitemap.xml" element={<Sitemap />} />
      </Routes>
    </Router>
  );
}

export default App;
