

## Plan: Implement Spritesheet Animation with New Character Sprite

### Problem
The current code draws the player as a single static image with no animation. You have a proper 5x3 spritesheet that needs to be used for directional walking animation.

### Spritesheet Analysis
The uploaded image is a 5-column x 3-row grid:
- **Row 0 (top)**: Walking **down** (facing camera) - 5 frames
- **Row 1 (middle)**: Walking **left/right** (side view) - 5 frames
- **Row 2 (bottom)**: Walking **up** (back view) - 5 frames

The spritesheet has a **white background** that needs to be made transparent.

### Approach: Hardcoded Frame Size (No Auto-Detection)
Instead of trying to compute frame sizes from image dimensions (which caused all previous issues), the new approach will:

1. **Copy the spritesheet** to `public/images/player-sprite.png`
2. **Measure the image once** on load, divide by exactly 5 columns and 3 rows -- no `Math.floor`, just exact division
3. **Remove the white background** using canvas pixel manipulation (same proven technique)
4. **Pre-extract all 15 frames** into individual canvases at load time, so at render time there is zero math on source rectangles -- just `drawImage(frameCanvas, dx, dy, size, size)`
5. **Animate**: cycle through columns 0-4 based on a timer when moving; show column 0 (idle) when standing still
6. **Mirror row 1** horizontally for right-facing direction instead of needing a 4th row

### Technical Details

**File changes: `public/game.html`**

- On sprite load:
  - Draw the raw image to a temporary canvas
  - Loop through all pixels: set alpha to 0 for any pixel where R, G, B are all above 230 (white removal)
  - Divide the cleaned canvas into a `frames[row][col]` 2D array of 15 small canvases, each exactly `(width/5)` x `(height/3)` pixels
- `drawPixelPlayer(ctx, x, y, t)`:
  - Pick row based on `playerDir`: down=0, left=1, right=1, up=2
  - Pick column: if moving, cycle `Math.floor(animTimer / frameDuration) % 5`; if idle, column 0
  - If direction is "right", flip horizontally using `ctx.scale(-1, 1)`
  - Draw the pre-extracted frame canvas -- no srcX/srcY math at render time
- Movement code stays the same (arrow keys / WASD update `playerDir` and `playerMoving`)

**File changes: `public/images/player-sprite.png`**
- Overwritten with the uploaded spritesheet

