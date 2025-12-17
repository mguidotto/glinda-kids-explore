import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Search = lazy(() => import('./pages/Search'));
const ContentDetail = lazy(() => import('./pages/ContentDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Auth = lazy(() => import('./pages/Auth'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SitemapXml = lazy(() => import('./pages/SitemapXml'));
const SitemapDebug = lazy(() => import('./pages/SitemapDebug'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(Index),
      },
      {
        path: 'search',
        element: withSuspense(Search),
      },
      {
        path: 'about',
        element: withSuspense(About),
      },
      {
        path: 'contact',
        element: withSuspense(Contact),
      },
      {
        path: 'privacy',
        element: withSuspense(Privacy),
      },
      {
        path: 'auth',
        element: withSuspense(Auth),
      },
      {
        path: 'dashboard',
        element: withSuspense(UserDashboard),
      },
      {
        path: 'provider',
        element: withSuspense(ProviderDashboard),
      },
      {
        path: 'admin',
        element: withSuspense(AdminDashboard),
      },
      {
        path: 'sitemap.xml',
        element: withSuspense(SitemapXml),
      },
      {
        path: 'sitemap-debug',
        element: withSuspense(SitemapDebug),
      },
      {
        path: 'content/:slugOrId',
        element: withSuspense(ContentDetail),
      },
      {
        path: ':categorySlug/:contentSlug',
        element: withSuspense(ContentDetail),
      },
      {
        path: ':slug',
        element: withSuspense(CategoryPage),
      },
      {
        path: '404',
        element: withSuspense(NotFound),
      },
      {
        path: '*',
        element: withSuspense(NotFound),
      },
    ],
  },
];

export default routes;
