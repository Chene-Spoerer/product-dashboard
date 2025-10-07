import { NextRequest, NextResponse } from 'next/server';
import { ProductsResponse } from '@/interfaces';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const limitParam = searchParams.get('limit') || '30';
    const skipParam = searchParams.get('skip') || '0';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const limit = parseInt(limitParam, 10);
    const skip = parseInt(skipParam, 10);

    // Fetch all products first (we need to get enough to filter and paginate)
    // DummyJSON has about 194 products, so we'll fetch all of them
    const response = await fetch('https://dummyjson.com/products?limit=0');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const allData: ProductsResponse = await response.json();
    let filteredProducts = allData.products;

    // Apply category filter if provided
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter if provided (search in title)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate total after filtering
    const total = filteredProducts.length;

    // Apply pagination - if limit is 0, return all filtered products
    const paginatedProducts = limit === 0 ? filteredProducts : filteredProducts.slice(skip, skip + limit);

    // Return the filtered and paginated results
    const result: ProductsResponse = {
      products: paginatedProducts,
      total,
      skip,
      limit
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}