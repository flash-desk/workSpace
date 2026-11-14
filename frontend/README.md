# FlashDesk (workSpace) — Frontend

Web client for the FlashDesk coworking platform. It currently includes the full **authentication flow**: sign up, email activation, sign in, forgot password with OTP, reset password, and a protected dashboard.

**Stack:** React 18 · Vite · React Router · Axios · Bootstrap / React-Bootstrap

---

## What each file does

```
index.html                 Page shell (fonts + the #root div)
vite.config.js             Vite setup + proxy: forwards /api requests to the backend
public/assets/logo.png     App logo
src/
├── main.jsx               App entry: wraps the app with Router and AuthProvider
├── App.jsx                All the routes of the app
├── styles.css             Global custom styles
├── api/
│   ├── client.js          Axios instance: attaches the access token, auto-refreshes it on 401
│   └── auth.js            Functions that call the auth endpoints (login, register, OTP, ...)
├── context/
│   └── AuthContext.jsx    Holds the logged-in user; restores the session on page load; login/logout
├── pages/
│   ├── SignIn.jsx           Login page
│   ├── SignUp.jsx           Registration page
│   ├── CheckEmail.jsx       "Check your inbox" screen after signing up
│   ├── ActivateAccount.jsx  Activates the account from the email link
│   ├── ForgotPassword.jsx   Enter email to receive a reset code
│   ├── VerifyOtp.jsx        Enter the 6-digit code
│   ├── ResetPassword.jsx    Choose a new password
│   ├── ResetSuccess.jsx     Password changed confirmation
│   └── Dashboard.jsx        Protected page: shows the user's name, email, role + sign out
└── components/
    ├── AuthLayout.jsx       Shared layout for auth pages (top bar + hero panel + card)
    ├── TopNav.jsx           Top navigation bar
    ├── HeroPanel.jsx        Left-side marketing panel
    ├── ProtectedRoute.jsx   Redirects to /login if the user isn't signed in
    ├── PasswordInput.jsx    Password field with show/hide
    ├── PasswordRules.jsx    Password strength + rules checklist
    ├── FormAlert.jsx        Error / success message box
    ├── GoogleButton.jsx     "Continue with Google" button (UI only for now)
    ├── Logo.jsx, Divider.jsx, Spinner.jsx   Small UI pieces
```

## Pages / routes

| Route | Page |
|---|---|
| `/login` | Sign in |
| `/register` | Sign up |
| `/check-email` | Check your email |
| `/activate-account?token=...` | Account activation |
| `/forgot-password` → `/verify-otp` → `/reset-password` → `/reset-success` | Password reset flow |
| `/dashboard` | Protected dashboard |

How login works: the access token is kept in memory only, and the refresh token lives in an httpOnly cookie. When the access token expires, the app refreshes it automatically.

---

## How to run

**Requirements:** Node.js 18+ and the **backend running** (see the backend README).

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) If your backend is **not** on `http://127.0.0.1:4000`, create a `.env` file:
   ```env
   VITE_API_TARGET=http://127.0.0.1:4000
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

4. Build for production (optional):
   ```bash
   npm run build
   npm run preview
   ```

> Make sure the backend's `CLIENT_URL` is set to `http://localhost:5173`, otherwise CORS and the email links won't work.
