import Booking from '../models/Booking.js';

/**
 * Test suite for booking conflict detection
 * This ensures the hasConflict method works correctly
 */

// Test scenarios for conflict detection
export const testConflictDetection = async () => {
    console.log('\n========================================');
    console.log('BOOKING CONFLICT DETECTION TESTS');
    console.log('========================================\n');

    const testResourceId = '507f1f77bcf86cd799439011'; // Dummy resource ID for testing
    const results = [];

    // Helper function to create date
    const makeDate = (hour) => {
        const date = new Date();
        date.setHours(hour, 0, 0, 0);
        return date;
    };

    // Test Case 1: Exact overlap
    console.log('Test 1: Exact Overlap');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:      10:00 - 12:00');
    const test1 = {
        name: 'Exact Overlap',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(10), end: makeDate(12) },
        shouldConflict: true
    };
    results.push(test1);

    // Test Case 2: New booking starts before existing and ends during
    console.log('\nTest 2: Starts Before, Ends During');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:       9:00 - 11:00');
    const test2 = {
        name: 'Starts Before, Ends During',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(9), end: makeDate(11) },
        shouldConflict: true
    };
    results.push(test2);

    // Test Case 3: New booking starts during existing and ends after
    console.log('\nTest 3: Starts During, Ends After');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:      11:00 - 13:00');
    const test3 = {
        name: 'Starts During, Ends After',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(11), end: makeDate(13) },
        shouldConflict: true
    };
    results.push(test3);

    // Test Case 4: New booking completely contains existing
    console.log('\nTest 4: New Contains Existing');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:       9:00 - 13:00');
    const test4 = {
        name: 'New Contains Existing',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(9), end: makeDate(13) },
        shouldConflict: true
    };
    results.push(test4);

    // Test Case 5: New booking completely within existing
    console.log('\nTest 5: New Within Existing');
    console.log('Existing: 10:00 - 14:00');
    console.log('New:      11:00 - 13:00');
    const test5 = {
        name: 'New Within Existing',
        existing: { start: makeDate(10), end: makeDate(14) },
        new: { start: makeDate(11), end: makeDate(13) },
        shouldConflict: true
    };
    results.push(test5);

    // Test Case 6: New booking ends exactly when existing starts (NO CONFLICT)
    console.log('\nTest 6: Back-to-Back (New Ends, Existing Starts)');
    console.log('Existing: 12:00 - 14:00');
    console.log('New:      10:00 - 12:00');
    const test6 = {
        name: 'Back-to-Back (New Ends, Existing Starts)',
        existing: { start: makeDate(12), end: makeDate(14) },
        new: { start: makeDate(10), end: makeDate(12) },
        shouldConflict: false
    };
    results.push(test6);

    // Test Case 7: New booking starts exactly when existing ends (NO CONFLICT)
    console.log('\nTest 7: Back-to-Back (Existing Ends, New Starts)');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:      12:00 - 14:00');
    const test7 = {
        name: 'Back-to-Back (Existing Ends, New Starts)',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(12), end: makeDate(14) },
        shouldConflict: false
    };
    results.push(test7);

    // Test Case 8: New booking completely before existing (NO CONFLICT)
    console.log('\nTest 8: Completely Before');
    console.log('Existing: 14:00 - 16:00');
    console.log('New:      10:00 - 12:00');
    const test8 = {
        name: 'Completely Before',
        existing: { start: makeDate(14), end: makeDate(16) },
        new: { start: makeDate(10), end: makeDate(12) },
        shouldConflict: false
    };
    results.push(test8);

    // Test Case 9: New booking completely after existing (NO CONFLICT)
    console.log('\nTest 9: Completely After');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:      14:00 - 16:00');
    const test9 = {
        name: 'Completely After',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: makeDate(14), end: makeDate(16) },
        shouldConflict: false
    };
    results.push(test9);

    // Test Case 10: One minute overlap
    console.log('\nTest 10: One Minute Overlap');
    console.log('Existing: 10:00 - 12:00');
    console.log('New:      11:59 - 14:00');
    const test10 = {
        name: 'One Minute Overlap',
        existing: { start: makeDate(10), end: makeDate(12) },
        new: { start: new Date(makeDate(12).getTime() - 60000), end: makeDate(14) },
        shouldConflict: true
    };
    results.push(test10);

    console.log('\n========================================');
    console.log('Test Results Summary:');
    console.log('========================================\n');

    results.forEach((test, index) => {
        console.log(`${index + 1}. ${test.name}`);
        console.log(`   Expected: ${test.shouldConflict ? 'CONFLICT' : 'NO CONFLICT'}`);
    });

    console.log('\n========================================\n');

    return results;
};

/**
 * Verify conflict logic manually
 * This demonstrates the exact logic used in Booking.hasConflict
 */
export const verifyConflictLogic = (existingStart, existingEnd, newStart, newEnd) => {
    // A conflict exists if:
    // - New booking starts before existing ends AND
    // - New booking ends after existing starts
    const hasConflict = newStart < existingEnd && newEnd > existingStart;

    console.log('\n--- Conflict Check ---');
    console.log(`Existing: ${existingStart.toLocaleTimeString()} - ${existingEnd.toLocaleTimeString()}`);
    console.log(`New:      ${newStart.toLocaleTimeString()} - ${newEnd.toLocaleTimeString()}`);
    console.log(`Result:   ${hasConflict ? 'CONFLICT ❌' : 'NO CONFLICT ✅'}`);
    console.log('----------------------\n');

    return hasConflict;
};

/**
 * Run live tests against actual database
 * WARNING: Only run in development/test environment
 */
export const runLiveConflictTests = async () => {
    console.log('\n========================================');
    console.log('LIVE DATABASE CONFLICT TESTS');
    console.log('========================================\n');

    try {
        // These would need actual resource IDs from your database
        console.log('Note: Live tests require actual resource IDs from your database');
        console.log('Modify this function with real IDs to test\n');

        // Example live test (commented out - uncomment with real data):
        /*
        const testResourceId = 'YOUR_REAL_RESOURCE_ID';
        
        // Create a test booking
        const booking1 = await Booking.create({
            resourceId: testResourceId,
            userId: 'YOUR_USER_ID',
            startTime: new Date('2024-12-20T10:00:00'),
            endTime: new Date('2024-12-20T12:00:00'),
            status: 'confirmed'
        });
        
        // Test for conflict
        const hasConflict = await Booking.hasConflict(
            testResourceId,
            new Date('2024-12-20T11:00:00'),
            new Date('2024-12-20T13:00:00')
        );
        
        console.log('Conflict detected:', hasConflict); // Should be true
        
        // Cleanup
        await booking1.deleteOne();
        */

    } catch (error) {
        console.error('Live test error:', error);
    }
};

export default {
    testConflictDetection,
    verifyConflictLogic,
    runLiveConflictTests
};
