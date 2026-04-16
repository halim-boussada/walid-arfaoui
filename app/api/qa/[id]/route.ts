import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/qa/[id] - Get a single Q&A item
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      'SELECT * FROM qa WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Q&A item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      qa: result.rows[0],
    });
  } catch (error) {
    console.error('Get Q&A item error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Q&A item' },
      { status: 500 }
    );
  }
}

// PATCH /api/qa/[id] - Update a Q&A item (Admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { question, answer, category, display_order, published } = await request.json();

    let updates = [];
    let values: any[] = [];
    let paramIndex = 1;

    if (question !== undefined) {
      updates.push(`question = $${paramIndex}`);
      values.push(question);
      paramIndex++;
    }

    if (answer !== undefined) {
      updates.push(`answer = $${paramIndex}`);
      values.push(answer);
      paramIndex++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    if (display_order !== undefined) {
      updates.push(`display_order = $${paramIndex}`);
      values.push(display_order);
      paramIndex++;
    }

    if (published !== undefined) {
      updates.push(`published = $${paramIndex}`);
      values.push(published);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE qa
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Q&A item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Q&A item updated successfully',
      qa: result.rows[0],
    });
  } catch (error) {
    console.error('Update Q&A item error:', error);
    return NextResponse.json(
      { error: 'Failed to update Q&A item' },
      { status: 500 }
    );
  }
}

// DELETE /api/qa/[id] - Delete a Q&A item (Admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const result = await pool.query(
      'DELETE FROM qa WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Q&A item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Q&A item deleted successfully',
    });
  } catch (error) {
    console.error('Delete Q&A item error:', error);
    return NextResponse.json(
      { error: 'Failed to delete Q&A item' },
      { status: 500 }
    );
  }
}
