const fs = require("fs");
const path = require("path");

const EXPERIMENTS_DIR = path.join(__dirname, "../experiments");
const OUTPUT_FILE = path.join(__dirname, "../experiments.json");

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
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

    experiments.push({
      url: `experiments/${dir}`,
      title: extractTitle(html) || dir,
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(experiments, null, 2) + "\n");
  console.log(`Wrote ${experiments.length} experiments to ${OUTPUT_FILE}`);
}

generate();
