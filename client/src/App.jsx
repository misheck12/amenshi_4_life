import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { LoadingPage } from './components/common/Spinner';
import { useAuth } from './context/AuthContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Ministries = lazy(() => import('./pages/Ministries'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectManager = lazy(() => import('./pages/admin/ProjectManager'));
const TeamManager = lazy(() => import('./pages/admin/TeamManager'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Statistics = lazy(() => import('./pages/admin/Statistics'));
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager'));
const ServiceManager = lazy(() => import('./pages/admin/ServiceManager'));
const MinistryManager = lazy(() => import('./pages/admin/MinistryManager'));
const HomeContentManager = lazy(() => import('./pages/admin/HomeContentManager'));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingPage />;
    }

    return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Navbar />}

            <main id="main-content" className={!isAdminRoute ? "flex-grow" : ""}>
                <Suspense fallback={<LoadingPage />}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/ministries" element={<Ministries />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Admin routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/projects"
                            element={
                                <ProtectedRoute>
                                    <ProjectManager />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/team"
                            element={
                                <ProtectedRoute>
                                    <TeamManager />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/messages"
                            element={
                                <ProtectedRoute>
                                    <Messages />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/statistics"
                            element={
                                <ProtectedRoute>
                                    <Statistics />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/gallery"
                            element={
                                <ProtectedRoute>
                                    <GalleryManager />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/services"
                            element={
                                <ProtectedRoute>
                                    <ServiceManager />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/ministries"
                            element={
                                <ProtectedRoute>
                                    <MinistryManager />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/home-content"
                            element={
                                <ProtectedRoute>
                                    <HomeContentManager />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>

            {!isAdminRoute && <Footer />}
        </div>
    );
}

export default App;
