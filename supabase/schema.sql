-- Villa Zuri Booking System Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Booking Details
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  guests INTEGER NOT NULL,
  
  -- Guest Information
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  dates_flexible BOOLEAN DEFAULT false,
  
  -- Pricing
  total_cost DECIMAL(10, 2) NOT NULL,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending',
  -- Status values: 'pending', 'confirmed', 'paid', 'cancelled'
  
  -- Payment info (for future Pesapal integration)
  payment_id VARCHAR(255),
  payment_status VARCHAR(50),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  CONSTRAINT valid_nights CHECK (nights > 0),
  CONSTRAINT valid_guests CHECK (guests > 0 AND guests <= 15)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view bookings by status (for availability checking and returning created IDs)
CREATE POLICY "Public can view bookings by status" ON bookings
  FOR SELECT
  USING (status IN ('pending', 'confirmed', 'paid'));

-- Policy: Anyone can insert bookings (for now, will add auth later)
CREATE POLICY "Anyone can create pending bookings" ON bookings
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Policy: Service role can do everything (for admin dashboard later)
CREATE POLICY "Service role full access" ON bookings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Optional: Create a view for availability checking
CREATE OR REPLACE VIEW available_dates AS
SELECT 
  check_in,
  check_out,
  guest_name,
  total_cost
FROM bookings
WHERE status IN ('confirmed', 'paid');

COMMENT ON TABLE bookings IS 'Stores all booking information for Villa Zuri';
COMMENT ON COLUMN bookings.status IS 'Booking status: pending (awaiting payment), confirmed (payment received), paid (archived), cancelled';
