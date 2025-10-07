import { NextResponse } from 'next/server';

export async function GET() {
  console.log('GET /api/health');
  
  try {
    const healthCheck = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      apis: {
        products: 'unknown' as 'healthy' | 'unhealthy' | 'error' | 'unknown',
        categories: 'unknown' as 'healthy' | 'unhealthy' | 'error' | 'unknown',
        metrics: 'unknown' as 'healthy' | 'unhealthy' | 'error' | 'unknown',
        lowStock: 'unknown' as 'healthy' | 'unhealthy' | 'error' | 'unknown'
      }
    };

    // Test internal API endpoints
    // In GitHub Actions or other CI environments, use localhost
    // In production, use the actual domain
    const baseUrl = process.env.HEALTH_CHECK_BASE_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://your-domain.com' 
                     : 'http://localhost:3000');

    try {
      // Test categories endpoint
      const categoriesRes = await fetch(`${baseUrl}/api/products/categories`);
      healthCheck.apis.categories = categoriesRes.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthCheck.apis.categories = 'error';
    }

    try {
      // Test metrics endpoint
      const metricsRes = await fetch(`${baseUrl}/api/products/metrics/availability`);
      healthCheck.apis.metrics = metricsRes.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthCheck.apis.metrics = 'error';
    }

    try {
      // Test low stock endpoint
      const lowStockRes = await fetch(`${baseUrl}/api/products/low-stock`);
      healthCheck.apis.lowStock = lowStockRes.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthCheck.apis.lowStock = 'error';
    }

    try {
      // Test products endpoint with limit
      const productsRes = await fetch(`${baseUrl}/api/products?limit=1`);
      healthCheck.apis.products = productsRes.ok ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthCheck.apis.products = 'error';
    }

    // Check if any APIs are unhealthy
    const apiStatuses = Object.values(healthCheck.apis);
    const hasUnhealthyApis = apiStatuses.includes('unhealthy') || apiStatuses.includes('error');

    if (hasUnhealthyApis) {
      healthCheck.status = 'degraded';
    }

    return NextResponse.json(healthCheck, { 
      status: hasUnhealthyApis ? 503 : 200 
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503 
    });
  }
}