import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'confirmed':
                return 'status-confirmed';
            case 'paid':
                return 'status-paid';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-default';
        }
    };

    return (
        <span className={`status-badge ${getStatusClass()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
