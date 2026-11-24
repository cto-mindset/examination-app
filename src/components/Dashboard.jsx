import { useMemo, useState } from "react";
import {
  ArrowRight,
  Braces,
  Check,
  Clock,
  Cloud,
  Code2,
  Download,
  Layers,
  LayoutGrid,
  Loader2,
  LogOut,
  Palette,
  PenTool,
  Play,
} from "lucide-react";
import { downloadAllForOffline, isTestCached } from "../utils/syncEngine";

const DIFFICULTY_META = {
  easy: { label: "OSON", className: "badge-easy" },
  medium: { label: "O'RTA", className: "badge-medium" },
  hard: { label: "QIYIN", className: "badge-hard" },
  mixed: { label: "ARALASH", className: "badge-mixed" },
};

function Html5ShieldSvg() {
  return (
    <svg width="50" height="50" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M5 4L7.4 30.2L18 33.2L28.6 30.2L31 4H5Z" fill="#e44d26" />
      <path d="M18 6.2V30.9L26.5 28.5L28.5 6.2H18Z" fill="#f16529" />
      <path
        d="M18 14.5H13.3L13 11.2H18V8H9.5L10.4 17.7H18V14.5ZM18 22.8L14.3 21.8L14.1 19.3H10.8L11.2 24.3L18 26.2V22.8Z"
        fill="#EBEBEB"
      />
      <path
        d="M18 14.5V17.7H22.2L21.8 21.8L18 22.8V26.2L24.8 24.3L25.7 14.5H18ZM18 8V11.2H25.9L26.2 8H18Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function Css3ShieldSvg() {
  return (
    <svg width="50" height="50" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M5 4L7.4 30.2L18 33.2L28.6 30.2L31 4H5Z" fill="#264de4" />
      <path d="M18 6.2V30.9L26.5 28.5L28.5 6.2H18Z" fill="#2965f1" />
      <path
        d="M18 14.5H13.6L13.9 17.7H18V14.5ZM18 8H9.8L10.1 11.2H18V8ZM18 22.8L14.3 21.8L14.1 19.3H10.8L11.2 24.3L18 26.2V22.8Z"
        fill="#EBEBEB"
      />
      <path
        d="M25.9 8H18V11.2H22.6L22.3 14.5H18V17.7H22L21.6 21.8L18 22.8V26.2L24.8 24.3L25.9 8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function JsBadgeSvg() {
  return (
    <svg width="50" height="50" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="32" height="32" rx="8" fill="#f7df1e" />
      <path
        d="M20.2 26.2C20.9 27.4 21.9 28.2 23.5 28.2C25 28.2 26 27.4 26 26.3C26 25 25 24.5 23.3 23.8L22.4 23.4C19.8 22.3 18.2 21 18.2 18.2C18.2 15.6 20.1 13.7 23.2 13.7C25.4 13.7 27 14.5 28.1 16.5L25.4 18.2C24.8 17.1 24.2 16.7 23.2 16.7C22.1 16.7 21.5 17.3 21.5 18.2C21.5 19.2 22.1 19.6 23.6 20.2L24.5 20.6C27.5 21.9 29.2 23.1 29.2 26.1C29.2 29.3 26.7 31 23.4 31C20.2 31 18.2 29.5 17.2 27.5L20.2 26.2ZM10.4 26.4C10.9 27.4 11.5 28.1 12.8 28.1C14 28.1 14.7 27.6 14.7 25.8V14H18V25.9C18 29.5 15.9 31.1 12.9 31.1C10.1 31.1 8.5 29.7 7.6 28L10.4 26.4Z"
        fill="#1E293B"
      />
    </svg>
  );
}

function FigmaBadgeSvg() {
  return (
    <svg width="50" height="50" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <g transform="translate(0, 3)">
        <path d="M13.5 10.5C11.0147 10.5 9 8.48528 9 6C9 3.51472 11.0147 1.5 13.5 1.5H18V10.5H13.5Z" fill="#F24E1E" />
        <path d="M18 1.5H22.5C24.9853 1.5 27 3.51472 27 6C27 8.48528 24.9853 10.5 22.5 10.5H18V1.5Z" fill="#FF7262" />
        <path d="M13.5 19.5C11.0147 19.5 9 17.4853 9 15C9 12.5147 11.0147 10.5 13.5 10.5H18V19.5H13.5Z" fill="#A259FF" />
        <path d="M27 15C27 17.4853 24.9853 19.5 22.5 19.5C20.0147 19.5 18 17.4853 18 15C18 12.5147 20.0147 10.5 22.5 10.5C24.9853 10.5 27 12.5147 27 15Z" fill="#1ABCFE" />
        <path d="M13.5 28.5C11.0147 28.5 9 26.4853 9 24C9 21.5147 11.0147 19.5 13.5 19.5H18V24C18 26.4853 15.9853 28.5 13.5 28.5Z" fill="#0ACF83" />
      </g>
    </svg>
  );
}

function HtmlCssDualSvg() {
  return (
    <svg width="52" height="50" viewBox="0 0 52 50" fill="none" aria-hidden="true">
      {/* HTML5 Shield (left-top) */}
      <g transform="translate(2, 2) scale(0.84)">
        <path d="M5 4L7.4 30.2L18 33.2L28.6 30.2L31 4H5Z" fill="#e44d26" />
        <path d="M18 6.2V30.9L26.5 28.5L28.5 6.2H18Z" fill="#f16529" />
        <path
          d="M18 14.5H13.3L13 11.2H18V8H9.5L10.4 17.7H18V14.5ZM18 22.8L14.3 21.8L14.1 19.3H10.8L11.2 24.3L18 26.2V22.8Z"
          fill="#EBEBEB"
        />
        <path
          d="M18 14.5V17.7H22.2L21.8 21.8L18 22.8V26.2L24.8 24.3L25.7 14.5H18ZM18 8V11.2H25.9L26.2 8H18Z"
          fill="#FFFFFF"
        />
      </g>
      {/* CSS3 Shield (right-bottom overlapping) */}
      <g transform="translate(20, 16) scale(0.84)">
        <path d="M5 4L7.4 30.2L18 33.2L28.6 30.2L31 4H5Z" fill="#264de4" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M18 6.2V30.9L26.5 28.5L28.5 6.2H18Z" fill="#2965f1" />
        <path
          d="M18 14.5H13.6L13.9 17.7H18V14.5ZM18 8H9.8L10.1 11.2H18V8ZM18 22.8L14.3 21.8L14.1 19.3H10.8L11.2 24.3L18 26.2V22.8Z"
          fill="#EBEBEB"
        />
        <path
          d="M25.9 8H18V11.2H22.6L22.3 14.5H18V17.7H22L21.6 21.8L18 22.8V26.2L24.8 24.3L25.9 8Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

function getTestVisual(testMeta, tagId) {
  const key = `${testMeta.icon || ""} ${testMeta.id || ""} ${testMeta.title || ""}`.toLowerCase();

  if (tagId === "html_css" || key.includes("html_css") || (key.includes("html") && key.includes("css"))) {
    return {
      icon: <HtmlCssDualSvg />,
      boxClass: "test-icon-html-css",
      cardThemeClass: "card-theme-teal",
    };
  }
  if (tagId === "ux_ui" || key.includes("ux_ui") || key.includes("ux/ui") || key.includes("figma")) {
    return {
      icon: <FigmaBadgeSvg />,
      boxClass: "test-icon-ux-ui",
      cardThemeClass: "card-theme-rose",
    };
  }
  if (key.includes("html")) {
    return {
      icon: <Html5ShieldSvg />,
      boxClass: "test-icon-html",
      cardThemeClass: "card-theme-warm",
    };
  }
  if (key.includes("css") || key.includes("flex") || key.includes("grid")) {
    return {
      icon: <Css3ShieldSvg />,
      boxClass: "test-icon-css",
      cardThemeClass: "card-theme-sky",
    };
  }
  if (key.includes("async") || key.includes("promise")) {
    return {
      icon: <Code2 size={36} strokeWidth={2.5} className="svg-purple" />,
      boxClass: "test-icon-purple",
      cardThemeClass: "card-theme-lavender",
    };
  }
  if (key.includes("js") || key.includes("javascript") || tagId === "js") {
    return {
      icon: <JsBadgeSvg />,
      boxClass: "test-icon-js",
      cardThemeClass: "card-theme-amber",
    };
  }
  return {
    icon: <Code2 size={36} strokeWidth={2.5} className="svg-purple" />,
    boxClass: "test-icon-purple",
    cardThemeClass: "card-theme-lavender",
  };
}

function renderTagSectionBadge(tag) {
  const iconKey = (tag.icon || tag.id || "").toLowerCase();
  if (iconKey === "html") {
    return (
      <div className="section-icon-badge section-icon-html" aria-hidden="true">
        <Code2 size={21} strokeWidth={2.3} />
      </div>
    );
  }
  if (iconKey === "css") {
    return (
      <div className="section-icon-badge section-icon-css" aria-hidden="true">
        <Palette size={20} strokeWidth={2.3} />
      </div>
    );
  }
  if (iconKey === "html_css") {
    return (
      <div className="section-icon-badge section-icon-html-css" aria-hidden="true">
        <Layers size={20} strokeWidth={2.3} />
      </div>
    );
  }
  if (iconKey === "js") {
    return (
      <div className="section-icon-badge section-icon-js" aria-hidden="true">
        <span>JS</span>
      </div>
    );
  }
  if (iconKey === "ux_ui") {
    return (
      <div className="section-icon-badge section-icon-ux-ui" aria-hidden="true">
        <PenTool size={20} strokeWidth={2.3} />
      </div>
    );
  }
  return (
    <div className="section-icon-badge section-icon-default" aria-hidden="true">
      <Braces size={20} strokeWidth={2.3} />
    </div>
  );
}

function renderFilterPillIcon(tag) {
  const iconKey = (tag.icon || tag.id || "").toLowerCase();
  if (iconKey === "html") {
    return <Code2 size={15} strokeWidth={2.2} />;
  }
  if (iconKey === "css") {
    return <Palette size={15} strokeWidth={2.2} />;
  }
  if (iconKey === "html_css") {
    return <Layers size={15} strokeWidth={2.2} />;
  }
  if (iconKey === "js") {
    return <Braces size={15} strokeWidth={2.2} />;
  }
  if (iconKey === "ux_ui") {
    return <PenTool size={15} strokeWidth={2.2} />;
  }
  return <Code2 size={15} strokeWidth={2.2} />;
}

export default function Dashboard({
  user,
  manifest,
  syncStatus,
  loadingTestId,
  testLoadError,
  onStartTest,
  onLogout,
}) {
  const [selectedTag, setSelectedTag] = useState("all");
  const [offlineProgress, setOfflineProgress] = useState(null);
  const [offlineMessage, setOfflineMessage] = useState("");
  const [cacheRevision, setCacheRevision] = useState(0);

  const visibleTags = useMemo(() => {
    const allTags = manifest?.tags || [];
    const allowed = user?.allowed_tags || [];
    if (allowed.includes("all")) {
      return allTags;
    }
    return allTags.filter((tag) => allowed.includes(tag.id));
  }, [manifest, user]);

  const displayedTags = useMemo(() => {
    if (selectedTag === "all") {
      return visibleTags;
    }
    return visibleTags.filter((tag) => tag.id === selectedTag);
  }, [visibleTags, selectedTag]);

  const handleDownloadAll = async () => {
    setOfflineMessage("");
    const totalCount = visibleTags.reduce(
      (sum, tag) => sum + (tag.tests?.length || 0),
      0
    );
    if (totalCount === 0) {
      setOfflineMessage("Saqlash uchun testlar topilmadi.");
      return;
    }

    setOfflineProgress({ current: 0, total: totalCount, testTitle: "" });
    const filteredManifest = { ...manifest, tags: visibleTags };

    const result = await downloadAllForOffline(filteredManifest, (progress) => {
      setOfflineProgress(progress);
    });

    setCacheRevision((prev) => prev + 1);
    setOfflineProgress(null);

    if (result.failed > 0) {
      setOfflineMessage(
        `${result.total - result.failed} ta test saqlandi, ${result.failed} ta testni yuklab bo'lmadi.`
      );
    } else {
      setOfflineMessage(
        `Barcha ${result.total} ta test offline foydalanish uchun saqlandi!`
      );
    }
  };

  const statusMeta =
    syncStatus === "online"
      ? { label: "Online", dotClass: "dot-online" }
      : syncStatus === "offline"
      ? { label: "Offline", dotClass: "dot-offline" }
      : { label: "Demo Mode", dotClass: "dot-demo" };

  return (
    <div className="app-shell">
      <div className="bg-blob bg-blob-top" aria-hidden="true" />
      <div className="bg-blob bg-blob-bottom" aria-hidden="true" />

      <div className="dashboard-page">
        <header className="dashboard-header">
          <div className="user-info">
            <div className="user-avatar">
              {user.full_name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div>
              <h1 className="user-name">{user.full_name}</h1>
              <div className="user-meta">
                <span className="group-pill">Guruh: {user.group}</span>
                <span className="status-pill-inline">
                  <span className={`status-dot ${statusMeta.dotClass}`} />
                  {statusMeta.label}
                </span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-secondary btn-pill"
              onClick={handleDownloadAll}
              disabled={Boolean(offlineProgress)}
            >
              {offlineProgress ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>
                    Saqlanmoqda ({offlineProgress.current}/{offlineProgress.total})
                  </span>
                </>
              ) : (
                <>
                  <Download size={16} strokeWidth={2.2} />
                  <span>Offline uchun barchasini saqlash</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-outline btn-pill"
              onClick={onLogout}
            >
              <LogOut size={16} strokeWidth={2.2} />
              <span>Chiqish</span>
            </button>
          </div>
        </header>

        {offlineMessage && (
          <div className="alert-info">{offlineMessage}</div>
        )}

        {testLoadError && (
          <div className="alert-error">{testLoadError}</div>
        )}

        <nav className="tag-pills" aria-label="Fanlar filtri">
          <button
            type="button"
            className={`tag-pill ${selectedTag === "all" ? "active" : ""}`}
            onClick={() => setSelectedTag("all")}
          >
            <LayoutGrid size={15} strokeWidth={2.2} />
            <span>Barchasi</span>
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`tag-pill ${selectedTag === tag.id ? "active" : ""}`}
              onClick={() => setSelectedTag(tag.id)}
            >
              {renderFilterPillIcon(tag)}
              <span>#{tag.name}</span>
            </button>
          ))}
        </nav>

        <main className="tag-sections">
          {displayedTags.length === 0 ? (
            <div className="empty-state">
              Siz uchun hozircha ruxsat etilgan testlar mavjud emas.
            </div>
          ) : (
            displayedTags.map((tag) => (
              <section key={tag.id} className="tag-section">
                <div className="tag-section-header">
                  {renderTagSectionBadge(tag)}
                  <div className="tag-section-titles">
                    <div className="tag-section-title-row">
                      <h2>{tag.name}</h2>
                      <div className="section-divider" aria-hidden="true" />
                    </div>
                    {tag.description && <p>{tag.description}</p>}
                  </div>
                </div>

                <div className="tests-grid">
                  {(tag.tests || []).map((testMeta) => {
                    const diff =
                      DIFFICULTY_META[testMeta.difficulty] ||
                      DIFFICULTY_META.mixed;
                    const cached = cacheRevision >= 0 && isTestCached(testMeta);
                    const isLoading = loadingTestId === testMeta.id;
                    const visual = getTestVisual(testMeta, tag.id);

                    return (
                      <article
                        key={testMeta.id}
                        className={`test-card ${visual.cardThemeClass}`}
                      >
                        <div className="test-card-top">
                          <span className={`difficulty-badge ${diff.className}`}>
                            <span className="diff-dot" />
                            {diff.label}
                          </span>
                          <span className="duration-badge">
                            <Clock size={14} strokeWidth={2.2} />
                            <span>{testMeta.total_minutes} daqiqa</span>
                          </span>
                        </div>

                        <div className="test-card-body">
                          <div className={`test-icon-box ${visual.boxClass}`}>
                            {visual.icon}
                          </div>

                          <div className="test-card-info">
                            <h3 className="test-card-title">{testMeta.title}</h3>

                            <div className="test-card-footer">
                              <span
                                className={`cache-indicator ${
                                  cached ? "is-cached" : "is-online"
                                }`}
                              >
                                {cached ? (
                                  <>
                                    <span className="cached-check-box" aria-hidden="true">
                                      <Check size={12} strokeWidth={3.2} />
                                    </span>
                                    <span>Offline tayyor</span>
                                  </>
                                ) : (
                                  <>
                                    <Cloud size={15} strokeWidth={2.2} />
                                    <span>Onlayn</span>
                                  </>
                                )}
                              </span>

                              <button
                                type="button"
                                className="btn-primary btn-start"
                                onClick={() => onStartTest(testMeta)}
                                disabled={Boolean(loadingTestId)}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 size={15} className="spin" />
                                    <span>Yuklanmoqda...</span>
                                  </>
                                ) : (
                                  <>
                                    <Play size={14} fill="currentColor" strokeWidth={2} />
                                    <span>Boshlash</span>
                                    <ArrowRight size={15} strokeWidth={2.3} />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
