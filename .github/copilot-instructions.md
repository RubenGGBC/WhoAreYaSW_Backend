# Copilot Instructions for WhoAreYa Backend

## Project Overview
- **Type:** Node.js/Express backend for a sports guessing game with OAuth (Google/GitHub) and session-based authentication.
- **Data:** Uses MongoDB via Mongoose. Data models for Player, Team, League, Solution, Stats, User.
- **Frontend:** Served from `public/` (EJS views, static assets).

## Key Architecture & Patterns
- **Entry point:** `server.js` (loads `src/app.js`)
- **App config:** `src/app.js` (Express setup, middleware, routes)
- **Routes:**
  - `src/routes/` (split by domain: `authRoutes.js`, `gameRoutes.js`, etc.)
  - Controllers in `src/controllers/` (one per route group)
- **Models:** `src/models/` (Mongoose schemas)
- **DB Connection:** `src/db/connection.js`
- **OAuth:**
  - Passport strategies in `src/config/passport.js`
  - OAuth routes/controllers: `src/controllers/oauth*`, `src/routes/oauthRoutes.js`
- **Session & Auth:**
  - Session config: `src/config/multer.js`, `express-session`, `connect-mongo`
  - Auth middleware: `src/middlewares/authMiddleware.js`

## Developer Workflows
- **Start server:** `npm start` (prod), `npm run dev` (nodemon)
- **Seed DB:** `npm run seed` (runs both player and solution seeders)
- **Run tests:**
  - All: `npm test`
  - Unit: `npm run test:unit`
  - Integration: `npm run test:integration`
  - Watch: `npm run test:watch`
- **Test config:**
  - Jest config: `jest.config.js` (uses `tests/setup.js`)
  - Coverage: output in `coverage/`

## Project Conventions
- **Controllers:** Thin, logic in services/models when possible
- **Routes:** Grouped by domain, RESTful naming
- **Models:** All in `src/models/`, use Mongoose
- **Views:** EJS in `views/`, static in `public/`
- **Env config:** Use `.env` for secrets (see README for required vars)
- **OAuth:**
  - User model fields: `isOAuthUser`, `oauthProvider`, `oauthId`
  - See README for provider setup

## Integration Points
- **External APIs:** Google/GitHub OAuth
- **Session store:** MongoDB via `connect-mongo`
- **Testing:** Uses `mongodb-memory-server` for isolated tests

## Examples
- Add a new route: create in `src/routes/`, controller in `src/controllers/`, register in `src/app.js`
- Add a new model: create in `src/models/`, import in relevant controller
- Add OAuth provider: update `src/config/passport.js`, add env vars, update User model if needed

## References
- See `README.md` for OAuth setup, environment variables, and milestone documentation.
- See `jest.config.js` and `package.json` for scripts and test setup.

---
**Keep instructions concise and up-to-date. Update this file if project structure or conventions change.**
