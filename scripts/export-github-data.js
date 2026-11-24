import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const SRC_DATA_DIR = path.join(ROOT_DIR, "src", "data");
const OUTPUT_DIR = path.join(ROOT_DIR, "github-repo-data");
const OUTPUT_DATA_DIR = path.join(OUTPUT_DIR, "data");

const CATEGORY_META = {
  html: {
    name: "HTML & HTML5",
    description: "Veb sahifa tuzilishi va semantik teglar",
    order: 0,
  },
  css: {
    name: "CSS & CSS3",
    description: "Stillar, Flexbox, Grid va animatsiyalar",
    order: 1,
  },
  html_css: {
    name: "HTML & CSS",
    description: "HTML va CSS bo'yicha kompleks amaliy testlar",
    order: 2,
  },
  js: {
    name: "JavaScript",
    description: "Dasturlash asoslari, ma'lumot turlari va obyektlar",
    order: 3,
  },
  ux_ui: {
    name: "UX/UI Dizayn",
    description: "Foydalanuvchi tajribasi, Wireframe, Tipografiya va Figma",
    order: 4,
  },
};

const DIFFICULTY_ORDER = {
  easy: 0,
  medium: 1,
  mixed: 2,
  hard: 3,
};

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function exportGitHubData() {
  if (!fs.existsSync(SRC_DATA_DIR)) {
    throw new Error(`Source data directory not found: ${SRC_DATA_DIR}`);
  }

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });

  const folders = fs
    .readdirSync(SRC_DATA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const tags = [];
  let totalTests = 0;

  for (const folder of folders) {
    const srcFolder = path.join(SRC_DATA_DIR, folder);
    const destFolder = path.join(OUTPUT_DATA_DIR, folder);
    fs.mkdirSync(destFolder, { recursive: true });

    const jsonFiles = fs
      .readdirSync(srcFolder, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name);

    const tests = [];

    for (const filename of jsonFiles) {
      const srcFile = path.join(srcFolder, filename);
      const destFile = path.join(destFolder, filename);
      fs.copyFileSync(srcFile, destFile);

      const raw = fs.readFileSync(srcFile, "utf8");
      const data = JSON.parse(raw);

      tests.push({
        id: data.test_id || filename.replace(/\.json$/i, ""),
        title: data.title || filename,
        difficulty: data.difficulty || "mixed",
        total_minutes: data.total_minutes ?? 15,
        file_path: `data/${folder}/${filename}`,
        file_version: "1.0",
      });
      totalTests += 1;
    }

    tests.sort((a, b) => {
      const diffA = DIFFICULTY_ORDER[a.difficulty] ?? 99;
      const diffB = DIFFICULTY_ORDER[b.difficulty] ?? 99;
      if (diffA !== diffB) return diffA - diffB;
      return (a.title || "").localeCompare(b.title || "", "uz");
    });

    const meta = CATEGORY_META[folder] || {
      name: folder.toUpperCase(),
      description: "",
      order: 99,
    };

    tags.push({
      id: folder,
      name: meta.name,
      description: meta.description,
      _order: meta.order,
      tests,
    });
  }

  tags.sort((a, b) => {
    if (a._order !== b._order) return a._order - b._order;
    return a.id.localeCompare(b.id);
  });

  const manifest = {
    version: "1.0.8",
    last_updated: new Date().toISOString().slice(0, 10),
    tags: tags.map(({ _order, ...tag }) => tag),
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8"
  );

  // Default users.json with SHA-256 hashed passwords
  // admin / 123456 | student / student123
  const users = {
    version: "1.0.1",
    users: [
      {
        id: "st_001",
        full_name: "Administrator",
        username: "admin",
        password_hash: sha256("123456"),
        group: "Administrators",
        active: true,
        allowed_tags: ["all"],
      },
      {
        id: "st_002",
        full_name: "Namuna Talaba",
        username: "student",
        password_hash: sha256("student123"),
        group: "9-A Sinf",
        active: true,
        allowed_tags: ["html", "css", "html_css", "js", "ux_ui"],
      },
    ],
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "users.json"),
    JSON.stringify(users, null, 2) + "\n",
    "utf8"
  );

  console.log(
    `Exported ${totalTests} test(s) across ${manifest.tags.length} categories into ${OUTPUT_DIR}`
  );
}

exportGitHubData();
