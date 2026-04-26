-- Use ONLY if migration 20260426110650_add_portal_user_contributions failed
-- and `migrate deploy` errors with "already exists" / duplicate objects
-- (partial application). Otherwise prefer `migrate resolve --rolled-back` only.
-- Run against the "acep" (or your POSTGRES_DB) database.
-- Stops the portal-related objects so that migration can run cleanly again.

-- Later migrations that depend on Portal* must not exist yet if 10650 failed
-- in normal order. If you ran anything manually, review before executing.

DROP TABLE IF EXISTS "EventContribution" CASCADE;
DROP TABLE IF EXISTS "PortalSession" CASCADE;
DROP TABLE IF EXISTS "PortalUser" CASCADE;

ALTER TABLE "EventExhibitorRegistration" DROP COLUMN IF EXISTS "portalUserId";
ALTER TABLE "EventRegistration" DROP COLUMN IF EXISTS "portalUserId";
ALTER TABLE "EventSpeaker" DROP COLUMN IF EXISTS "portalUserId";

DROP TYPE IF EXISTS "EventContributionStatus" CASCADE;
