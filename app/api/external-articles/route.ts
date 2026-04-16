import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/external-articles - Get all external articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let query = 'SELECT * FROM external_articles';
    const params: any[] = [];

    if (published === 'true') {
      query += ' WHERE published = $1';
      params.push(true);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      articles: result.rows,
    });
  } catch (error) {
    console.error('Get external articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external articles' },
      { status: 500 }
    );
  }
}

// POST /api/external-articles - Create a new external article
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      image_url,
      external_link,
      publication_name,
      published_date,
      published,
    } = await request.json();

    // Validate required fields
    if (!title || !description || !external_link) {
      return NextResponse.json(
        { error: 'Title, description, and external link are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO external_articles
       (title, description, image_url, external_link, publication_name, published_date, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description,
        image_url || null,
        external_link,
        publication_name || null,
        published_date || null,
        published !== undefined ? published : true,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'External article created successfully',
        article: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create external article error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create external article';
    return NextResponse.json(
      {
        error: 'Failed to create external article',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
