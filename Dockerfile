# Step 1: Use an official Node.js image as the base
FROM node:18-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install --legacy-peer-deps

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Use a smaller Node.js image for the runtime environment
FROM node:18-alpine AS runner

# Step 8: Set the working directory inside the container
WORKDIR /app

# Step 9: Copy the built app and `node_modules` from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Step 10: Expose the default Next.js port
EXPOSE 3000

# Step 11: Set the default command to start the application in production
CMD ["npm", "run", "start"]
