# FlashDesk (workSpace) — Backend

REST API for a coworking-space platform. Right now it covers **authentication** (register, email activation, login, refresh tokens, forgot/reset password with OTP) and **user management** (profile, roles, staff accounts, avatar upload).

**Stack:** Node.js · Express 5 · MongoDB (Mongoose) · JWT · Zod · Nodemailer · Winston

---

## What each file does

```
server.js                  Entry point: loads .env, connects to MongoDB, starts the server
src/
├── app.js                 Creates the Express app: CORS, JSON, cookies, routes, error handlers
├── config/
│   └── cookieOptions.js   Settings for the httpOnly refresh-token cookie
├── errors/
│   └── AppError.js        Custom error class (message + status code)
├── integrations/
│   ├── email.service.js   Sends emails via Gmail: activation link, reset OTP, staff invite
│   └── fileStorage.service.js  Saves/deletes uploaded images (jpg/png/webp) on disk
├── middlewares/
│   ├── authenticate.js          Checks the Bearer access token and loads the current user
│   ├── optionalAuthenticate.js  Same, but lets guests through (for public routes)
│   ├── authorize.js             Allows only certain roles (admin, support, ...)
│   ├── requirePermission.js     Allows only users with specific permissions
│   ├── checkUserOwnership.js    A user can only modify their own account
│   ├── validate.js              Validates request data against a Zod schema
│   ├── uploadMemory.js          Multer config for image uploads (type + size limits)
│   ├── rateLimit.js             Limits forgot-password and OTP attempts
│   ├── catchAsync.js            Wraps async controllers so errors reach the error handler
│   ├── notFound.js              404 for unknown routes
│   └── globalErrorHandler.js    Turns any error into a clean JSON response
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js       Auth endpoints
│   │   ├── auth.controller.js   Logic for each auth endpoint
│   │   ├── auth.service.js      Create / rotate / revoke refresh tokens
│   │   ├── auth.validation.js   Zod schema for registration
│   │   └── models/              Mongo models: refresh token, email-verification token,
│   │                            password-reset token (all auto-expire)
│   └── users/
│       ├── users.routes.js      User endpoints
│       ├── users.controller.js  Logic: list, get, me, update, delete, create staff
│       ├── users.model.js       User schema (name, email, passwordHash, role, avatar, ...)
│       └── users.validation.js  Zod schema for creating staff
└── utils/
    ├── generateJWT.js     Creates the 15-minute access token
    ├── hash.js            SHA-256 hashing + random token / 6-digit OTP generators
    ├── roles.js           List of roles: customer, owner, staff, support, moderator, admin, super_admin
    ├── sanitizeUser.js    Removes sensitive fields (password hash) before sending a user
    ├── validations.js     Small helpers (Gmail check, password strength, Mongo ID check)
    ├── httpStateText.js   HTTP status code → text
    └── logger.js          Winston logger (console + files in /logs)
logs/                      Log files written at runtime
```

## API endpoints

Base URL: `/api/v1` · Health check: `GET /health`

**Auth** (`/auth`)

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create an account (optional `avatar` image) and send an activation email |
| GET | `/activate-account?token=...` | Activate the account from the email link |
| POST | `/login` | Returns an access token + sets the refresh cookie |
| POST | `/refresh` | Issues a new access token (rotates the refresh token) |
| POST | `/logout` | Logs out the current session |
| POST | `/logout-all` | Logs out from all devices |
| POST | `/forgot-password` | Sends a 6-digit OTP to the email |
| POST | `/verify-reset-otp` | Checks the OTP and returns a reset token |
| POST | `/reset-password` | Sets a new password using the reset token |

**Users** (`/users`) — all require login

| Method | Path | Who |
|---|---|---|
| GET | `/me` | Any logged-in user |
| GET | `/` | admin, super_admin, support |
| GET | `/:id` | admin, super_admin, support |
| PATCH | `/:id` | The user themself |
| DELETE | `/:id` | The user themself |
| POST | `/staff` | admin, super_admin (creates owner / support / moderator and emails an invite) |

---

## How to run

**Requirements:** Node.js 18+, a MongoDB database (local or MongoDB Atlas), and a Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for sending emails.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```env
   PORT_NUMBER=4000
   MONGO_URI=mongodb://127.0.0.1:27017/workspace
   JWT_ACCESS_SECRET=put_a_long_random_string_here
   CLIENT_URL=http://localhost:5173
   SERVER_URL=http://localhost:4000
   EMAIL_USER=your_email@gmail.com
   EMAIL_APP_PASSWORD=your_gmail_app_password
   NODE_ENV=development
   # Optional
   # LOG_LEVEL=debug
   # UPLOADS_DIR=uploads
   ```

3. Start the server:
   ```bash
   npm start
   ```
   You should see `MongoDB Connected` and `Server is running on port 4000`.

4. Check it works: open http://localhost:4000/health → `{"status":"OK"}`

> Use port **4000** so it matches the frontend's default proxy. Run the frontend from the `frontend` repo (see its README).
