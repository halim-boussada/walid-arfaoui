import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '@/lib/auth';

const SETTINGS_PATH = join(process.cwd(), 'data', 'section-visibility.json');

// GET: Read section visibility settings
export async function GET() {
  try {
    const fileContent = await readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error reading section visibility settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT: Update section visibility settings
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

    // Validate that body contains settings
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Write to file
    await writeFile(SETTINGS_PATH, JSON.stringify(body, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Section visibility settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating section visibility settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
