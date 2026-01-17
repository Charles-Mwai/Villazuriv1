import React, { useState, useEffect } from 'react';
import { getPricingRules, upsertPricingRule, deletePricingRule } from '../../services/adminService';
import { Calendar, DollarSign, Plus, Trash2, Info } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null); // Added diagnostic error state
    const [newRule, setNewRule] = useState({
        start_date: '',
        end_date: '',
        rate: '',
        label: ''
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('--- DIAGNOSTIC: Fetching pricing rules... ---');
            const data = await getPricingRules();
            console.log('--- DIAGNOSTIC: Rules received:', data);
            setRules(data);
        } catch (err) {
            console.error('--- DIAGNOSTIC ERROR: Failed to fetch rules:', err);
            setError('Database connection error. Please check your Supabase setup and RLS policies.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRule(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newRule.start_date || !newRule.end_date || !newRule.rate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            console.log('--- DIAGNOSTIC: Saving pricing rule:', newRule);
            await upsertPricingRule({
                ...newRule,
                rate: parseFloat(newRule.rate)
            });
            console.log('--- DIAGNOSTIC: Save successful ---');
            setNewRule({ start_date: '', end_date: '', rate: '', label: '' });
            await fetchRules();
            alert('Pricing rule saved successfully');
        } catch (err) {
            console.error('--- DIAGNOSTIC ERROR: Failed to save rule:', err);
            alert(`Failed to save: ${err.message || 'Unknown error'}. Check browser console for details.`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pricing rule?')) {
            try {
                await deletePricingRule(id);
                await fetchRules();
            } catch (error) {
                console.error('Failed to delete rule:', error);
                alert('Failed to delete pricing rule');
            }
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="admin-loading">Loading pricing data...</div>;
    }

    return (
        <div className="pricing-page">
            {error && (
                <div className="diagnostic-error-banner">
                    <Info size={20} />
                    <span><strong>System Alert:</strong> {error}</span>
                </div>
            )}
            <div className="pricing-grid">
                {/* Add New Rule Section */}
                <div className="pricing-card add-rule-card">
                    <div className="card-header">
                        <div className="header-icon">
                            <Plus size={24} />
                        </div>
                        <h2>Set Custom Rate</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="pricing-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={newRule.start_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={newRule.end_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nightly Rate (USD)</label>
                            <div className="input-with-icon">
                                <span className="input-icon">$</span>
                                <input
                                    type="number"
                                    name="rate"
                                    placeholder="e.g. 500"
                                    value={newRule.rate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Label (Optional)</label>
                            <input
                                type="text"
                                name="label"
                                placeholder="e.g. New Year Special"
                                value={newRule.label}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="save-rule-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Add Pricing Rule'}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="pricing-card info-card">
                    <div className="card-header">
                        <div className="header-icon info">
                            <Info size={24} />
                        </div>
                        <h2>How it works</h2>
                    </div>
                    <div className="info-content">
                        <p>Dates selected in these ranges will override the default seasonal rates.</p>
                        <ul>
                            <li><strong>Base Rate:</strong> $400/night</li>
                            <li><strong>Peak Default:</strong> $600/night</li>
                        </ul>
                        <div className="alert-tip">
                            Custom rules take priority over default seasons.
                        </div>
                    </div>
                </div>
            </div>

            {/* Rules List Section */}
            <div className="pricing-section">
                <div className="section-header">
                    <h2>Active Pricing Rules</h2>
                    <span className="count-badge">{rules.length}</span>
                </div>

                {rules.length === 0 ? (
                    <div className="empty-rules">
                        <Calendar size={48} />
                        <p>No custom pricing rules found</p>
                        <span>Add your first rule using the form above.</span>
                    </div>
                ) : (
                    <div className="rules-table-wrapper">
                        <table className="rules-table">
                            <thead>
                                <tr>
                                    <th>Label</th>
                                    <th>Starts</th>
                                    <th>Ends</th>
                                    <th>Rate</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map(rule => (
                                    <tr key={rule.id}>
                                        <td className="rule-label">{rule.label || 'Custom Rate'}</td>
                                        <td>{formatDate(rule.start_date)}</td>
                                        <td>{formatDate(rule.end_date)}</td>
                                        <td className="rule-price">${rule.rate}/night</td>
                                        <td>
                                            <button
                                                className="delete-rule-btn"
                                                onClick={() => handleDelete(rule.id)}
                                                title="Delete rule"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pricing;
