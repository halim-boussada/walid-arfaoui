import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET /api/admins - Get all admin users
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to fetch with permission columns first
    let result;
    try {
      result = await pool.query(
        `SELECT id, email, role, created_at,
                can_view_dashboard, can_view_blogs, can_view_messages,
                can_view_qa, can_view_external_articles, can_view_home_content,
                can_view_appointments, can_view_admins, can_view_settings
         FROM admin_users ORDER BY created_at DESC`
      );
    } catch (columnError) {
      // If permission columns don't exist, fall back to basic columns
      console.log('Permission columns not found, using basic query');
      result = await pool.query(
        `SELECT id, email, role, created_at
         FROM admin_users ORDER BY created_at DESC`
      );

      // Add default permissions based on role
      result.rows = result.rows.map(admin => ({
        ...admin,
        can_view_dashboard: true,
        can_view_blogs: true,
        can_view_messages: true,
        can_view_qa: true,
        can_view_external_articles: true,
        can_view_home_content: true,
        can_view_appointments: true,
        can_view_admins: admin.role === 'super_admin',
        can_view_settings: true,
      }));
    }

    return NextResponse.json({
      success: true,
      admins: result.rows,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

// POST /api/admins - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, password, role, permissions } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default permissions based on role if not provided
    const defaultPermissions = {
      can_view_dashboard: true,
      can_view_blogs: true,
      can_view_messages: true,
      can_view_qa: true,
      can_view_external_articles: true,
      can_view_home_content: true,
      can_view_appointments: true,
      can_view_admins: role === 'super_admin',
      can_view_settings: true,
    };

    const finalPermissions = permissions || defaultPermissions;

    // Insert new admin (use email as name for now)
    let result;
    try {
      // Try to insert with permission columns
      result = await pool.query(
        `INSERT INTO admin_users (
          email, password, name, role,
          can_view_dashboard, can_view_blogs, can_view_messages,
          can_view_qa, can_view_external_articles, can_view_home_content,
          can_view_appointments, can_view_admins, can_view_settings
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id, email, role, created_at,
                   can_view_dashboard, can_view_blogs, can_view_messages,
                   can_view_qa, can_view_external_articles, can_view_home_content,
                   can_view_appointments, can_view_admins, can_view_settings`,
        [
          email,
          hashedPassword,
          email.split('@')[0],
          role || 'admin',
          finalPermissions.can_view_dashboard,
          finalPermissions.can_view_blogs,
          finalPermissions.can_view_messages,
          finalPermissions.can_view_qa,
          finalPermissions.can_view_external_articles,
          finalPermissions.can_view_home_content,
          finalPermissions.can_view_appointments,
          finalPermissions.can_view_admins,
          finalPermissions.can_view_settings,
        ]
      );
    } catch (columnError) {
      // If permission columns don't exist, fall back to basic insert
      console.log('Permission columns not found, using basic insert');
      result = await pool.query(
        `INSERT INTO admin_users (email, password, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, role, created_at`,
        [email, hashedPassword, email.split('@')[0], role || 'admin']
      );

      // Add default permissions to the result
      result.rows[0] = {
        ...result.rows[0],
        ...finalPermissions,
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
        admin: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to create admin';
    return NextResponse.json(
      {
        error: 'Failed to create admin',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
