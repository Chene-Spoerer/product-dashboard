import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/products/category-list');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const categories = await response.json();
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}