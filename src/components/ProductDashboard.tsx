'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all products with search and filtering
  const fetchProducts = async (search: string = '', category: string = '') => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '0'); // Always fetch all products
      if (search.trim()) params.append('search', search.trim());
      if (category) params.append('category', category);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch static data in parallel
        const [categoriesRes, metricsRes, lowStockRes] = await Promise.all([
          fetch('/api/products/categories'),
          fetch('/api/products/metrics/availability'),
          fetch('/api/products/low-stock')
        ]);

        const categoriesData = await categoriesRes.json();
        const metricsData = await metricsRes.json();
        const lowStockData = await lowStockRes.json();

        setCategories(categoriesData.categories || []);
        setMetrics(metricsData.availabilityStatus || {});
        setLowStockProducts(lowStockData.products || []);

        // Fetch initial products
        await fetchProducts();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Refetch products when search term or category changes
  useEffect(() => {
    if (!loading) {
      fetchProducts(searchTerm, selectedCategory);
    }
  }, [searchTerm, selectedCategory]);

  // Products are already filtered by the API, but we still need to filter low stock products locally
  const filteredLowStockProducts = lowStockProducts.filter(product => {
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

  // Refresh all data
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data fresh
      const [categoriesRes, metricsRes, lowStockRes] = await Promise.all([
        fetch('/api/products/categories'),
        fetch('/api/products/metrics/availability'),
        fetch('/api/products/low-stock')
      ]);

      const categoriesData = await categoriesRes.json();
      const metricsData = await metricsRes.json();
      const lowStockData = await lowStockRes.json();

      setCategories(categoriesData.categories || []);
      setMetrics(metricsData.availabilityStatus || {});
      setLowStockProducts(lowStockData.products || []);

      // Refresh products
      await fetchProducts(searchTerm, selectedCategory);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle category selection changes
  const handleCategoryChange = (value: string) => {
    const category = value === "all" ? "" : value;
    setSelectedCategory(category);
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
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} />

      {/* Search and Filter Controls */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
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
        
      </div>

      {/* Tabs for Products and Low Stock */}
      <Tabs defaultValue="low-stock" className="w-full">
        <TabsList>
          <TabsTrigger value="low-stock">
            Low Stock 
            <Badge variant="secondary" className="ml-2">
              {filteredLowStockProducts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-products" className="space-y-4">
          <ProductsTable 
            products={products}
            onProductClick={handleProductClick}
          />
        </TabsContent>
        
        <TabsContent value="low-stock" className="space-y-4">
          <LowStockTable 
            products={filteredLowStockProducts}
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