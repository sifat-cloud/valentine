# Be My Valentine 💘

Repository: https://github.com/sifat-cloud/valentine

A tiny playful static page to ask someone to be your Valentine. One button is unavoidable (No will teleport away!), and the other celebrates when clicked.

## Local preview

- Open `index.html` in a browser
- Or use a simple server for local testing:
  - Python: `python -m http.server 8000` then visit `http://localhost:8000`
  - VS Code: Use the Live Server extension

## Features

- Playful "No" button with staged interactions: a gentle nudge, a "reconsider" dialog (with a dodging mini-No), and joyful surrender — all designed so the answer ends up as a yes ❤️
- Personality & memory: the site remembers how you treat it (counts No/Yes) and evolves: first No gets a gentle message, second No desaturates the UI, third No slows animations and changes button text; final surrender shows a gentler confetti.
- Time-Based Romance: patience is rewarded — hovering on **Yes** for 7 seconds triggers a heartbeat and a special "Soft Yes" ending; staying idle for 15s reveals a gentle note: "I was hoping you'd stay." ⏳
- Secret Yes Paths (Easter eggs): triple-click the heart, type "yes", click background while holding Space, or shake your phone to unlock unique endings. Each discovered ending is tracked in the badge. 🧩
- Confetti modes: joyful, chaotic, and gentle depending on mood.

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