A pure CSS spinner to have as lightweight loading indicator as possible, without any lag due to the assets being loading.<br><br>

The ring is a single empty element, drawn by two properties:<br>
- A `conic-gradient` background that sweeps from 75% black through 25% black to transparent, giving the trailing tail that makes the rotation readable.<br>
- A `radial-gradient` used as a `mask`, transparent everywhere except the outermost `.1rem`, which punches out the middle of the square and leaves only the ring.<br><br>

Masking rather than using a `border` means the tail can fade all the way to transparent — a bordered circle can only vary colour per side, not along the sweep.
