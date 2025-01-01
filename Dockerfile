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

# Build the Next.js app (this will generate the static files in `out`)
RUN npm run build

# Production image for running the app
FROM node:20 AS runner
WORKDIR /app

# Install `serve` to serve the static files
RUN npm install -g serve

# Copy the Next.js static export and production files
COPY --from=builder /app/out ./out

# Expose the port
EXPOSE 3000

# Start the app using serve to serve the static files
CMD ["npx", "serve@latest", "out", "-l", "8080"]
