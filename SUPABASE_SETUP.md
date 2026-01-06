# Supabase Setup Instructions

## Complete These Steps to Enable Backend Functionality

### 1. Create Database Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: **ftewmycurmankxaqsdgz**
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy and paste the SQL from `supabase/schema.sql`
6. Click **"Run"** to execute

### 2. Verify Setup

After running the SQL:

1. Go to **"Table Editor"** in the left sidebar
2. You should see a new table called **`bookings`**
3. Click on it to verify the columns match the schema

### 3. Test the Integration

1. **Restart your dev server** (important for env variables):
   ```bash
   # Stop the current npm run dev (Ctrl+C)
   npm run dev
   ```

2. **Test Availability Checking**:
   - Open the booking modal
   - Select a date in the calendar
   - The calendar should load (might show no booked dates initially)

3. **Test Booking Creation**:
   - Fill out the booking form completely
   - Submit the form
   - Check the Supabase dashboard → Table Editor → bookings
   - You should see your test booking appear!

### 4. Add Test Booking (Optional)

To test the calendar's ability to show booked dates:

1. In Supabase → Table Editor → bookings
2. Click **"Insert row"**
3. Add:
   - check_in: `2026-01-15`
   - check_out: `2026-01-18`
   - nights: `3`
   - guests: `2`
   - guest_name: `Test User`
   - guest_email: `test@example.com`
   - guest_phone: `+1234567890`
   - total_cost: `1200`
   - status: `confirmed` (important!)
   - dates_flexible: `false`
4. Click **"Save"**
5. Refresh your calendar - those dates should now be disabled!

## What's Now Working

✅ **Calendar Integration**
- Fetches booked dates from Supabase
- Shows booked dates with strikethrough
- Prevents selection of unavailable dates

✅ **Booking Creation**
- Checks real availability before booking
- Saves bookings to database
- Returns booking ID to user
- Validates all inputs

✅ **Real-time Updates**
- New bookings are immediately stored
- Calendar reflects latest availability

## Troubleshooting

**Calendar not showing booked dates?**
- Check browser console for errors
- Verify RLS policies are created
- Ensure test booking status is 'confirmed' or 'paid'

**Can't create booking?**
- Check browser console for errors
- Verify all required fields are filled
- Make sure dates are in the future
- Check Supabase logs for errors

**Environment variables not loading?**
- Ensure `.env.local` exists in project root
- Restart dev server after creating `.env.local`
- Check variables are prefixed with `VITE_`
