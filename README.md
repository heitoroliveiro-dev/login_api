# Login API

Study project for building an authentication backend with Node.js, Express, MongoDB, JWT, and automated tests.

## Features

- Register users with input validation and password hashing.
- Login users with credential verification and JWT generation.
- Logout endpoint (client-side token discard model).
- Protected route using JWT middleware.
- MongoDB connection registry using Mongoose.
- Integration tests for critical auth edge cases.

## Stack

- Node.js (CommonJS)
- Express 5
- MongoDB + Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- cors
- Jest + Supertest
- nodemon

## Project Structure

```
backend/
    index.js
    package.json
    src/
        app.js
        config/
            database.js
        controllers/
            userController.js
        middleware/
            userMiddleware.js
        models/
            User.js
        routes/
            userRoutes.js
    tests/
        auth.test.js
```

## Environment Variables

Create backend/.env with at least:

```dotenv
PORT=3333
JWT_SECRET=change_this_to_a_strong_secret
JWT_EXPIRES_IN=1d
MONGO_URI_AUTH=mongodb+srv://<user>:<password>@<cluster>/<database>?appName=loginService
```

Important:

- Include a database name in MONGO_URI_AUTH (the /<database> part), otherwise MongoDB may default to test.
- Do not commit real credentials.

## Setup

From backend:

```bash
npm install
```

## Scripts

From backend:

```bash
npm run dev
```

Starts nodemon and reloads on file changes.

```bash
npm start
```

Starts the server normally.

```bash
npm test
```

Runs Jest integration tests.

## API Endpoints

Base path: /api/auth

1. POST /register

Request body:

```json
{
    "name": "Heitor",
    "email": "heitor@mail.com",
    "password": "123456"
}
```

Success: 201 Created

Edge cases:

- 400 for missing fields, invalid email format, or short password.
- 409 for duplicate email.

2. POST /login

Request body:

```json
{
    "email": "heitor@mail.com",
    "password": "123456"
}
```

Success: 200 OK with JWT token and user info.

Edge cases:

- 400 for missing email/password.
- 401 for invalid credentials.

3. POST /logout

Success: 200 OK.

Note: this API uses stateless JWT; logout is client-side token discard.

4. GET /me (protected)

Requires header:

```text
Authorization: Bearer <token>
```

Success: 200 OK with decoded user payload from middleware.

Edge cases:

- 401 when token is missing.
- 401 when token is invalid or expired.

## Middleware

JWT protection is implemented in src/middleware/userMiddleware.js.

Behavior:

- Reads Authorization header.
- Verifies Bearer token using JWT_SECRET.
- Injects user data into req.user.
- Blocks unauthorized requests with 401.

## Tests

Tests are in backend/tests/auth.test.js and currently cover:

- Duplicate email on register returns 409.
- Invalid password on login returns 401.
- Invalid token on protected endpoint returns 401.

Run:

```bash
npm test
```

## Notes

- The password is hashed in a Mongoose pre-save hook in src/models/User.js.
- Server bootstrap and app setup are split (index.js and src/app.js) to make integration testing easier.

## Author

- Domingos, Heitor
