export interface AvailabilityMetrics {
  [status: string]: {
    count: number;
    percentage: number;
  };
}

export interface MetricsResponse {
  totalProducts: number;
  availabilityStatus: AvailabilityMetrics;
  lastUpdated: string;
}

export interface LowStockProduct {
  id: number;
  title: string;
  stock: number;
  category: string;
  price: number;
  availabilityStatus: string;
}

export interface LowStockResponse {
  products: LowStockProduct[];
  totalLowStockProducts: number;
  lastUpdated: string;
}