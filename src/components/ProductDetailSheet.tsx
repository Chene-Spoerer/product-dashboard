'use client';

import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Product } from '@/interfaces';
import { ShoppingCart, Package, TrendingUp, Calendar } from 'lucide-react';

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder: (productId: number, productTitle: string) => void;
}

// Dummy stock chart data - declining curve
const generateStockData = () => {
  const data = [];
  const today = new Date();
  const startStock = 100; // Start with high stock
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Create a declining curve with some natural variation
    const progress = (29 - i) / 29; // 0 to 1 progression
    const decline = startStock * (1 - progress * 0.8); // Decline to 20% of original
    const variation = (Math.random() - 0.5) * 8; // ±4 units variation
    const stock = Math.max(5, Math.floor(decline + variation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      stock: stock,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Dummy order supply history
const generateOrderHistory = () => [
  {
    id: 1,
    date: '2024-10-01',
    quantity: 100,
    supplier: 'Global Suppliers Inc.',
    status: 'Delivered',
    cost: '$1,250.00'
  },
  {
    id: 2,
    date: '2024-09-15',
    quantity: 150,
    supplier: 'Prime Supply Co.',
    status: 'Delivered',
    cost: '$1,875.00'
  },
  {
    id: 3,
    date: '2024-08-30',
    quantity: 75,
    supplier: 'Global Suppliers Inc.',
    status: 'Delivered',
    cost: '$937.50'
  },
  {
    id: 4,
    date: '2024-10-10',
    quantity: 200,
    supplier: 'Mega Supply Chain',
    status: 'Pending',
    cost: '$2,500.00'
  }
];

const chartConfig = {
  stock: {
    label: "Stock Level",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProductDetailSheet({ product, isOpen, onClose, onOrder }: ProductDetailSheetProps) {
  if (!product) return null;

  const stockData = generateStockData();
  const orderHistory = generateOrderHistory();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getAvailabilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'bg-green-100 text-green-800';
      case 'low stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out of stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-xl">{product.title}</SheetTitle>
          <SheetDescription>
            Complete product information and inventory management
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Product Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {/* Main Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm" style={{ display: product.thumbnail ? 'none' : 'flex' }}>
                      No Image
                    </div>
                  </div>
                </div>
                
                {/* Additional Images Gallery */}
                {product.images && product.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto flex-1">
                    {product.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        {image ? (
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{ display: image ? 'none' : 'flex' }}>
                          N/A
                        </div>
                      </div>
                    ))}
                    {product.images.length > 4 && (
                      <div className="w-20 h-20 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
                        +{product.images.length - 4} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Overview and Stock Chart - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Package className="h-5 w-5" />
                  <span>Product Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price</label>
                    <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Stock</label>
                    <p className={`text-xl font-bold ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} units
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="capitalize">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                    <div className="mt-1">
                      <Badge className={getAvailabilityColor(product.availabilityStatus)} variant="outline">
                        {product.availabilityStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                  <p className="text-sm mt-1 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rating</label>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">{product.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Brand</label>
                    <p className="font-medium mt-1">{product.brand || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Level Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  <span>Stock Level History (30 Days)</span>
                </CardTitle>
                <CardDescription>
                  Declining stock trend over the last month
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full overflow-hidden">
                  <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={stockData} 
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        width={undefined}
                        height={undefined}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis 
                          dataKey="displayDate" 
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          domain={['dataMin - 5', 'dataMax + 5']}
                          tick={{ fontSize: 10 }}
                          width={35}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="natural"
                          dataKey="stock"
                          stroke="#ef4444"
                          strokeWidth={2.5}
                          dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5, stroke: "#ef4444", strokeWidth: 2, fill: "#ffffff" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Supply History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Order Supply History</span>
              </CardTitle>
              <CardDescription>
                Recent supply orders and deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.quantity} units</span>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.supplier} • {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">{order.cost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => onOrder(product.id, product.title)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order Supply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}