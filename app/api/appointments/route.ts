import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/appointments - Get all appointments (Admin only for all, public can't access)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let whereConditions = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (date) {
      whereConditions.push(`date = $${paramIndex}`);
      queryParams.push(date);
      paramIndex++;
    }

    if (startDate && endDate) {
      whereConditions.push(`date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      queryParams.push(startDate, endDate);
      paramIndex += 2;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const result = await pool.query(
      `SELECT * FROM appointments
       ${whereClause}
       ORDER BY date ASC, time ASC`,
      queryParams
    );

    return NextResponse.json({
      success: true,
      appointments: result.rows,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, date, time, reason, status, notes, created_by } = await request.json();

    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Name, email, date, and time are required' },
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

    // Check if admin is creating the appointment
    const user = await getCurrentUser();
    const appointmentCreatedBy = user ? 'admin' : 'client';
    const appointmentStatus = user ? (status || 'approved') : 'pending';

    // Check for conflicting appointments (same date and time)
    const conflictCheck = await pool.query(
      `SELECT id FROM appointments
       WHERE date = $1 AND time = $2 AND status = 'approved'`,
      [date, time]
    );

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ce créneau est déjà réservé' },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `INSERT INTO appointments (name, email, phone, date, time, reason, status, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, email, phone || null, date, time, reason || null, appointmentStatus, notes || null, appointmentCreatedBy]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Rendez-vous créé avec succès',
        appointment: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
