import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Calendar, List, Search, Bell, Settings, User, Home } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('admin_authenticated');
            localStorage.removeItem('admin_login_time');
            navigate('/admin/login');
        }
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/bookings', label: 'Bookings', icon: List },
        { path: '/admin/calendar', label: 'Calendar', icon: Calendar },
    ];

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Villa Zuri</h2>
                    <p className="sidebar-subtitle">Admin</p>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                                {item.label === 'Dashboard' && <span className="badge">9+</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="admin-main-wrapper">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="mobile-menu-btn">
                            <List size={20} />
                        </button>
                        <div className="topbar-search">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button
                            className="topbar-item home-button"
                            onClick={() => navigate('/')}
                            title="Go to Main Page"
                        >
                            <Home size={20} />
                        </button>
                        <div className="topbar-item"><Bell size={20} /></div>
                        <div className="topbar-item"><Settings size={20} /></div>
                        <div className="topbar-profile">
                            <div className="profile-img">
                                <User size={20} />
                            </div>
                            <span className="profile-name">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="breadcrumb-area">
                        <h2 className="page-title">Welcome!</h2>
                        <div className="breadcrumbs">
                            <span>Villa Zuri</span> &rsaquo; <span>Admin</span> &rsaquo; <span>Dashboard</span>
                        </div>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
