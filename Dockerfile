FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package.json ./
COPY bun.lockb ./ 

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN bun run build

# Expose the port your app runs on
EXPOSE 3000

# Set the NODE_ENV environment variable
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "start"]