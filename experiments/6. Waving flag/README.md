A full-screen lozenge-pattern background that waves gently like cloth in the wind. It's drawn with raw WebGL2 and has a pixelated retro look. No libraries, no image assets.<br><br>

- The cloth is a dense grid of triangles. The vertex shader layers three sine waves on it and makes the plane larger than the screen, so the wavy edges never show.<br>
- The fragment shader draws the pattern using the grid measured from the reference image. It is scaled like `background-size: cover`.<br>
- For the retro look, the canvas renders at 1/4 resolution (`PIXEL_SIZE`) and is scaled up with `image-rendering: pixelated`. Antialiasing is off and colour edges are hard.
