import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    // Build the query string for the backend API
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (location) queryParams.append('location', location);
    if (search) queryParams.append('search', search);

    const response = await fetch(
      `${API_BASE_URL}/api/events/upcoming?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
