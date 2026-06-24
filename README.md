# Onkart Microservices Platform

Welcome to **Onkart**, a scalable and robust e-commerce platform built using a microservices architecture. This project leverages Node.js, Express, MongoDB, Redis, and RabbitMQ to provide a seamless shopping experience.

---

## 🏗️ Architecture Overview

The backend is composed of several independent microservices communicating via HTTP and Message Queues (RabbitMQ). All client requests are routed through a central API Gateway.

### Services:
- **API Gateway**: The central entry point (Port `5000`) that proxies requests to the appropriate microservices and hosts the centralized API documentation.
- **Auth Service**: Handles user registration, authentication, JWT generation, and profile management.
- **Product Service**: Manages the product catalog, inventory, and details.
- **Cart Service**: Manages user shopping carts.
- **Order Service**: Handles order creation and lifecycle management.
- **Payment Service**: Processes transactions and payment integrations.
- **Recommendation Service**: Provides personalized product recommendations using Redis caching.
- **Notification Service**: Handles real-time notifications (e.g., WebSockets, emails).
- **Seller Service**: Dedicated portal for sellers to manage their inventory.
- **Ai-Buddy**: AI-powered assistant for customer support.
- **Frontend**: A React application built with Vite (Port `5173`).

---

## 🚀 Getting Started

The easiest way to run the entire stack locally is by using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js (if running locally without Docker).

### Running with Docker Compose
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Mega_project1/Backend
   ```
2. Start all services:
   ```bash
   docker-compose up --build
   ```
3. Once the containers are up, the services will be accessible at:
   - **Frontend**: `http://localhost:5173`
   - **API Gateway**: `http://localhost:5000`
   - **RabbitMQ Dashboard**: `http://localhost:15672` (guest/guest)

---

## 📚 API Documentation

> 💡 **Interactive Docs**: When the API Gateway is running, you can access the interactive Swagger UI at `http://localhost:5000/api-docs`.

Below is the documentation for the currently exposed endpoints.

### Users / Auth (`/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/user/register` | Register a new user | ❌ |
| `POST` | `/user/login` | Login user and get token | ❌ |
| `GET` | `/user/me` | Get current user profile | ✅ (Bearer) |
| `GET` / `POST` | `/user/logout` | Logout user | ✅ (Bearer) |

#### 1. Register User (`POST /user/register`)
Creates a new user account.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```
**Responses:**
- `201 Created`: User registered successfully.
- `400 Bad Request`: Validation error or user already exists.

#### 2. Login User (`POST /user/login`)
Authenticates a user and returns a token.

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
**Responses:**
- `200 OK`: User logged in successfully (returns JWT token).
- `401 Unauthorized`: Invalid credentials.

#### 3. Get Current User (`GET /user/me`)
Retrieves the profile data of the currently authenticated user.

**Headers:**
- `Authorization`: `Bearer <token>`

**Responses:**
- `200 OK`: Returns the user object.
- `401 Unauthorized`: Token is missing or invalid.

#### 4. Logout User (`GET /user/logout` or `POST /user/logout`)
Logs out the currently authenticated user.

**Headers:**
- `Authorization`: `Bearer <token>`

**Responses:**
- `200 OK`: User logged out successfully.

---

*(Note: Documentation for Product, Cart, Order, and other services will be added here as they are integrated into the Swagger spec).*
