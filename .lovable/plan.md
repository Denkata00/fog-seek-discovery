
## Remove YouTube Video Intro Completely

Three sections in `public/game.html` need to be deleted:

### 1. CSS Block (lines 225–270)
Remove the entire `/* ===== YOUTUBE INTRO ===== */` CSS section — all styles for `#yt-overlay`, `.yt-label`, `.yt-title`, `.yt-artist`, `.yt-frame-wrap`, `.yt-skip`, `.yt-skip-hint`, and `.yt-countdown`.

### 2. HTML Block (lines 338–354)
Remove the `<!-- ===== YOUTUBE INTRO ===== -->` comment and the full `<div id="yt-overlay">` element including the iframe and countdown div.

### 3. JavaScript Block (lines 404–428)
Remove the `// YOUTUBE INTRO` comment block and the entire IIFE — the `closeYT()` function, the countdown interval (`setInterval`), and all references to `ytOverlay`, `ytIframe`, and `ytCountdown`.

### Result
The game will open directly to the Start Screen ("FOG & SEEK") with no overlay, no network request to YouTube, and no countdown. Everything else — movement, fog, NPCs, win/loss screens — remains untouched.
