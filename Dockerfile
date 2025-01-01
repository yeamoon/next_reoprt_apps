# Install dependencies only when needed
FROM node:20 AS dependencies
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile --legacy-peer-deps

# Build the application
FROM node:20 AS builder
WORKDIR /app

# Copy all application files
COPY . .

# Copy installed dependencies from the previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Build the Next.js app
RUN npm run build

# Production image for running the app
FROM node:20 AS runner
WORKDIR /app

# Install Next.js globally for the runner
RUN npm install -g next

# Copy the Next.js build and production files
COPY --from=builder /app/next.config.ts ./next.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Ensure node_modules are available in the runner stage
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 3000

# Start the app using Next.js in production mode
CMD ["next", "start", "-p", "3000"]
