-- Add DELETE policy for admin operations
-- This allows anyone to delete bookings (temporary solution until proper auth is implemented)
-- In production, this should be restricted to authenticated admin users only

CREATE POLICY "Allow public delete for admin" ON bookings
  FOR DELETE
  USING (true);

-- Alternative: If you want to restrict deletion to only certain statuses
-- CREATE POLICY "Allow delete pending bookings" ON bookings
--   FOR DELETE
--   USING (status IN ('pending', 'cancelled'));
