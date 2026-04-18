import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token with permissions (with fallbacks if columns don't exist)
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      can_view_dashboard: user.can_view_dashboard ?? true,
      can_view_blogs: user.can_view_blogs ?? true,
      can_view_messages: user.can_view_messages ?? true,
      can_view_qa: user.can_view_qa ?? true,
      can_view_external_articles: user.can_view_external_articles ?? true,
      can_view_home_content: user.can_view_home_content ?? true,
      can_view_appointments: user.can_view_appointments ?? true,
      can_view_admins: user.can_view_admins ?? (user.role === 'super_admin'),
      can_view_settings: user.can_view_settings ?? true,
    });

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        redirectUrl: '/admin/dashboard', // Add redirect URL
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with explicit settings
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ Login successful for:', email);
    console.log('🍪 Cookie set:', {
      name: 'admin_token',
      length: token.length,
      httpOnly: true,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
