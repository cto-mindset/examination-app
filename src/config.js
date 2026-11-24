// Masofaviy GitHub omboringizning Raw URL manzili.
// Haqiqiy ombor ulanganda quyidagi manzilni o'zgartiring:
// Masalan: "https://raw.githubusercontent.com/username/exam-repo/main"
export const GITHUB_RAW_BASE_URL =
  "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_EXAM_REPO/main";

export const isDemoUrlConfigured = () =>
  GITHUB_RAW_BASE_URL.includes("cto-mindset") ||
  GITHUB_RAW_BASE_URL.includes("YOUR_EXAM_REPO");

// Ilova internet yoki GitHub URL bo'lmagan holatda ham ishlashi uchun demo foydalanuvchilar
// Standart login: admin | parol: 123456
export const DEMO_USERS = {
  version: "1.0.1",
  users: [
    {
      id: "st_001",
      full_name: "Administrator (Demo)",
      username: "admin",
      password_hash:
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      group: "Demo Guruh",
      active: true,
      allowed_tags: ["all"],
    },
  ],
};

const LOCAL_DATA_MODULES = import.meta.glob("./data/**/*.json", { eager: true });

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

function buildDemoManifest() {
  const tagsMap = new Map();

  for (const [modulePath, moduleValue] of Object.entries(LOCAL_DATA_MODULES)) {
    const match = modulePath.match(/^\.\/data\/([^/]+)\/([^/]+\.json)$/);
    if (!match) continue;

    const [, folder, filename] = match;
    const data = moduleValue?.default || moduleValue;
    if (!data || typeof data !== "object") continue;

    if (!tagsMap.has(folder)) {
      const meta = CATEGORY_META[folder] || {
        name: folder.toUpperCase(),
        description: "",
        order: 99,
      };
      tagsMap.set(folder, {
        id: folder,
        name: meta.name,
        description: meta.description,
        _order: meta.order,
        tests: [],
      });
    }

    tagsMap.get(folder).tests.push({
      id: data.test_id || filename.replace(/\.json$/i, ""),
      title: data.title || filename,
      difficulty: data.difficulty || "mixed",
      total_minutes: data.total_minutes ?? 15,
      file_path: `data/${folder}/${filename}`,
      file_version: "1.0",
    });
  }

  const tags = Array.from(tagsMap.values())
    .sort((a, b) => {
      if (a._order !== b._order) return a._order - b._order;
      return a.id.localeCompare(b.id);
    })
    .map(({ _order, tests, ...tag }) => ({
      ...tag,
      tests: tests.sort((a, b) => {
        const diffA = DIFFICULTY_ORDER[a.difficulty] ?? 99;
        const diffB = DIFFICULTY_ORDER[b.difficulty] ?? 99;
        if (diffA !== diffB) return diffA - diffB;
        return (a.title || "").localeCompare(b.title || "", "uz");
      }),
    }));

  return {
    version: "1.0.8",
    last_updated: "2026-11-19",
    tags,
  };
}

export const DEMO_MANIFEST = buildDemoManifest();

export const DEMO_TEST_DATA = {
  html5_basics: {
    test_id: "html5_basics",
    title: "HTML5 Asoslari",
    difficulty: "easy",
    total_minutes: 10,
    questions: [
      {
        id: 1,
        type: "single",
        question: "HTML5 hujjatining eng birinchi qatorida qaysi deklaratsiya yoziladi?",
        options: [
          "<!DOCTYPE html>",
          "<html5>",
          "<!DOCTYPE HTML5>",
          "<meta charset='UTF-8'>",
        ],
        correct_indices: [0],
        hint: "Qisqa va sodda deklaratsiya bo'lib, brauzerga standart rejimni bildiradi.",
        explanation:
          "HTML5 da hujjat turini aniqlash uchun <!DOCTYPE html> deklaratsiyasi ishlatiladi.",
      },
      {
        id: 2,
        type: "multiple",
        question: "Quyidagilardan qaysilari HTML5 semantik teglariga kiradi?",
        options: ["<article>", "<div>", "<section>", "<span>"],
        correct_indices: [0, 2],
        hint: "Sahifa mazmunining ma'nosini anglatuvchi teglarni tanlang.",
        explanation:
          "<article> va <section> semantik teglardir, <div> va <span> esa semantik ma'noga ega emas.",
      },
      {
        id: 3,
        type: "single",
        question: "Rasm yuklanmay qolganda ko'rinadigan matn qaysi atributda beriladi?",
        options: ["title", "src", "alt", "href"],
        correct_indices: [2],
        hint: null,
        explanation:
          "alt (alternative text) atributi rasm yuklanmaganda yoki ekran o'quvchilar uchun matn beradi.",
      },
    ],
  },
  css_layout: {
    test_id: "css_layout",
    title: "CSS Flexbox va Grid",
    difficulty: "medium",
    total_minutes: 15,
    questions: [
      {
        id: 1,
        type: "single",
        question: "Flexbox da elementlarni asosiy o'q (main axis) bo'ylab tekislash xossasi qaysi?",
        options: [
          "align-items",
          "justify-content",
          "flex-wrap",
          "place-self",
        ],
        correct_indices: [1],
        hint: "Gorizontal yo'nalishda (row holatida) joylashtirishni eslang.",
        explanation:
          "justify-content asosiy o'q bo'ylab, align-items esa kesishuvchi o'q bo'ylab tekislaydi.",
      },
      {
        id: 2,
        type: "multiple",
        question: "CSS Grid konteynerida ustunlar va qatorlar orasidagi bo'shliqni qaysi xossalar bilan berish mumkin?",
        options: ["gap", "grid-gap", "margin-inner", "column-gap"],
        correct_indices: [0, 1, 3],
        hint: null,
        explanation:
          "Zamonaviy CSS da gap va column-gap ishlatiladi, grid-gap esa eski sintaksis sifatida qo'llab-quvvatlanadi.",
      },
    ],
  },
  js_fundamentals: {
    test_id: "js_fundamentals",
    title: "JavaScript Asoslari",
    difficulty: "mixed",
    total_minutes: 15,
    questions: [
      {
        id: 1,
        type: "single",
        question: "JavaScript da o'zgarmas (qayta tayinlab bo'lmaydigan) o'zgaruvchi qaysi kalit so'z bilan e'lon qilinadi?",
        options: ["var", "let", "const", "static"],
        correct_indices: [2],
        hint: "Constant so'zining qisqartmasi.",
        explanation:
          "const bilan e'lon qilingan o'zgaruvchiga boshqa qiymat qayta tayinlab bo'lmaydi.",
      },
      {
        id: 2,
        type: "multiple",
        question: "Quyidagilardan qaysilari JavaScript ning primitiv (primitive) ma'lumot turlari?",
        options: ["string", "array", "boolean", "object"],
        correct_indices: [0, 2],
        hint: "Massiv va obyektlar reference (havola) turiga kiradi.",
        explanation:
          "string va boolean primitiv turlar, array (aslida object) va object esa murakkab turlardir.",
      },
    ],
  },
  js_async: {
    test_id: "js_async",
    title: "Async/Await va Promise",
    difficulty: "hard",
    total_minutes: 20,
    questions: [
      {
        id: 1,
        type: "single",
        question: "async funksiya doimo nimani qaytaradi?",
        options: [
          "Oddiy qiymat",
          "Callback funksiya",
          "Promise",
          "Generator",
        ],
        correct_indices: [2],
        hint: null,
        explanation:
          "Har qanday async funksiya natijani avtomatik tarzda Promise ga o'rab qaytaradi.",
      },
      {
        id: 2,
        type: "single",
        question: "Bir nechta Promise lardan barchasi muvaffaqiyatli tugashini kutadigan metod qaysi?",
        options: [
          "Promise.race()",
          "Promise.all()",
          "Promise.any()",
          "Promise.resolve()",
        ],
        correct_indices: [1],
        hint: "Barcha natijalar massiv ko'rinishida qaytadi.",
        explanation:
          "Promise.all() barcha berilgan Promise lar bajarilishini kutadi; birortasi rad etilsa xato beradi.",
      },
    ],
  },
};
