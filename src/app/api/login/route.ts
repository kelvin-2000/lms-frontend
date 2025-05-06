import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(`Login attempt for email: ${body.email}`);
    console.log(`API URL: ${API_BASE_URL}/api/login`);

    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`Login response status: ${response.status}`);
    const data = await response.json();
    console.log('Login response data:', data);

    if (!response.ok) {
      // Return the actual error message from the backend
      console.error(`Login failed with status ${response.status}:`, data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log('Login successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      {
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
