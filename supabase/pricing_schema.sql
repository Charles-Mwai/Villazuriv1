-- Villa Zuri Dynamic Pricing Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Create pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  label VARCHAR(255), -- Optional: "Christmas Peak", "Summer Special"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent end date before start date
  CONSTRAINT valid_range CHECK (end_date >= start_date)
);

-- 2. Create index for faster date-range lookups
CREATE INDEX IF NOT EXISTS idx_pricing_dates ON pricing(start_date, end_date);

-- 3. Enable Row Level Security
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies

-- Policy: Everyone can view pricing (needed for guest booking cost calculation)
CREATE POLICY "Public can view pricing" ON pricing
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Everyone can manage pricing (Update this to authenticated for production)
-- Since the current admin panel uses custom password auth instead of Supabase Auth,
-- we allow the 'anon' role (public) to manage pricing for now.
CREATE POLICY "Anyone can manage pricing" ON pricing
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Seed initial rates based on current hardcoded logic (optional but recommended)
-- Off-Peak ($400): Feb-May, Sep
-- Peak ($600): Jun-Aug, Oct-Jan
-- Note: This is an example of how range-based pricing works.
-- You can now add these via the Admin Panel instead!
INSERT INTO pricing (start_date, end_date, rate, label) 
VALUES 
  ('2026-02-01', '2026-05-31', 400, 'Off-Peak Season'),
  ('2026-06-01', '2026-08-31', 600, 'Summer Peak'),
  ('2026-09-01', '2026-09-30', 400, 'September Special'),
  ('2026-10-01', '2027-01-31', 600, 'End of Year Peak');
