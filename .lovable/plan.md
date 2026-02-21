
# Replace Player with Spritesheet Character

## Overview
Replace the procedurally drawn player character with the uploaded spritesheet image. The spritesheet has a 5x3 grid layout with directional walking animations.

## Spritesheet Layout
- **Row 1 (5 frames)**: Front-facing walk cycle (walking down)
- **Row 2 (5 frames)**: Side-facing walk cycle (walking left/right -- flip horizontally for opposite direction)
- **Row 3 (5 frames)**: Back-facing walk cycle (walking up)

## Steps

1. **Copy the spritesheet** into `public/images/player-sprite.png` so it can be referenced directly in `game.html`.

2. **Load the sprite image** at the top of the game script in `public/game.html`:
   - Create an `Image()` object pointing to `images/player-sprite.png`
   - Calculate frame dimensions by dividing the image width by 5 (columns) and height by 3 (rows)

3. **Track player direction**: Add a variable to track the last movement direction (down, left, right, up) so we know which spritesheet row to use.

4. **Replace `drawPixelPlayer` function**: Instead of drawing rectangles, use `ctx.drawImage()` with spritesheet clipping:
   - Pick the row based on direction (0 = down, 1 = side, 2 = up)
   - Cycle through the 5 frames based on a timer when moving; show frame 0 (idle) when standing still
   - For right-facing movement, flip the canvas horizontally using `ctx.scale(-1, 1)`
   - Scale the sprite to roughly 32x32px to match the tile grid

5. **Update the game loop** where player movement is handled to set the direction variable based on which keys are pressed.

## Technical Details
- Frame selection: `frameIndex = isMoving ? Math.floor(time * 8) % 5 : 0`
- Row selection: `row = direction === 'down' ? 0 : direction === 'up' ? 2 : 1`
- For "right" direction: draw row 1 but with `ctx.scale(-1, 1)` to mirror the side-facing frames
- Sprite draw size: approximately 32x32px centered on the player position
- The existing glow and shadow effects beneath the player will be kept for visual consistency
