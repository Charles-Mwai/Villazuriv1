/**
 * SIMULATION TEST CASE
 * Rule: Feb 1st - Feb 10th 2026 @ $298/night
 * Scenario: Arive Feb 2nd 2026, Stay 5 nights
 */

// --- LOGIC COPIED FROM src/utils/bookingLogic.js ---
const RATES = { PEAK: 600, OFF_PEAK: 400 };

const isPeakSeason = (date) => {
    const month = date.getMonth();
    return (month >= 5 && month <= 7) || month >= 9 || month === 0;
};

const toLocalYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const calculateTotalCost = (startDate, endDate, pricingRules = []) => {
    let totalCost = 0;
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (currentDate >= end) return 0;

    console.log("--- Calculation Breakdown ---");
    while (currentDate < end) {
        const dateStr = toLocalYYYYMMDD(currentDate);

        const applicableRule = pricingRules.find(rule =>
            dateStr >= rule.start_date && dateStr <= rule.end_date
        );

        let nightlyRate = 0;
        let source = "";

        if (applicableRule) {
            nightlyRate = parseFloat(applicableRule.rate);
            source = `Custom Rule (${applicableRule.label || 'Unnamed'})`;
        } else {
            if (isPeakSeason(currentDate)) {
                nightlyRate = RATES.PEAK;
                source = "Peak Season (Default)";
            } else {
                nightlyRate = RATES.OFF_PEAK;
                source = "Off-Peak Season (Default)";
            }
        }

        console.log(`Night of ${dateStr}: $${nightlyRate} [${source}]`);
        totalCost += nightlyRate;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return totalCost;
};
// --- END COPIED LOGIC ---

// TEST DATA
const pricingRules = [
    {
        start_date: '2026-02-01',
        end_date: '2026-02-10',
        rate: 298,
        label: 'Feb Promotion'
    }
];

const arrivalDate = new Date('2026-02-02');
const nights = 5;
const checkoutDate = new Date(arrivalDate);
checkoutDate.setDate(arrivalDate.getDate() + nights);

console.log(`Simulation Start:`);
console.log(`Arrival: ${toLocalYYYYMMDD(arrivalDate)}`);
console.log(`Nights: ${nights}`);
console.log(`Checkout: ${toLocalYYYYMMDD(checkoutDate)}`);
console.log(`Rules: From ${pricingRules[0].start_date} to ${pricingRules[0].end_date} @ $${pricingRules[0].rate}`);
console.log("");

const total = calculateTotalCost(arrivalDate, checkoutDate, pricingRules);

console.log("");
console.log(`FINAL TOTAL COST: $${total}`);
console.log(`EXPECTED TOTAL (5 nights * $298): $${5 * 298}`);
// force deploy
