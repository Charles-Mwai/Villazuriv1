import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Calendar, LogOut, Search, Bell, Settings, User, Home, Menu, X } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/bookings', label: 'Bookings', icon: List },
        { path: '/admin/calendar', label: 'Calendar', icon: Calendar },
    ];

    const handleLogout = () => {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_login_time');
        navigate('/admin/login');
    };

    const handleNavClick = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false); // Close menu on navigation
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="admin-layout">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div>
                        <h2 className="sidebar-title">Villa Zuri</h2>
                        <p className="sidebar-subtitle">Admin Panel</p>
                    </div>
                    <button
                        className="mobile-close-btn"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavClick(item.path)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="admin-main-wrapper">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={toggleMobileMenu}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="topbar-search">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="topbar-item home-button" onClick={() => navigate('/')} title="Go to Main Page">
                            <Home size={20} />
                        </button>
                        <button className="topbar-item"><Bell size={20} /></button>
                        <button className="topbar-item"><Settings size={20} /></button>
                        <div className="topbar-profile">
                            <div className="profile-img">
                                <User size={18} />
                            </div>
                            <span className="profile-name">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="breadcrumb-area">
                        <h2 className="page-title">
                            {location.pathname === '/admin/dashboard' && 'Welcome!'}
                            {location.pathname === '/admin/bookings' && 'All Bookings'}
                            {location.pathname === '/admin/calendar' && 'Calendar View'}
                            {location.pathname.includes('/admin/bookings/') && 'Booking Details'}
                        </h2>
                        <div className="breadcrumbs">
                            <span>Villa Zuri</span> › <span>Admin</span> ›
                            <span>
                                {location.pathname === '/admin/dashboard' && ' Dashboard'}
                                {location.pathname === '/admin/bookings' && ' Bookings'}
                                {location.pathname === '/admin/calendar' && ' Calendar'}
                                {location.pathname.includes('/admin/bookings/') && ' Booking Details'}
                            </span>
                        </div>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
