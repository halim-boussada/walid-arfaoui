-- Add permissions columns to admin_users table for role-based access control
-- This migration adds individual permission flags for each section of the dashboard

-- Add permission columns if they don't exist
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS can_view_dashboard BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_blogs BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_messages BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_qa BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_external_articles BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_home_content BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_appointments BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS can_view_admins BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_view_settings BOOLEAN DEFAULT TRUE;

-- Update existing admins based on their role
-- Super admins get all permissions
UPDATE admin_users
SET
  can_view_dashboard = TRUE,
  can_view_blogs = TRUE,
  can_view_messages = TRUE,
  can_view_qa = TRUE,
  can_view_external_articles = TRUE,
  can_view_home_content = TRUE,
  can_view_appointments = TRUE,
  can_view_admins = TRUE,
  can_view_settings = TRUE
WHERE role = 'super_admin';

-- Regular admins get all permissions except admins page
UPDATE admin_users
SET
  can_view_dashboard = TRUE,
  can_view_blogs = TRUE,
  can_view_messages = TRUE,
  can_view_qa = TRUE,
  can_view_external_articles = TRUE,
  can_view_home_content = TRUE,
  can_view_appointments = TRUE,
  can_view_admins = FALSE,
  can_view_settings = TRUE
WHERE role = 'admin';

-- Create an index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
