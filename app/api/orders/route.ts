// API route for submitting order simulation
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Simulate order logic here
  return NextResponse.json({ result: 'Order simulated', data });
}
