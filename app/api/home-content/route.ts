import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '@/lib/auth';

const HOME_CONTENT_PATH = join(process.cwd(), 'data', 'home-content.json');

// GET: Read home content
export async function GET() {
  try {
    const fileContent = await readFile(HOME_CONTENT_PATH, 'utf-8');
    const content = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error('Error reading home content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read home content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT: Update home content
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate that body contains content
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid content data' },
        { status: 400 }
      );
    }

    // Write to file
    await writeFile(HOME_CONTENT_PATH, JSON.stringify(body, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Home content updated successfully',
    });
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update home content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
