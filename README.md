# Product Dashboard

A Next.js product management dashboard with data from DummyJSON API.

## Getting Started

You have 2 options to run this project:

### Option 1: Local Development

1. Install pnpm:
```bash
npm install -g pnpm
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

### Option 2: Docker Development

1. Build and run with Docker:
```bash
npm run docker:build
npm run docker:dev
```

---

**Both options:** Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
product-dashboard/
├── .github/
│   └── workflows/
├── public/
├── scripts/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── low-stock/
│   │   │   │   ├── metrics/
│   │   │   │
│   │   ├──
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   ├── interfaces/
│   └── lib/
```

## The Product 

This is a product dashboard designed for the supply department. The project was initiated in response to sales crashes caused by products being out of stock and not being replenished in a timely manner.

To address this issue, we are building a comprehensive product dashboard for the supply team. The MVP displays stock availability status metrics for products, categorized as in stock, low stock, and out of stock, enabling the supply team to identify items that need replenishment.

The dashboard presents a prioritized list of low stock and out of stock items, ordered from least to most stock available. Users can view product names, categories, current stock levels, and status, with options to perform actions such as viewing details and placing quick orders.

The product detail view provides comprehensive information including price, description, brand, stock level history charts, and order supply history with dates, status, and supplier information. Orders can also be placed directly from this view.

The team can access an "All Products" tab to browse different products, check their stock levels, and view details for order tracking purposes.

To enhance user experience, the dashboard includes search functionality allowing users to find products by typing keywords and selecting categories simultaneously.

The next phase involves reviewing the dashboard with the supply team and providing them access to gather feedback for future improvements.

## Technical Decisions

The project is built with Next.js and follows a clear, modular folder structure as shown above. This architecture allows for the reuse of interfaces across different API routes and components, promoting code consistency and maintainability.

The shadcn/ui library is utilized to create clean, professional-looking interfaces. This library enables rapid component development, customization, and reusability throughout the project.

Product search and category filtering are integrated into a single endpoint rather than using separate endpoints from the DummyJSON library. This approach allows users to apply multiple filters simultaneously, providing a more flexible and user-friendly experience.

## Current Limitations

- **Security**: The project lacks essential security features including authentication, session management, CORS protection, and user authorization
- **Real-time Updates**: Endpoints should refresh at regular intervals to monitor new low stock or out of stock items automatically
- **Missing Features**: Quick order functionality is not yet implemented
- **Scalability**: The absence of pagination could cause performance issues as more SKUs are added to the system
- **Error Handling**: Error handling could be significantly improved, particularly for user experience when endpoints fail
- **Missing Endpoints**: Chart data and product supply history endpoints are not yet available

## Future Improvements

The development process should begin with thorough consultation with the client (supply team) to understand their specific needs and requirements.

**Roadmap Features:**
- User authentication (login/logout)
- User profiles and role management
- Navigation menu bar
- Order tracking system
- User management capabilities

**Implementation Priority:**
1. **Security First**: Implement authentication and general security measures
2. **Deployment**: Set up production and testing environments for rapid feedback collection
3. **User Feedback**: Deliver the MVP to clients and gather feedback on functionality, UX improvements, and additional feature requests
4. **UI/UX Enhancement**: Improve branding, color schemes, margins, and optimize API call performance
5. **Feature Expansion**: Based on user feedback, implement advanced filtering, pagination, quick orders, and other requested features

The goal is to create an iterative development cycle that prioritizes user needs while maintaining system security and performance.






