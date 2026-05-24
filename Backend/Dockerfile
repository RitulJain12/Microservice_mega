FROM node:18-alpine

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /usr/src/app

# Copy the entire git repository (Backend + frontend)
COPY . .

# Build the frontend static assets
RUN cd frontend && npm install && npm run build

# Change working directory to Backend for backend installations and PM2
WORKDIR /usr/src/app/Backend

# Install dependencies for each backend microservice
RUN cd auth && npm install --omit=dev
RUN cd Product-service && npm install --omit=dev
RUN cd Cart && npm install --omit=dev
RUN cd order && npm install --omit=dev
RUN cd Payment && npm install --omit=dev
RUN cd Notification && npm install --omit=dev
RUN cd Recommendation-service && npm install --omit=dev
RUN cd Seller && npm install --omit=dev
RUN cd Ai-buddy && npm install --omit=dev
RUN cd apigateway && npm install --omit=dev

# Expose port 5000 (which is the default port for the API Gateway)
# Render/Railway will map the public traffic to the PORT environment variable.
EXPOSE 5000

# Run all microservices simultaneously using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
