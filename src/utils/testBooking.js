
import { checkAvailability, calculateTotalCost, validateBookingDates } from './bookingLogic.js';

// --- Test Utilities ---
const logTest = (name, result, expected) => {
    const pass = result === expected;
    console.log(`${pass ? '✅' : '❌'} ${name}: ${pass ? 'PASSED' : `FAILED (Expected ${expected}, got ${result})`}`);
};

const runTests = () => {
    console.log("--- Starting Booking Logic Verification ---");

    // 1. COST CALCULATION TESTS
    console.log("\n[Cost Calculation]");

    // Off-Peak Test (March 1 - March 4 = 3 nights @ 400 = 1200)
    const offPeakCost = calculateTotalCost('2026-03-01', '2026-03-04');
    logTest("Off-Peak (3 nights)", offPeakCost, 1200);

    // Peak Test (Dec 20 - Dec 22 = 2 nights @ 600 = 1200)
    const peakCost = calculateTotalCost('2026-12-20', '2026-12-22');
    logTest("Peak (Dec) (2 nights)", peakCost, 1200);

    // New Peak Test (July 1 - July 4 = 3 nights @ 600 = 1800)
    const newPeakCost = calculateTotalCost('2026-07-01', '2026-07-04');
    logTest("Peak (July) (3 nights)", newPeakCost, 1800);

    // Crossover Test (Sept 29 - Oct 2 = 3 nights) -> 29-30 (Off), 30-1 (Off), 1-2 (Peak)
    // Wait: Sept 30 is Off-Peak. Oct 1 is Peak.
    // Nights:
    // 1. Sept 29 -> Sept 30 (Off: 400)
    // 2. Sept 30 -> Oct 1 (Off: 400) - Wait, logic says Sept end is Off, Oct start is Peak.
    // Let's trace logic:
    // Night 1: Sept 29 (Month 8 = Off) -> 400
    // Night 2: Sept 30 (Month 8 = Off) -> 400
    // Night 3: Oct 1 (Month 9 = Peak) -> 600
    // Total expected: 1400
    const crossoverCost = calculateTotalCost('2026-09-29', '2026-10-02');
    logTest("Crossover (Season Change)", crossoverCost, 1400);


    // 2. AVAILABILITY TESTS
    console.log("\n[Availability]");
    const existingBookings = [
        { start: '2026-06-10', end: '2026-06-15' }
    ];

    // Completely free
    logTest("Free Dates", checkAvailability('2026-06-01', '2026-06-05', existingBookings), true);

    // Exact Overlap
    logTest("Existing Booking collision", checkAvailability('2026-06-12', '2026-06-14', existingBookings), false);

    // Overlap Start
    logTest("Start Overlap collision", checkAvailability('2026-06-08', '2026-06-12', existingBookings), false);

    // Overlap End
    logTest("End Overlap collision", checkAvailability('2026-06-14', '2026-06-18', existingBookings), false);


    // 3. VALIDATION TESTS
    console.log("\n[Validation]");
    const pastDate = validateBookingDates('2020-01-01', '2020-01-05');
    logTest("Past Date Validation", pastDate.isValid, false);

    const invalidRange = validateBookingDates('2026-06-10', '2026-06-05');
    logTest("Negative Date Range", invalidRange.isValid, false);

    const validRange = validateBookingDates('2026-08-01', '2026-08-05');
    logTest("Valid Date Range", validRange.isValid, true);
};

runTests();
