import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/qa - Get all Q&A items (public if published=true, admin for all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') === 'true';
    const category = searchParams.get('category');

    // Build query
    let whereConditions = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // If not admin, only show published
    const user = await getCurrentUser();
    if (!user && published !== false) {
      whereConditions.push('published = true');
    } else if (published) {
      whereConditions.push('published = true');
    }

    if (category) {
      whereConditions.push(`category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const result = await pool.query(
      `SELECT * FROM qa
       ${whereClause}
       ORDER BY display_order ASC, created_at DESC`,
      queryParams
    );

    return NextResponse.json({
      success: true,
      qa: result.rows,
    });
  } catch (error) {
    console.error('Get Q&A error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A items' },
      { status: 500 }
    );
  }
}

// POST /api/qa - Create a new Q&A item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { question, answer, category, display_order, published } = await request.json();

    // Validate required fields
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO qa (question, answer, category, display_order, published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [question, answer, category || null, display_order || 0, published !== false]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Q&A item created successfully',
        qa: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Q&A error:', error);
    return NextResponse.json(
      { error: 'Failed to create Q&A item' },
      { status: 500 }
    );
  }
}
