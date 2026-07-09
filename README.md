# About `mahjong-website`
`mahjong-website` (pending a better name) is a website designed to manage Mahjong tournaments, handling table assignments, score calculations, and player analytics.
> **Note:** `mahjong-website` was developed for use by the University of Bath Mahjong Society. If you are not a member but are interested in the website, please contact the committee.

## Development
To run the `mahjong-website` development server, ensure you have Docker installed, then run:
```bash
docker compose up
```
The website should be available at `http://localhost:3000`.

### Tech Stack
* **Frontend:** Next.js (React + TypeScript)
* **Styling:** Tailwind CSS
* **Database:** Supabase
* **Hosting:** Vercel