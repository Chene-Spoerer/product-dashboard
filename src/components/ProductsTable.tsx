'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/interfaces';

interface ProductsTableProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

export function ProductsTable({ products, onProductClick }: ProductsTableProps) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No products found
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
                  <div>
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {product.description.length > 40
                        ? product.description.slice(0, 40) + '...'
                        : product.description}
                    </div>
                  </div>
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
                  <span className={`font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
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
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm">{product.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onProductClick(product.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}