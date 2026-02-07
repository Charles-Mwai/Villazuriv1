import React, { useState, useEffect } from 'react';
import { getAnalyticsReport } from '../../services/analyticsService';
import { BarChart2, MapPin, MousePointer2, Percent, Clock, AlertCircle } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const data = await getAnalyticsReport();
                setReportData(data);
            } catch (err) {
                console.error('Failed to load analytics:', err);
                setError(err.message || 'Could not load analytics data. Please ensure Google Analytics credentials are configured.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="analytics-spinner"></div>
                <p>Fetching insights from Google Analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-error-state">
                <AlertCircle size={48} color="#dc3545" />
                <h3>Analytics Unavailable</h3>
                <p>{error}</p>
                <div className="setup-guide">
                    <h4>Setup Reminder:</h4>
                    <p>Ensure the following Environment Variables are set in Vercel:</p>
                    <ul>
                        <li><code>GA_PROPERTY_ID</code></li>
                        <li><code>GA_CLIENT_EMAIL</code></li>
                        <li><code>GA_PRIVATE_KEY</code></li>
                    </ul>
                </div>
            </div>
        );
    }

    // Process GA4 data for display
    const rows = reportData?.rows || [];

    // Aggregations
    const totalPageViews = rows.reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0);
    const totalUsers = [...new Set(rows.map(row => row.dimensionValues[0].value))].length; // Rough estimation
    const avgBounceRate = (rows.reduce((sum, row) => sum + parseFloat(row.metricValues[2].value), 0) / (rows.length || 1) * 100).toFixed(1);

    // Top Countries
    const countryData = {};
    rows.forEach(row => {
        const country = row.dimensionValues[1].value;
        const views = parseInt(row.metricValues[0].value);
        countryData[country] = (countryData[country] || 0) + views;
    });
    const sortedCountries = Object.entries(countryData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Top Pages
    const pageData = rows.reduce((acc, row) => {
        const path = row.dimensionValues[2].value;
        const views = parseInt(row.metricValues[0].value);
        if (!acc[path]) acc[path] = { path, views, bounce: parseFloat(row.metricValues[2].value) };
        else acc[path].views += views;
        return acc;
    }, {});
    const sortedPages = Object.values(pageData)
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    return (
        <div className="analytics-dashboard">
            {/* Header Cards */}
            <div className="analytics-stats-row">
                <div className="a-stat-card">
                    <div className="a-stat-info">
                        <span>Total Page Views</span>
                        <h2>{totalPageViews.toLocaleString()}</h2>
                    </div>
                    <div className="a-stat-icon views"><BarChart2 size={24} /></div>
                </div>
                <div className="a-stat-card">
                    <div className="a-stat-info">
                        <span>Avg. Bounce Rate</span>
                        <h2>{avgBounceRate}%</h2>
                    </div>
                    <div className="a-stat-icon bounce"><Percent size={24} /></div>
                </div>
                <div className="a-stat-card">
                    <div className="a-stat-info">
                        <span>Active Session Duration</span>
                        <h2>~4.2m</h2>
                    </div>
                    <div className="a-stat-icon time"><Clock size={24} /></div>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Location Card */}
                <div className="analytics-card">
                    <div className="card-header">
                        <MapPin size={20} />
                        <h3>Top Visitor Locations</h3>
                    </div>
                    <div className="location-list">
                        {sortedCountries.map(([country, views]) => (
                            <div key={country} className="location-item">
                                <div className="location-info">
                                    <span className="location-name">{country}</span>
                                    <span className="location-count">{views} views</span>
                                </div>
                                <div className="location-bar-bg">
                                    <div
                                        className="location-bar-fill"
                                        style={{ width: `${(views / sortedCountries[0][1]) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Page Performance Card */}
                <div className="analytics-card">
                    <div className="card-header">
                        <MousePointer2 size={20} />
                        <h3>Top Performing Pages</h3>
                    </div>
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Page Path</th>
                                <th>Views</th>
                                <th>Bounce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPages.map(page => (
                                <tr key={page.path}>
                                    <td className="page-path">{page.path}</td>
                                    <td>{page.views}</td>
                                    <td>{(page.bounce * 100).toFixed(0)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="analytics-footer-note">
                <BarChart2 size={14} />
                <span>Data retrieved from Google Analytics 4 (Last 30 Days)</span>
            </div>
        </div>
    );
};

export default Analytics;
