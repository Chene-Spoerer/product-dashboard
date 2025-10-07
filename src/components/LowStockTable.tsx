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
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <div className="text-green-600 font-medium">Great news!</div>
                    <div>No products are currently low in stock</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
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
                      className="bg-yellow-100 text-yellow-800"
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