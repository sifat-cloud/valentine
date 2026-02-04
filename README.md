# Be My Valentine 💘

Repository: https://github.com/sifat-cloud/valentine

A tiny playful static page to ask someone to be your Valentine. One button is unavoidable (No will teleport away!), and the other celebrates when clicked.

## Local preview

- Open `index.html` in a browser
- Or use a simple server for local testing:
  - Python: `python -m http.server 8000` then visit `http://localhost:8000`
  - VS Code: Use the Live Server extension

## Features

- Playful "No" button that avoids clicks
- Celebrate with a GIF and **confetti** animation when someone clicks **Yes** 🎉
- **Customize** the celebration message and GIF via the "Customize" button (saved to localStorage)

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