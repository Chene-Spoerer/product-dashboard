import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/interfaces';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate that ID is provided and is a number
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID provided' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://dummyjson.com/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product = await response.json();
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}