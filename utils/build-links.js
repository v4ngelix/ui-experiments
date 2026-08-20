const fs = require("fs");
const path = require("path");

const EXPERIMENTS_DIR = path.join(__dirname, "../experiments");
const OUTPUT_FILE = path.join(__dirname, "../experiments.json");
const MEDIA_TYPES = {
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".gif": "image",
  ".webp": "image",
  ".avif": "image",
  ".webm": "video",
  ".mp4": "video",
};

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

/** List the media files inside an experiment's inspiration directory. */
function findInspiration(dir) {
  const inspirationPath = path.join(EXPERIMENTS_DIR, dir, "inspiration");
  if (!fs.existsSync(inspirationPath)) return [];

  return fs
    .readdirSync(inspirationPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort()
    .map((file) => ({ file, type: MEDIA_TYPES[path.extname(file).toLowerCase()] }))
    .filter((entry) => entry.type);
}

function generate() {
  const entries = fs
    .readdirSync(EXPERIMENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const experiments = [];

  for (const dir of entries) {
    const indexPath = path.join(EXPERIMENTS_DIR, dir, "index.html");
    if (!fs.existsSync(indexPath)) continue;

    const html = fs.readFileSync(indexPath, "utf8");
    const inspiration = findInspiration(dir);

    experiments.push({
      url: `experiments/${dir}`,
      title: extractTitle(html) || dir,
      ...(inspiration.length ? { inspiration } : {}),
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(experiments, null, 2) + "\n");
  console.log(`Wrote ${experiments.length} experiments to ${OUTPUT_FILE}`);
}

generate();
