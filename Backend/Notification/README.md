# Notification Microservice

This document outlines the architecture and execution flow of the **Notification Microservice** for the Online-Market (Onkart) project.

## Overview
The Notification microservice handles the asynchronous delivery of welcome emails to new users. It is deeply integrated with a RabbitMQ message broker for reliability and scalability, decoupling the email sending process from the main user-registration flow. 

## Features
- **Message Queue Driven:** Employs RabbitMQ to consume messages from the `User_Created_Queue`.
- **Google OAuth2 Integration:** Secured via NodeMailer using Google OAuth2 to prevent SMTP authentication failures and increase email deliverability.
- **REST Health Check:** Provides an endpoint `/` to assert that the service is running appropriately.

## Technical Details

### Dependencies
- **express:** Serves as the base for the HTTP health-check endpoint.
- **amqplib:** AMQP library used to interact directly with RabbitMQ channels and queues.
- **nodemailer:** Sends emails dynamically using Gmail as the provider.
- **dotenv:** Injects API keys and sensitive tokens.

### Message Flow
1. A separate microservice creates a user and pushes `{ "email": "...", "username": "..." }` into the `User_Created_Queue`.
2. This service is connected to the same queue.
3. Upon consuming the message, the broker extracts the payload.
4. The service passes the data to `sendEmail()` inside `src/email.js`.
5. An HTML email offering a special discount is sent securely using Google Auth.

## Environment variables required
Ensure these are set in the `.env` file at the root of the notification directory:

```env
PORT=...
RABBIT_URL=...
EMAIL_USER=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
REFRESH_TOKEN=...
ACCESS_TOKEN=...
```

## Running the Service
```bash
npm start
```

## Future Recommendations
- Implement email templates (e.g. Handlebars or EJS) to uncouple HTML code from application logic.
- Add robust error handling to re-queue failed messages if the SMTP fails.
