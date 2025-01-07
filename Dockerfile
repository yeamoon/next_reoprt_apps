# Step 1: Use a lightweight Node.js image
FROM node:18-alpine AS builder

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Install dependencies required for Puppeteer (Chromium)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Step 4: Set Puppeteer to skip downloading Chromium (it will use the system-installed Chromium)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Step 5: Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Step 6: Install dependencies
RUN npm install --legacy-peer-deps

# Step 7: Copy the rest of the application code
COPY . .

# Step 8: Build the application
RUN npm run build

# Step 9: Use a minimal Node.js image for production
FROM node:18-alpine AS production

# Step 10: Install Chromium again in the production stage
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Step 11: Set Puppeteer to use the system-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Step 12: Set the working directory
WORKDIR /app

# Step 13: Copy the built application from the builder stage
COPY --from=builder /app ./

# Step 14: Expose the desired port (e.g., 3000)
EXPOSE 3000

# Step 15: Start the application
CMD ["npm","run", "start"]
