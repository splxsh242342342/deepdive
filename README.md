# Deepdive

Seven prompts. The rarer your answer, the deeper you sink. Solo mode, live multiplayer rooms and a leaderboard.

- **Frontend:** `public/index.html` (single file, no build step)
- **Backend:** `server.js` (Express + WebSocket). It judges answers with the Anthropic API, scores games on the server (so scores can't be faked from the browser), runs multiplayer rooms and stores the leaderboard.
- **Questions:** `questions.json` (692 prompts). Add more by appending strings like `"Name a type of bird"`.

## Run locally

```bash
npm install
cp .env.example .env      # then put your ANTHROPIC_API_KEY in it
export $(cat .env | xargs) && npm start
```
Open http://localhost:3000. Without an API key the game still runs but uses a weak offline check (every non-gibberish answer scores the same).

## Deploy (Render, Railway, Fly.io or any Node host)

It must be a host that keeps a Node process running (WebSockets). Static-only hosts like Netlify or GitHub Pages will not work.

**Render (easiest):**
1. Push this folder to a GitHub repo.
2. New > Web Service > pick the repo. Build command `npm install`, start command `npm start`.
3. Add environment variables: `ANTHROPIC_API_KEY`, optionally `ANTHROPIC_MODEL`.
4. For a leaderboard that survives redeploys, add a persistent disk (e.g. mounted at `/data`) and set `DATA_DIR=/data`.

Put it behind HTTPS (Render and Railway do this automatically). The client switches to `wss://` on its own.

## Costs and safety

- Each answer is one small API call. Results are cached per prompt and answer, and each IP is limited to 90 answers per minute and 20 new games per minute.
- Set a monthly spend limit on your Anthropic key.
- The API key only lives on the server. Never put it in `index.html`.
- Player names are plain text, escaped in the page. There is no login: a player is an anonymous id stored in their browser.

## Scaling notes

- Leaderboard is a JSON file, fine for a small site. For lots of players, swap `scores` for SQLite or Postgres.
- Rooms live in memory on one server instance. Run a single instance (or add Redis pub/sub) before scaling horizontally.
