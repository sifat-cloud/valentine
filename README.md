# Valentine — Revamp

A redesigned, emotional Valentine page that respects the user's feelings. The site remembers interactions and evolves: pressing **No** makes the site quietly sad (copy, tone, and visuals), while **Yes** heals it with a heartfelt celebration.

## What changed

- A simpler, elegant layout with a central beating heart and clear Yes/No actions.
- Emotional states: every **No** increases sadness (gentle messages, desaturation, slower animations). The site only recovers after **Yes**.
- Customization: user can set the Yes message and GIF; sound toggle (off by default).
- Subtle mechanics: idle message for patience, soft confetti, and emotional audio cues.

## Local preview

- Open `index.html` in a browser
- Or run: `python -m http.server 8000` and open `http://localhost:8000`

## Deploy

- Push branch and create a PR when ready. Deploy to Vercel by connecting the GitHub repo and importing the project (no build step required for this static site).

---

If you want, I can:
- Add more endings and hidden paths (secret keys, shakes)
- Add small music and refined audio experience
- Replace GIFs with your own assets

Tell me which extras to add next.
## Publish to GitHub

1. Initialize repo locally:
   ```bash
   git init
   git add .
   git commit -m "Initial valentine page"
   ```
2. Create a new repository on GitHub and follow the instructions to push your local repo to GitHub.

## Deploy to Vercel

1. Create an account at https://vercel.com and connect your GitHub account.
2. Import the new repository and choose the project. For a static site, Vercel usually detects it automatically. Use "Other" framework if prompted and leave build command empty.
3. Deploy — Vercel will provide a public URL.

Have fun and feel free to customize the message, colors, and GIF. ❤️