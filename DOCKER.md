# Docker Development Setup

This guide explains how to run the Product Dashboard application in a Docker development container with hot-reload support.

## Prerequisites

- Docker Engine 20.10+
- Git (for cloning the repository)

## Quick Start

### Development with Hot Reload

1. **Build the development Docker image:**
   ```bash
   npm run docker:build
   # or manually:
   docker build -f Dockerfile.dev -t product-dashboard-dev .
   ```

2. **Run the development container:**
   ```bash
   npm run docker:dev
   # or manually:
   docker run -p 3000:3000 -v .:/app -v /app/node_modules product-dashboard-dev
   ```

3. **Access the application:**
   Open http://localhost:3000 in your browser

### Alternative: Simple run without volume mounting
```bash
npm run docker:run
# or manually:
docker run -p 3000:3000 product-dashboard-dev
```

## Docker Configuration

### Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to 'development' for development mode (default)
- `PORT`: Port number (default: 3000)

### Development Features

- **Hot Reload**: Code changes are automatically reflected in the running container
- **Volume Mounting**: Local code is mounted into the container for live updates
- **Node Modules Cache**: Separate volume for node_modules to improve performance
- **Node.js 20 Alpine**: Lightweight base image with latest Node.js LTS

### Container Setup

The `Dockerfile.dev` creates a development-optimized container that:
- Uses Node.js 20 Alpine for smaller image size
- Installs pnpm globally for package management
- Mounts your local code for hot-reload development
- Preserves node_modules in a Docker volume for faster builds

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Use a different port
   docker run -p 3001:3000 -v .:/app -v /app/node_modules product-dashboard-dev
   ```

2. **Build failures:**
   ```bash
   # Clean Docker cache and rebuild
   docker system prune
   npm run docker:build
   ```

3. **Permission issues (Windows):**
   ```bash
   # Make sure Docker Desktop is running with proper permissions
   # Try running PowerShell/CMD as administrator
   ```

4. **Hot reload not working:**
   ```bash
   # Ensure volume mounting is working correctly
   docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules product-dashboard-dev
   ```

### Logs and Debugging

```bash
# View container logs
docker logs <container-id>

# Interactive shell access
docker exec -it <container-id> sh

# Health check status
curl http://localhost:3000/api/health
```

### Finding Container ID
```bash
# List running containers
docker ps

# Find your container
docker ps | grep product-dashboard-dev
```

## Development Workflow

1. **Start development container:**
   ```bash
   npm run docker:dev
   ```

2. **Make code changes** - they will be reflected immediately in your browser

3. **View logs:**
   ```bash
   docker logs <container-id>
   ```

4. **Stop container:**
   ```bash
   # Press Ctrl+C in the terminal running the container
   # Or use:
   docker stop <container-id>
   ```

## Benefits of This Setup

- ✅ **Hot Reload**: Instant code changes without rebuilding
- ✅ **Consistent Environment**: Same Node.js version across all machines  
- ✅ **Easy Setup**: One command to get started
- ✅ **Isolated Dependencies**: No need to install Node.js/pnpm locally
- ✅ **Cross Platform**: Works on Windows, Mac, and Linux