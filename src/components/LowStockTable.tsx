'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LowStockProduct } from '@/interfaces';
import { ShoppingCart, AlertTriangle } from 'lucide-react';

interface LowStockTableProps {
  products: LowStockProduct[];
  onProductClick: (productId: number) => void;
  onQuickOrder: (productId: number, productTitle: string) => void;
}

export function LowStockTable({ products, onProductClick, onQuickOrder }: LowStockTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockUrgency = (stock: number) => {
    if (stock <= 3) return 'text-red-600 font-bold';
    if (stock <= 5) return 'text-orange-600 font-semibold';
    return 'text-yellow-600';
  };

  const getAvailabilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out of stock':
        return 'bg-red-100 text-red-800';
      case 'low stock':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-orange-600">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Products requiring immediate attention</span>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <div className="text-green-600 font-medium">Great news!</div>
                    <div>No products are currently low in stock</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="p-2">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
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
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{ display: product.thumbnail ? 'none' : 'flex' }}>
                        No Image
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-semibold">{product.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={getStockUrgency(product.stock)}>
                        {product.stock} units
                      </span>
                      {product.stock <= 3 && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={getAvailabilityColor(product.availabilityStatus)}
                      variant="outline"
                    >
                      {product.availabilityStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onProductClick(product.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onQuickOrder(product.id, product.title)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Quick Order
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}