import { NextResponse } from 'next/server';
import { ProductsResponse, LowStockProduct, LowStockResponse } from '@/interfaces';

export async function GET() {
  try {
    // Fetch all products from DummyJSON
    const response = await fetch('https://dummyjson.com/products?limit=0');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();
    const products = data.products;

    // Filter products with "Low Stock" availability status
    const lowStockProducts = products
      .filter(product => product.availabilityStatus === 'Low Stock')
      .map(product => ({
        id: product.id,
        title: product.title,
        stock: product.stock,
        category: product.category,
        price: product.price,
        availabilityStatus: product.availabilityStatus
      } as LowStockProduct))
      // Sort by stock from lowest to highest
      .sort((a, b) => a.stock - b.stock);

    const result: LowStockResponse = {
      products: lowStockProducts,
      totalLowStockProducts: lowStockProducts.length,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    );
  }
}