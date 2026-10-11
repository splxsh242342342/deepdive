# Deepdive

Seven prompts. The rarer your answer, the deeper you sink. Solo mode, live multiplayer rooms and a leaderboard.

- **Frontend:** `public/index.html` (single file, no build step)
- **Backend:** `server.js` (Express + WebSocket). It judges answers with the Anthropic API, scores games on the server (so scores can't be faked from the browser), runs multiplayer rooms and stores the leaderboard.
- **Storage:** the leaderboard, finished daily dives and today's answer counts live in Postgres when `DATABASE_URL` is set, otherwise in JSON files under `data/` (fine for local dev).
- **Questions:** `questions.json` (692 prompts). Add more by appending strings like `"Name a type of bird"`.

## Run locally

```bash
npm install
cp .env.example .env      # then put your GEMINI_API_KEY in it
export $(cat .env | xargs) && npm start
```
Open http://localhost:3000. Without an API key the game still runs but uses a weak offline check (every non-gibberish answer scores the same).

## Deploy (Render, Railway, Fly.io or any Node host)

It must be a host that keeps a Node process running (WebSockets). Static-only hosts like Netlify or GitHub Pages will not work.

**Render (easiest):**
1. Push this folder to a GitHub repo.
2. New > Web Service > pick the repo. Build command `npm install`, start command `npm start`.
3. Add environment variables: `GEMINI_API_KEY` (free key from https://aistudio.google.com/apikey, no card) or `ANTHROPIC_API_KEY` (paid). Optionally `GEMINI_MODEL` / `ANTHROPIC_MODEL`.
4. For a leaderboard that survives redeploys and restarts, add a free Postgres database (Render's free disk is wiped on every deploy):
   - Sign up at https://neon.tech (free, no card) and create a project. On the project dashboard click **Connect** and copy the connection string (`postgresql://...neon.tech/neondb?sslmode=require...`).
   - In Render, open the service > **Environment** > add `DATABASE_URL` with that string, and save. Render redeploys.
   - The server creates its two tables (`deepdive_scores`, `deepdive_counts`) on first boot. The start log says `scores in Postgres`. If the database can't be reached at boot the server exits instead of starting with an empty leaderboard, so a broken deploy never replaces a working one.
   - Any other Postgres works too (Supabase, your own). Avoid Render's free Postgres: it is deleted after 30 days. Neon's free tier sleeps when idle; the first request after a quiet spell takes a second longer.

5. Optional: add `ADMIN_KEY` (any long random text) to see which prompts players report at `/api/reports?key=YOUR_ADMIN_KEY`. Prompts reported 3+ times leave practice and multiplayer automatically.
6. Optional, to avoid the ~30 second wake-up after the free server sleeps: create a free monitor at https://uptimerobot.com (or https://cron-job.org) that opens `https://YOUR-SITE/api/health` every 10 minutes. Render's free plan includes enough hours to stay awake all month for one service.

Put it behind HTTPS (Render and Railway do this automatically). The client switches to `wss://` on its own.

## Costs and safety

- The Gemini free tier is rate limited (roughly 10 requests per minute on some models). If it is exceeded, answers fall back to the weak offline check until the limit resets.

- Each answer is one small API call. Results are cached per prompt and answer, and each IP is limited to 90 answers per minute and 20 new games per minute.
- Set a monthly spend limit on your Anthropic key.
- The API key only lives on the server. Never put it in `index.html`.
- Player names are plain text, escaped in the page. There is no login: a player is an anonymous id stored in their browser.

## Scaling notes

- Scores are loaded into memory at boot and written back at most once a second (and on shutdown), one row per player. That is fine for thousands of players; past that, query the leaderboard from Postgres instead of holding it all in memory.
- Rooms live in memory on one server instance. Run a single instance (or add Redis pub/sub) before scaling horizontally.
