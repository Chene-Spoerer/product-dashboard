import { NextResponse } from 'next/server';
import { ProductsResponse, AvailabilityMetrics, MetricsResponse } from '@/interfaces';

export async function GET() {
  try {
    // Fetch all products from DummyJSON
    const response = await fetch('https://dummyjson.com/products?limit=0');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();
    const products = data.products;
    const totalProducts = data.total; // Use the total from API response

    // Count products by availability status
    const statusCounts: { [status: string]: number } = {};

    products.forEach(product => {
      const status = product.availabilityStatus || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Calculate metrics with percentages
    const availabilityMetrics: AvailabilityMetrics = {};
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      availabilityMetrics[status] = {
        count,
        percentage: totalProducts > 0 ? parseFloat(((count / totalProducts) * 100).toFixed(2)) : 0
      };
    });

    const result: MetricsResponse = {
      totalProducts,
      availabilityStatus: availabilityMetrics,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching availability metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability metrics' },
      { status: 500 }
    );
  }
}