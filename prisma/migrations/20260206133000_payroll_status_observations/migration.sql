-- Add payroll status enum and approval/denial metadata
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payroll_status') THEN
    CREATE TYPE "payroll_status" AS ENUM ('pending', 'approved', 'denied');
  END IF;
END $$;

ALTER TABLE "payroll"
  ALTER COLUMN "status" TYPE "payroll_status" USING (
    CASE
      WHEN "status" IN ('pending', 'approved', 'denied') THEN "status"::"payroll_status"
      ELSE 'pending'::"payroll_status"
    END
  ),
  ALTER COLUMN "status" SET DEFAULT 'pending';

ALTER TABLE "payroll"
  ADD COLUMN IF NOT EXISTS "approved_by" uuid,
  ADD COLUMN IF NOT EXISTS "approved_at" timestamp,
  ADD COLUMN IF NOT EXISTS "denied_by" uuid,
  ADD COLUMN IF NOT EXISTS "denied_at" timestamp;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payroll_approved_by_fkey') THEN
    ALTER TABLE "payroll"
      ADD CONSTRAINT "payroll_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "workers"("id") ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payroll_denied_by_fkey') THEN
    ALTER TABLE "payroll"
      ADD CONSTRAINT "payroll_denied_by_fkey" FOREIGN KEY ("denied_by") REFERENCES "workers"("id") ON DELETE SET NULL;
  END IF;
END $$;

-- Observations per worker per payroll (unique)
CREATE TABLE IF NOT EXISTS "payroll_worker_observations" (
  "payroll_id" integer NOT NULL,
  "worker_id" uuid NOT NULL,
  "notes" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "payroll_worker_observations_pkey" PRIMARY KEY ("payroll_id", "worker_id"),
  CONSTRAINT "payroll_worker_observations_payroll_id_fkey" FOREIGN KEY ("payroll_id") REFERENCES "payroll"("id") ON DELETE CASCADE,
  CONSTRAINT "payroll_worker_observations_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE CASCADE
);
