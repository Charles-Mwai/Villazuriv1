/**
 * analyticsService.js
 * Frontend service to fetch GA4 reporting data from the backend.
 */

export const getAnalyticsReport = async () => {
    try {
        const token = localStorage.getItem('admin_authenticated');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch('/api/analytics-report', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch analytics data');
        }

        return await response.json();
    } catch (error) {
        console.error('Analytics Service Error:', error);
        throw error;
    }
};
