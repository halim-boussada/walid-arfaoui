import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/external-articles/[id] - Get a single external article
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      'SELECT * FROM external_articles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'External article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article: result.rows[0],
    });
  } catch (error) {
    console.error('Get external article error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external article' },
      { status: 500 }
    );
  }
}

// PUT /api/external-articles/[id] - Update an external article
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
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
      `UPDATE external_articles
       SET title = $1,
           description = $2,
           image_url = $3,
           external_link = $4,
           publication_name = $5,
           published_date = $6,
           published = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        title,
        description,
        image_url || null,
        external_link,
        publication_name || null,
        published_date || null,
        published !== undefined ? published : true,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'External article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'External article updated successfully',
      article: result.rows[0],
    });
  } catch (error) {
    console.error('Update external article error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update external article';
    return NextResponse.json(
      {
        error: 'Failed to update external article',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/external-articles/[id] - Delete an external article
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const result = await pool.query(
      'DELETE FROM external_articles WHERE id = $1 RETURNING id, title',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'External article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'External article deleted successfully',
    });
  } catch (error) {
    console.error('Delete external article error:', error);
    return NextResponse.json(
      { error: 'Failed to delete external article' },
      { status: 500 }
    );
  }
}
