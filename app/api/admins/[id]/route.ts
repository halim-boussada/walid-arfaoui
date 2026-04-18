import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admins/[id] - Get a single admin user
export async function GET(
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

    // Try to fetch with permission columns first
    let result;
    try {
      result = await pool.query(
        `SELECT id, email, role, created_at,
                can_view_dashboard, can_view_blogs, can_view_messages,
                can_view_qa, can_view_external_articles, can_view_home_content,
                can_view_appointments, can_view_admins, can_view_settings
         FROM admin_users WHERE id = $1`,
        [id]
      );
    } catch (columnError) {
      // If permission columns don't exist, fall back to basic columns
      console.log('Permission columns not found, using basic query');
      result = await pool.query(
        `SELECT id, email, role, created_at
         FROM admin_users WHERE id = $1`,
        [id]
      );

      // Add default permissions based on role
      if (result.rows.length > 0) {
        const admin = result.rows[0];
        result.rows[0] = {
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
        };
      }
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: result.rows[0],
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin' },
      { status: 500 }
    );
  }
}

// PUT /api/admins/[id] - Update an admin user's permissions
export async function PUT(
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

    // Only super admins can update permissions
    if (user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can update permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const { role, permissions } = await request.json();

    // Prevent changing your own role or permissions
    if (parseInt(id) === user.userId) {
      return NextResponse.json(
        { error: 'You cannot modify your own permissions' },
        { status: 400 }
      );
    }

    // Try to update with permission columns first
    let result;
    try {
      // Build the update query dynamically based on what's provided
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (role) {
        updates.push(`role = $${paramCount++}`);
        values.push(role);
      }

      if (permissions) {
        if (permissions.can_view_dashboard !== undefined) {
          updates.push(`can_view_dashboard = $${paramCount++}`);
          values.push(permissions.can_view_dashboard);
        }
        if (permissions.can_view_blogs !== undefined) {
          updates.push(`can_view_blogs = $${paramCount++}`);
          values.push(permissions.can_view_blogs);
        }
        if (permissions.can_view_messages !== undefined) {
          updates.push(`can_view_messages = $${paramCount++}`);
          values.push(permissions.can_view_messages);
        }
        if (permissions.can_view_qa !== undefined) {
          updates.push(`can_view_qa = $${paramCount++}`);
          values.push(permissions.can_view_qa);
        }
        if (permissions.can_view_external_articles !== undefined) {
          updates.push(`can_view_external_articles = $${paramCount++}`);
          values.push(permissions.can_view_external_articles);
        }
        if (permissions.can_view_home_content !== undefined) {
          updates.push(`can_view_home_content = $${paramCount++}`);
          values.push(permissions.can_view_home_content);
        }
        if (permissions.can_view_appointments !== undefined) {
          updates.push(`can_view_appointments = $${paramCount++}`);
          values.push(permissions.can_view_appointments);
        }
        if (permissions.can_view_admins !== undefined) {
          updates.push(`can_view_admins = $${paramCount++}`);
          values.push(permissions.can_view_admins);
        }
        if (permissions.can_view_settings !== undefined) {
          updates.push(`can_view_settings = $${paramCount++}`);
          values.push(permissions.can_view_settings);
        }
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { error: 'No updates provided' },
          { status: 400 }
        );
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      result = await pool.query(
        `UPDATE admin_users
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING id, email, role, created_at,
                   can_view_dashboard, can_view_blogs, can_view_messages,
                   can_view_qa, can_view_external_articles, can_view_home_content,
                   can_view_appointments, can_view_admins, can_view_settings`,
        values
      );
    } catch (columnError) {
      // If permission columns don't exist, only update role
      console.log('Permission columns not found, updating role only');
      if (role) {
        result = await pool.query(
          `UPDATE admin_users
           SET role = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING id, email, role, created_at`,
          [role, id]
        );

        // Add default permissions to the result
        if (result.rows.length > 0) {
          const admin = result.rows[0];
          result.rows[0] = {
            ...admin,
            ...permissions,
          };
        }
      } else {
        return NextResponse.json(
          { error: 'Database does not support permission updates yet. Please run the migration.' },
          { status: 400 }
        );
      }
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      admin: result.rows[0],
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json(
      { error: 'Failed to update admin' },
      { status: 500 }
    );
  }
}

// DELETE /api/admins/[id] - Delete an admin user
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

    // Prevent deleting yourself
    if (parseInt(id) === user.userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if this is the last admin
    const countResult = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(countResult.rows[0].count) <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM admin_users WHERE id = $1 RETURNING id, email',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
