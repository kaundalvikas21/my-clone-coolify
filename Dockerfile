FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Use PM2 for better production process management
RUN npm install -g pm2

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Create a start script
RUN echo '#!/bin/bash\n\
if [ "$NODE_ENV" = "production" ]; then\n\
  echo "Starting in production mode..."\n\
  pm2-runtime start ./node_modules/.bin/next -- start\n\
else\n\
  echo "Starting in development mode..."\n\
  bun run dev\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]