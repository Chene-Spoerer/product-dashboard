#!/bin/bash

# Health Check Script for Product Dashboard
echo "🔍 Starting health checks for Product Dashboard..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (defaults to localhost for development)
BASE_URL=${BASE_URL:-"http://localhost:3000"}

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    if curl -sf "$BASE_URL$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed${NC}"
        return 1
    fi
}

# Main health check
echo "🌐 Base URL: $BASE_URL"
echo ""

# Check main health endpoint first
check_endpoint "/api/health" "Health endpoint"
health_status=$?

# Check individual API endpoints
check_endpoint "/api/products?limit=1" "Products API"
products_status=$?

check_endpoint "/api/products/categories" "Categories API"
categories_status=$?

check_endpoint "/api/products/metrics/availability" "Metrics API"
metrics_status=$?

check_endpoint "/api/products/low-stock" "Low Stock API"
lowstock_status=$?

echo ""

# Calculate overall status
total_failed=$((health_status + products_status + categories_status + metrics_status + lowstock_status))

if [ $total_failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All health checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ $total_failed health check(s) failed${NC}"
    exit 1
fi