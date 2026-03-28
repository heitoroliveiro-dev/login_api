# Login API (Study Project)

## Project Purpose

This repository is a study project to build a login/authentication API with Node.js, Express, and MongoDB.

The main goals are:

1. Practice backend architecture for authentication.
2. Understand Mongoose connection patterns.
3. Build a clear development log to track technical learning.

## Current Stack

- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- dotenv
- bcrypt
- cors

## Current Project Status

Implemented:

1. Backend project initialized with npm.
2. Core dependencies installed.
3. Base server setup in `backend/index.js`.
4. MongoDB connection module with connection registry in `backend/src/config/database.js`.
5. Initial user schema in `backend/src/models/User.js`.

In progress:

1. Controller logic in `backend/src/controllers/userController.js`.
2. Route definitions in `backend/src/routes/userRoutes.js`.
3. Middleware logic in `backend/src/middleware/userMiddleware.js`.
4. Frontend implementation in `frontend/src`.

## Can I Use This Project?

Yes. This project is open for study and experimentation.

If you use it as a template, adjust at least:

1. Environment variables.
2. Validation rules.
3. Authentication and security strategy.
4. Error handling and logging.

## How To Run

### Requirements

1. Node.js 18+
2. npm
3. MongoDB instance (local or cloud)

### Backend Environment Setup

Create a file at `backend/.env` with at least:

```env
PORT=3000
MONGO_URI_AUTH=mongodb://127.0.0.1:27017/login_auth
```

### Install Dependencies

From the `backend` folder:

```bash
npm install
```

### Start The API

From the `backend` folder:

```bash
node index.js
```

If successful, expected logs are similar to:

```text
MongoDB is connected!!
Server is running on port 3000
```

### Quick Health Check

Open in browser or test with curl:

- `GET http://localhost:3000/`

Expected response:

```text
API is running...
```

## Development Report (Progress + Learning Register)

### 1) Environment Setup

- Initialized backend with `npm init`.
- Learned how project metadata is generated in `package.json`.

Learning notes:

- A clean setup phase helps avoid structure problems later.
- `package.json` is the central contract of a Node project.

### 2) Dependencies Installation

Installed:

```bash
npm install express mongoose bcrypt dotenv cors
```

What each dependency solves:

- `express`: HTTP server and routing layer.
- `mongoose`: ODM and database modeling.
- `bcrypt`: password hashing.
- `dotenv`: environment variable loading.
- `cors`: cross-origin request control.

Learning notes:

- Installing only what is needed keeps the project focused.
- Understanding each dependency's role helps architecture decisions.

### 3) User Schema Modeling

- Created an initial `User` schema with:
    - `name`
    - `email` (required, unique, lowercase, regex validation)
    - `password` (required, minimum length)
    - `createdAt`

Learning notes:

- Validation at schema level catches invalid data early.
- `unique` helps consistency, but should be combined with proper error handling.

### 4) Database Connection Architecture

- Implemented connection code in `backend/src/config/database.js`.
- Added a registry pattern (`getOrCreateRegistry`) to reuse the same connection.
- Used `asPromise()` to await Mongoose connection startup.

Learning notes:

- Connection reuse prevents opening unnecessary duplicate connections.
- Separation of concerns improves maintainability (`connectDB` vs `getConnection`).

### 5) Environment Variable Debugging (Important Lesson)

Observed issue:

- Mongoose reported URI type problems because `process.env.MONGO_URI_AUTH` was `undefined`.

Root cause:

- `.env` resolution depends on process working directory by default.

Applied fix:

```js
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});
```

Learning notes:

- `undefined` env vars usually indicate loading/path issues, not casting issues.
- Explicit dotenv path makes behavior deterministic across different run locations.

### 6) Async Function Behavior (Important Lesson)

Observed concept:

- Turning a function into `async` changes its return type to `Promise`.

Learning notes:

- If a function becomes `async`, callers must use `await` (or `.then`).
- Many connection bugs come from forgetting this return-type shift.

## Next Milestones

1. Implement register/login/logout controller logic.
2. Wire routes into Express app.
3. Add middleware for request validation and auth protection.
4. Add scripts to `package.json` (`dev`, `start`).
5. Add tests for auth flow and validation errors.

## Author

- Domingos, Heitor