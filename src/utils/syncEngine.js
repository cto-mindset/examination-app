import {
  DEMO_MANIFEST,
  DEMO_TEST_DATA,
  DEMO_USERS,
  GITHUB_RAW_BASE_URL,
  isDemoUrlConfigured,
} from "../config";

const STORAGE_KEYS = {
  USERS: "exam_app_users",
  MANIFEST: "exam_app_manifest",
  TEST_PREFIX: "exam_app_test_",
};

const LOCAL_TEST_FILES = import.meta.glob("../data/**/*.json", { eager: true });

function resolveLocalTestData(testMeta) {
  if (testMeta?.file_path) {
    const normalizedPath = testMeta.file_path.replace(/^\/+/, "");
    const moduleEntry = LOCAL_TEST_FILES[`../${normalizedPath}`];
    if (moduleEntry) {
      return moduleEntry.default || moduleEntry;
    }
  }
  return DEMO_TEST_DATA[testMeta?.id] || null;
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage to'lib qolsa yoki cheklangan bo'lsa jim o'tkazamiz
  }
}

function buildRemoteUrl(relativePath) {
  const base = GITHUB_RAW_BASE_URL.replace(/\/+$/, "");
  const path = relativePath.replace(/^\/+/, "");
  return `${base}/${path}?t=${Date.now()}`;
}

async function fetchJson(relativePath) {
  const response = await fetch(buildRemoteUrl(relativePath), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${relativePath}`);
  }
  return response.json();
}

/**
 * users.json va manifest.json fayllarini GitHub dan sinxronlaydi.
 * Internet bo'lmasa localStorage keshiga, kesh bo'sh bo'lsa demo ma'lumotlarga qaytadi.
 * @returns {Promise<{ usersData: object, manifestData: object, status: 'online' | 'offline' | 'demo' }>}
 */
export async function syncCoreData() {
  if (isDemoUrlConfigured()) {
    const cachedUsers = readStorage(STORAGE_KEYS.USERS);
    return {
      usersData: cachedUsers || DEMO_USERS,
      manifestData: DEMO_MANIFEST,
      status: "demo",
    };
  }

  try {
    const [usersData, manifestData] = await Promise.all([
      fetchJson("users.json"),
      fetchJson("manifest.json"),
    ]);

    writeStorage(STORAGE_KEYS.USERS, usersData);
    writeStorage(STORAGE_KEYS.MANIFEST, manifestData);

    return {
      usersData,
      manifestData,
      status: "online",
    };
  } catch {
    const cachedUsers = readStorage(STORAGE_KEYS.USERS);
    const cachedManifest = readStorage(STORAGE_KEYS.MANIFEST);

    if (cachedUsers && cachedManifest) {
      return {
        usersData: cachedUsers,
        manifestData: cachedManifest,
        status: "offline",
      };
    }

    return {
      usersData: cachedUsers || DEMO_USERS,
      manifestData: cachedManifest || DEMO_MANIFEST,
      status: "demo",
    };
  }
}

/**
 * Test ma'lumotlarini kesh versiyasiga qarab localStorage yoki GitHub dan yuklaydi.
 * @param {{ id: string, title: string, file_path: string, file_version: string }} testMeta
 * @returns {Promise<object>}
 */
export async function getTestContent(testMeta) {
  const cacheKey = `${STORAGE_KEYS.TEST_PREFIX}${testMeta.id}`;
  const cached = readStorage(cacheKey);

  if (cached && cached.file_version === testMeta.file_version && cached.data) {
    return cached.data;
  }

  if (!isDemoUrlConfigured()) {
    try {
      const data = await fetchJson(testMeta.file_path);
      writeStorage(cacheKey, {
        file_version: testMeta.file_version,
        data,
      });
      return data;
    } catch {
      if (cached && cached.data) {
        return cached.data;
      }
      const localFallback = resolveLocalTestData(testMeta);
      if (localFallback) {
        return localFallback;
      }
      throw new Error(
        `"${testMeta.title}" testini yuklab bo'lmadi. Internet aloqasini tekshiring.`
      );
    }
  }

  const localData = resolveLocalTestData(testMeta);
  if (localData) {
    writeStorage(cacheKey, {
      file_version: testMeta.file_version,
      data: localData,
    });
    return localData;
  }

  if (cached && cached.data) {
    return cached.data;
  }

  throw new Error(`"${testMeta.title}" testi topilmadi.`);
}

/**
 * Test keshda bor-yo'qligini tekshiradi.
 * @param {{ id: string, file_version: string }} testMeta
 * @returns {boolean}
 */
export function isTestCached(testMeta) {
  const cached = readStorage(`${STORAGE_KEYS.TEST_PREFIX}${testMeta.id}`);
  if (cached && cached.file_version === testMeta.file_version && cached.data) {
    return true;
  }
  return Boolean(isDemoUrlConfigured() && resolveLocalTestData(testMeta));
}

/**
 * Manifestdagi barcha testlarni oflayn foydalanish uchun keshga yuklaydi.
 * @param {object} manifest
 * @param {(progress: { current: number, total: number, testTitle: string, failed: number }) => void} onProgress
 */
export async function downloadAllForOffline(manifest, onProgress) {
  const allTests = (manifest?.tags || []).flatMap((tag) => tag.tests || []);
  const total = allTests.length;
  let current = 0;
  let failed = 0;

  for (const testMeta of allTests) {
    current += 1;
    try {
      await getTestContent(testMeta);
    } catch {
      failed += 1;
    }
    if (onProgress) {
      onProgress({
        current,
        total,
        testTitle: testMeta.title,
        failed,
      });
    }
  }

  return { total, failed };
}
