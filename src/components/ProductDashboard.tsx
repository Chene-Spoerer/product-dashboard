'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MetricsCards } from './MetricsCards';
import { ProductsTable } from './ProductsTable';
import { LowStockTable } from './LowStockTable';
import { ProductDetailSheet } from './ProductDetailSheet';
import { Product, LowStockProduct, AvailabilityMetrics } from '@/interfaces';

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<AvailabilityMetrics>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [productsRes, categoriesRes, metricsRes, lowStockRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/products/categories'),
          fetch('/api/products/metrics/availability'),
          fetch('/api/products/low-stock')
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const metricsData = await metricsRes.json();
        const lowStockData = await lowStockRes.json();

        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
        setMetrics(metricsData.availabilityStatus || {});
        setLowStockProducts(lowStockData.products || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      setSelectedProduct(product);
      setIsSheetOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleQuickOrder = (productId: number, productTitle: string) => {
    console.log(`Quick order placed for product ${productId}: ${productTitle}`);
    // Here you would typically call an API to place the order
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and track product availability</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Search and Filter Controls */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for Products and Low Stock */}
      <Tabs defaultValue="all-products" className="w-full">
        <TabsList>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock 
            <Badge variant="secondary" className="ml-2">
              {lowStockProducts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-products" className="space-y-4">
          <ProductsTable 
            products={filteredProducts}
            onProductClick={handleProductClick}
          />
        </TabsContent>
        
        <TabsContent value="low-stock" className="space-y-4">
          <LowStockTable 
            products={lowStockProducts}
            onProductClick={handleProductClick}
            onQuickOrder={handleQuickOrder}
          />
        </TabsContent>
      </Tabs>

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onOrder={handleQuickOrder}
      />
    </div>
  );
}