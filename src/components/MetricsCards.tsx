'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvailabilityMetrics } from '@/interfaces';

interface MetricsCardsProps {
  metrics: AvailabilityMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'bg-green-500';
      case 'low stock':
        return 'bg-yellow-500';
      case 'out of stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'default';
      case 'low stock':
        return 'secondary';
      case 'out of stock':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(metrics).map(([status, data]) => (
        <Card key={status}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize">
              {status}
            </CardTitle>
            <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.count}</div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(status)}>
                {data.percentage}%
              </Badge>
              <p className="text-xs text-muted-foreground">
                of total products
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}