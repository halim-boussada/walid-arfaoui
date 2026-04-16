import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/blogs - List all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const limit = searchParams.get('limit');

    let query = 'SELECT * FROM blogs';
    if (publishedOnly) {
      query += ' WHERE published = true';
    }
    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }

    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      blogs: result.rows,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, slug, excerpt, content, author, image_url, published } = await request.json();

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Insert blog into database
    const result = await pool.query(
      `INSERT INTO blogs (title, slug, excerpt, content, author, image_url, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, slug, excerpt, content, author, image_url, published || false]
    );

    return NextResponse.json(
      {
        success: true,
        blog: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create blog error:', error);

    // Check for unique constraint violation (duplicate slug)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
