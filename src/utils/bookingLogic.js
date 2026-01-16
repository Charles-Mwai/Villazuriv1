/**
 * Villa Zuri Booking Logic
 * 
 * Seasons:
 * - Off-Peak: Feb 1 - May 31, Sept 1 - Sept 30 ($400/night)
 * - Peak: June 1 - Aug 31, Oct 1 - Jan 31 ($600/night)
 */

const RATES = {
    PEAK: 600,
    OFF_PEAK: 400
};

/**
 * Checks if a date range overlaps with any existing bookings.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {Array<{start: Date, end: Date}>} existingBookings 
 * @returns {boolean} true if available, false if reserved
 */
export const checkAvailability = (startDate, endDate, existingBookings = []) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Basic validation: end must be after start
    if (start >= end) return false;

    for (const booking of existingBookings) {
        const bookedStart = new Date(booking.start);
        const bookedEnd = new Date(booking.end);

        // Intersection formula: (StartA < EndB) && (EndA > StartB)
        if (start < bookedEnd && end > bookedStart) {
            return false; // Collision detected
        }
    }

    return true;
};

/**
 * Determines if a specific date is in Peak season.
 * Peak: Oct (9) to Jan (0) inclusive.
 * @param {Date} date 
 * @returns {boolean}
 */
const isPeakSeason = (date) => {
    const month = date.getMonth(); // 0-indexed (Jan=0, Dec=11)
    // Peak: June(5), July(6), August(7) AND Oct(9), Nov(10), Dec(11), Jan(0)
    return (month >= 5 && month <= 7) || month >= 9 || month === 0;
};

/**
 * Calculates total cost based on dynamic pricing rules or seasonal defaults.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {Array} pricingRules - Optional array of custom pricing rules from DB
 * @returns {number} Total cost
 */
export const calculateTotalCost = (startDate, endDate, pricingRules = []) => {
    let totalCost = 0;
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    // Eliminate time component for purely date-based calculation
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (currentDate >= end) return 0;

    // Iterate through each night
    while (currentDate < end) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // 1. Check for custom pricing rules first
        const applicableRule = pricingRules.find(rule =>
            dateStr >= rule.start_date && dateStr <= rule.end_date
        );

        if (applicableRule) {
            totalCost += parseFloat(applicableRule.rate);
        } else {
            // 2. Fallback to legacy seasonal logic if no specific rule matches
            if (isPeakSeason(currentDate)) {
                totalCost += RATES.PEAK;
            } else {
                totalCost += RATES.OFF_PEAK;
            }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalCost;
};

/**
 * Validates booking inputs.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {{isValid: boolean, error: string|null}}
 */
export const validateBookingDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { isValid: false, error: "Invalid date format" };
    }

    if (start < today) {
        return { isValid: false, error: "Cannot book dates in the past" };
    }

    if (end <= start) {
        return { isValid: false, error: "End date must be after start date" };
    }

    return { isValid: true, error: null };
};
