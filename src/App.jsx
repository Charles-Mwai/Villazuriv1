import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';

// Public pages
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VillaDetails from './components/VillaDetails';
import MarqueeGallery from './components/MarqueeGallery';
import Watamu from './pages/Public/Watamu';
import FullGallery from './pages/Public/FullGallery';
import Checkout from './pages/Public/Checkout';
import Confirmation from './pages/Public/Confirmation';
import Footer from './components/Footer';
import WatamuFeature from './components/WatamuFeature';

import Blog from './pages/Public/Blog';
import ExperiencePage from './pages/Public/ExperiencePage';
import Terms from './pages/Public/Terms';
import ExperienceTeaser from './components/ExperienceTeaser';
import Activities from './components/Activities';
import ActivityDetailPage from './pages/Public/ActivityDetailPage';
import StoryDetailPage from './pages/Public/StoryDetailPage';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import CookieConsent from './components/CookieConsent';


// Admin pages
import Login from './pages/Admin/Login';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import BookingsList from './pages/Admin/BookingsList';
import BookingDetail from './pages/Admin/BookingDetail';
import CalendarView from './pages/Admin/CalendarView';
import Pricing from './pages/Admin/Pricing';
import ProtectedRoute from './components/Admin/ProtectedRoute';

// Public landing page layout
const PublicLayout = () => (
    <>
        <Navbar />
        <Hero />
        <VillaDetails />
        <ExperienceTeaser />
        <Activities />
        <WatamuFeature />
        <Footer />
    </>
);

function App() {
    return (
        <BookingProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PublicLayout />} />
                    <Route path="/gallery" element={<FullGallery />} />
                    <Route path="/watamu" element={<Watamu />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/confirmation" element={<Confirmation />} />
                    <Route path="/activities/:id" element={<ActivityDetailPage />} />
                    <Route path="/stories/:id" element={<StoryDetailPage />} />


                    {/* Admin routes */}
                    <Route path="/admin/login" element={<Login />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="bookings" element={<BookingsList />} />
                        <Route path="bookings/:id" element={<BookingDetail />} />
                        <Route path="calendar" element={<CalendarView />} />
                        <Route path="pricing" element={<Pricing />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <CookieConsent />
            </BrowserRouter>
        </BookingProvider>
    );
}

export default App;
