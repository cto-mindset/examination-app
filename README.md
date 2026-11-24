# Examination App

**O'zbekcha:** **Examination App** — Tauri v2, React, Vite va Bun asosida qurilgan **offline-first** (internetsiz ham ishlaydigan) desktop imtihon va test topshirish tizimi. Ilova GitHub omboridan `users.json`, `manifest.json` hamda test JSON fayllarini sinxronlaydi va oflayn ishlash uchun mahalliy keshda (`localStorage`) saqlaydi.

**English:** **Examination App** is an **offline-first** desktop examination system built with Tauri v2, React, Vite, and Bun. It syncs `users.json`, `manifest.json`, and test JSON datasets from a remote GitHub repository and caches them locally for seamless offline usage.

---

## Asosiy imkoniyatlar / Key Features

- **Offline-first arxitektura:** Internet bo'lmasa ham mahalliy kesh yoki ichki 19 ta o'zbekcha testlar bilan ishlaydi.
- **Masofaviy GitHub sinxronizatsiyasi:** `manifest.json`, `users.json` va `data/` papkasini GitHub Raw URL orqali avtomatik yangilaydi.
- **SHA-256 autentifikatsiya:** Foydalanuvchi parollari `Web Crypto API` yordamida SHA-256 xesh ko'rinishida tekshiriladi.
- **19 ta tayyor test:** `html`, `css`, `html_css`, `js` va `ux_ui` yo'nalishlari bo'yicha o'zbek tilidagi testlar to'plami.

---

## Mahalliy ishga tushirish / Local Development

Talablar / Prerequisites: [Bun](https://bun.sh/) va [Rust / Tauri CLI](https://v2.tauri.app/start/prerequisites/).

```bash
# 1. Repozitoriyni klonlash / Clone the repository
git clone https://github.com/cto-mindset/examination-app.git
cd examination-app

# 2. Kutubxonalarni o'rnatish / Install dependencies
bun install

# 3. Dasturni ishga tushirish (Tauri + Vite dev) / Run in development mode
bun run tauri dev

# 4. Ishlab chiqarish (Production) build yaratish / Build desktop installer
bun run tauri build
```

Faqat frontendni tekshirish uchun / To build only the frontend bundle:

```bash
bun run build
```

---

## Masofaviy GitHub omborini ulash / Connecting Remote GitHub Repository

1. **Ma'lumotlar to'plamini tayyorlash / Prepare the data bundle:**
   Loyiha ildizidagi `github-repo-data/` papkasida GitHub omboriga yuklash uchun tayyor tuzilma mavjud (`manifest.json`, `users.json` va `data/`). Uni qayta yaratish uchun:
   ```bash
   bun run scripts/export-github-data.js
   ```

2. **GitHub omboriga yuklash / Upload to your data repository:**
   `github-repo-data/` ichidagi `manifest.json`, `users.json` va `data/` papkasini alohida (yoki shu) GitHub omboringizning `main` branchiga yuklang.

3. **`src/config.js` faylini sozlash / Configure `GITHUB_RAW_BASE_URL`:**
   [`src/config.js`](src/config.js) faylida `GITHUB_RAW_BASE_URL` qiymatini o'zingizning GitHub Raw manzilingizga o'zgartiring:
   ```js
   export const GITHUB_RAW_BASE_URL =
     "https://raw.githubusercontent.com/cto-mindset/examination-app/main/github-repo-data";
   ```
   *(Agar alohida data ombor ishlatsangiz, uning `main` branch manzilini ko'rsating. Shuningdek, `src/config.js` dagi `isDemoUrlConfigured()` funksiyasidan `cto-mindset` tekshiruvini olib tashlashni unutmang.)*

   > **Eslatma:** Standart demo rejimda `admin` / `123456` hisobi ishlaydi. GitHub omboriga yuklashdan oldin `users.json` dagi parol xeshlarini yangilang.
