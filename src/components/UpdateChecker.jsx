import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export default function UpdateChecker() {
  const [update, setUpdate] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isTauriRuntime()) return;

    let cancelled = false;

    async function checkForUpdates() {
      try {
        const result = await check();
        if (!cancelled && result?.available) {
          setUpdate(result);
        }
      } catch {
        // Oflayn yoki tarmoq xatolarini jim o'tkazamiz
      }
    }

    checkForUpdates();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!update || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    setIsDownloading(true);
    setError("");
    setProgress(0);

    let totalBytes = 0;
    let downloadedBytes = 0;

    try {
      await update.downloadAndInstall((event) => {
        if (event.event === "Started") {
          totalBytes = event.data?.contentLength || 0;
          downloadedBytes = 0;
          setProgress(totalBytes > 0 ? 0 : null);
        } else if (event.event === "Progress") {
          downloadedBytes += event.data?.chunkLength || 0;
          if (totalBytes > 0) {
            const pct = Math.min(
              100,
              Math.round((downloadedBytes / totalBytes) * 100)
            );
            setProgress(pct);
          }
        } else if (event.event === "Finished") {
          setProgress(100);
        }
      });

      await relaunch();
    } catch {
      setError(
        "Yangilanishni yuklab olishda xatolik yuz berdi. Keyinroq qayta urinib ko'ring."
      );
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="updater-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="updater-title"
    >
      <div className="updater-modal">
        <div className="updater-head">
          <div className="updater-icon-badge" aria-hidden="true">
            <Download size={20} />
          </div>
          <div className="updater-title-wrap">
            <h2 id="updater-title" className="updater-title">
              Yangi versiya mavjud (v{update.version})
            </h2>
            <p className="updater-subtitle">
              Ilovaning so&apos;nggi imkoniyatlari va tuzatishlarini o&apos;rnatish
              tavsiya etiladi.
            </p>
          </div>
          {!isDownloading && (
            <button
              type="button"
              className="updater-close"
              onClick={() => setDismissed(true)}
              aria-label="Yopish"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {update.body && (
          <div className="updater-notes">{update.body}</div>
        )}

        {isDownloading && (
          <div className="updater-progress-wrap">
            <div className="updater-progress-meta">
              <span>Yuklanmoqda...</span>
              <span>{progress !== null ? `${progress}%` : "..."}</span>
            </div>
            <div className="updater-progress-track">
              <div
                className="updater-progress-fill"
                style={{ width: `${progress ?? 35}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="updater-error">{error}</p>}

        <div className="updater-actions">
          <button
            type="button"
            className="updater-btn-secondary"
            onClick={() => setDismissed(true)}
            disabled={isDownloading}
          >
            Keyinroq
          </button>
          <button
            type="button"
            className="updater-btn-primary"
            onClick={handleInstall}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <RefreshCw size={16} className="spin" />
                O&apos;rnatilmoqda...
              </>
            ) : (
              "Yangilash va qayta ishga tushirish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
