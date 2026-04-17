import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get blog statistics
    const blogsResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN published = true THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN published = false THEN 1 ELSE 0 END) as draft
      FROM blogs`
    );

    // Get contact/message statistics
    const contactsResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as unread
      FROM contact_messages`
    );

    // Get appointment statistics
    const appointmentsResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM appointments`
    );

    // Get Q&A statistics
    const qaResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN published = true THEN 1 ELSE 0 END) as published
      FROM qa`
    );

    // Get external articles statistics
    const externalArticlesResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN published = true THEN 1 ELSE 0 END) as published
      FROM external_articles`
    );

    // Get recent activity (last 10 items across all tables)
    const recentActivityResult = await pool.query(
      `
      (SELECT 'blog' as type, title as name, created_at, published FROM blogs ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'contact' as type, name, created_at,
        CASE WHEN status != 'new' THEN true ELSE false END as published
        FROM contact_messages ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'appointment' as type, name, created_at,
        CASE WHEN status = 'confirmed' THEN true ELSE false END as published
        FROM appointments ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'qa' as type, LEFT(question, 50) as name, created_at, published FROM qa ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'external_article' as type, title as name, created_at, published FROM external_articles ORDER BY created_at DESC LIMIT 5)
      ORDER BY created_at DESC
      LIMIT 10
      `
    );

    // Get total admins
    const adminsResult = await pool.query(`SELECT COUNT(*) as total FROM admin_users`);

    // Calculate totals
    const blogs = blogsResult.rows[0] || { total: 0, published: 0, draft: 0 };
    const contacts = contactsResult.rows[0] || { total: 0, unread: 0 };
    const appointments = appointmentsResult.rows[0] || { total: 0, pending: 0, confirmed: 0, cancelled: 0 };
    const qa = qaResult.rows[0] || { total: 0, published: 0 };
    const externalArticles = externalArticlesResult.rows[0] || { total: 0, published: 0 };
    const admins = adminsResult.rows[0] || { total: 0 };

    return NextResponse.json({
      success: true,
      stats: {
        blogs: {
          total: parseInt(blogs.total) || 0,
          published: parseInt(blogs.published) || 0,
          draft: parseInt(blogs.draft) || 0,
        },
        contacts: {
          total: parseInt(contacts.total) || 0,
          unread: parseInt(contacts.unread) || 0,
          read: (parseInt(contacts.total) || 0) - (parseInt(contacts.unread) || 0),
        },
        appointments: {
          total: parseInt(appointments.total) || 0,
          pending: parseInt(appointments.pending) || 0,
          confirmed: parseInt(appointments.confirmed) || 0,
          cancelled: parseInt(appointments.cancelled) || 0,
        },
        qa: {
          total: parseInt(qa.total) || 0,
          published: parseInt(qa.published) || 0,
          draft: (parseInt(qa.total) || 0) - (parseInt(qa.published) || 0),
        },
        externalArticles: {
          total: parseInt(externalArticles.total) || 0,
          published: parseInt(externalArticles.published) || 0,
          draft: (parseInt(externalArticles.total) || 0) - (parseInt(externalArticles.published) || 0),
        },
        admins: {
          total: parseInt(admins.total) || 0,
        },
      },
      recentActivity: recentActivityResult.rows,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
