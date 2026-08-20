An initial on an animated, rapidly changing background.<br><br>

The inspiration for this graphic was an animated GIF, but I wanted to see whether I could recreate it with HTML and CSS alone. The background is a `@keyframes` animation that swaps `background-image` between sixteen frames using `step-end` timing, so each one holds until the next replaces it.<br><br>

The first problem was loading. Every frame is a separate image, and the browser only fetches each one at the moment the animation first reaches it — so the opening loop flashed white wherever a frame hadn't arrived yet. Two things fix it:<br>
- A `&lt;link rel="preload" as="image"&gt;` for each frame, which starts all sixteen downloads while the page is still parsing.<br>
- A small script that waits for every frame to `decode()`, then adds a `ready` class to the body. The animation starts out `paused` and only runs once that class lands, so the first loop is guaranteed to be complete.<br><br>

That trades the flashing for a delay before anything moves, which is only acceptable if the frames are small. As PNGs they came to 4.4 MB in total; converting them to WebP brought that down to 688 KB, with no visible difference at the size the graphic is displayed.
