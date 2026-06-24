A single HTML element styled to look like a circle that fades out with a dithered, retro-print aesthetic.

The effect is built from two layers:

- A circular element with a vertical `linear-gradient` that goes from fully opaque black at the top to fully transparent at the bottom, creating a smooth fade.
- A tiled dot texture (`dot.png`) overlaid via the `::after` pseudo-element, which breaks the smooth gradient into a pattern of dots.

The goal is to recreate the look of halftone/dithered printing — the way old newspapers and comics simulated shades of grey using grids of dots — using nothing but CSS and a small repeating image, with no canvas or JavaScript.
