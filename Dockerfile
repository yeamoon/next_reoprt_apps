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

# Install `serve` to run the built app
RUN npm install -g serve

# Copy the Next.js build and production files
COPY --from=builder /app/next.config.ts ./next.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Start the app using a production server
CMD ["serve", "-s", ".next", "-l", "0.0.0.0:3000"]

