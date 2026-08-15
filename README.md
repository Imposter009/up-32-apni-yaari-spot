# UP 32 — Apni Yaari Spot

An ambient always-on radio for a Lucknow street-corner chai stall. Four friends, kulhad chai, old Hindi favourites, and the hum of the city.

**Creator:** Sumit Gupta

![Apni Yaari Spot](assets/chai-backdrop_new.png)

## Features

- Illustrated Lucknow backdrop (Rumi Darwaza, Ghanta Ghar, chai adda)
- Four playlist rotations with Bollywood classics
- **Local MP3 files first**, YouTube fallback when a file is missing
- Street ambience (kettle, traffic, horns)
- PWA install support

## Quick start (local)

```bash
# Windows — double-click or run:
start.cmd

# Then open http://localhost:8080
```

> Opening `index.html` directly (`file://`) blocks YouTube embeds. Use a local server locally; **Vercel does not need `start.cmd`**.

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. No build command needed — static site
4. Music works over HTTPS automatically

## Add your own music

1. Drop `.mp3` files into `music/` (see [music/README.md](music/README.md))
2. Filenames must match the paths in `js/playlists.js`
3. If a file exists, the player uses it; otherwise it streams from YouTube

Example:

```
music/chai-baatein/chaiyya-chaiyya.mp3
```

Only upload audio you have the rights to use.

## Project structure

```
├── index.html          Main page
├── css/styles.css      Styles
├── js/
│   ├── app.js          Player logic (local + YouTube)
│   ├── playlists.js    Songs and rotations
│   └── ambient.js      Street ambience
├── music/              Your MP3 files (optional)
├── assets/             Images and icons
├── start.cmd           Local dev server (Windows)
└── server.ps1          PowerShell fallback server
```

## Playlists

| Rotation        | Vibe                          |
|-----------------|-------------------------------|
| Chai & Baatein  | Casual hits for long talks    |
| Lucknow Shaam   | Evening ghazals and soft songs|
| Purani Yaadein  | 90s Bollywood gold            |
| Adda Classics   | Timeless favourites           |

## Credits

- **Creator:** Sumit Gupta
- **Site title:** UP 32
- **Chai stall:** Apni Yaari Spot
- YouTube streams remain property of respective labels and artists

## License

Code is open for personal use. Do not commit copyrighted music you do not own.
