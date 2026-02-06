-- Ensure one payroll per month/year
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payroll_month_year_key') THEN
    ALTER TABLE "payroll" ADD CONSTRAINT "payroll_month_year_key" UNIQUE ("month", "year");
  END IF;
END $$;
