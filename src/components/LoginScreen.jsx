import { useState } from "react";
import {
  Eye,
  EyeOff,
  FileCode,
  Lock,
  LogIn,
  RefreshCw,
  User,
} from "lucide-react";
import { hashPassword } from "../utils/crypto";

export default function LoginScreen({
  usersData,
  syncStatus,
  isSyncing,
  onRefreshSync,
  onLoginSuccess,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const versionSuffix = usersData?.version ? ` (v${usersData.version})` : "";

  const statusConfig = isSyncing
    ? {
        label: "Sinxronlanmoqda...",
        dotClass: "dot-syncing",
        className: "status-badge status-syncing",
      }
    : syncStatus === "online"
    ? {
        label: `Online${versionSuffix}`,
        dotClass: "dot-online",
        className: "status-badge status-online",
      }
    : syncStatus === "offline"
    ? {
        label: `Offline${versionSuffix}`,
        dotClass: "dot-offline",
        className: "status-badge status-offline",
      }
    : {
        label: "Demo Mode",
        dotClass: "dot-demo-mint",
        className: "status-badge status-demo-mint",
      };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError("Iltimos, foydalanuvchi nomi va parolni kiriting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const enteredHash = await hashPassword(password);
      const users = usersData?.users || [];
      const matchedUser = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (!matchedUser || matchedUser.password_hash !== enteredHash) {
        setError("Foydalanuvchi nomi yoki parol noto'g'ri.");
        return;
      }

      if (matchedUser.active !== true) {
        setError(
          "Hisobingiz faol emas. Iltimos, administratorga murojaat qiling."
        );
        return;
      }

      onLoginSuccess(matchedUser);
    } catch {
      setError("Kirishda kutilmagan xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("123456");
    setError("");
  };

  return (
    <div className="app-shell login-shell">
      <div className="login-wave-top" aria-hidden="true" />
      <div className="login-wave-bottom" aria-hidden="true" />
      <div className="dot-matrix dot-matrix-tr" aria-hidden="true" />
      <div className="dot-matrix dot-matrix-bl" aria-hidden="true" />

      <div className="login-page">
        <div className="login-card">
          <div className="login-card-content">
            <div className="sync-bar">
              <span className={statusConfig.className}>
                <span className={`status-dot ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>
              <button
                type="button"
                className="login-refresh-btn"
                onClick={onRefreshSync}
                disabled={isSyncing}
                title="Ma'lumotlarni yangilash"
                aria-label="Ma'lumotlarni yangilash"
              >
                <RefreshCw size={17} strokeWidth={2.2} className={isSyncing ? "spin" : ""} />
              </button>
            </div>

            <div className="login-header">
              <div className="login-logo-stage">
                <svg
                  className="login-orbital-svg"
                  viewBox="0 0 180 110"
                  fill="none"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="90"
                    cy="55"
                    rx="74"
                    ry="26"
                    transform="rotate(-14 90 55)"
                    stroke="#cbd5e1"
                    strokeOpacity="0.45"
                    strokeWidth="1.2"
                  />
                  <ellipse
                    cx="90"
                    cy="55"
                    rx="66"
                    ry="22"
                    transform="rotate(16 90 55)"
                    stroke="#cbd5e1"
                    strokeOpacity="0.35"
                    strokeWidth="1.1"
                  />
                  <circle cx="28" cy="36" r="2.2" fill="#93c5fd" />
                  <circle cx="152" cy="70" r="2" fill="#bfdbfe" />
                </svg>

                <div className="login-app-icon">
                  <FileCode size={36} strokeWidth={2} />
                </div>
              </div>

              <h1 className="login-title">Imtihon Tizimi</h1>
              <p className="login-subtitle">
                Testlarni topshirish uchun shaxsiy hisobingizga kiring
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="login-label">
                  <User size={15} strokeWidth={2.3} />
                  <span>Foydalanuvchi nomi</span>
                </label>
                <div className="input-icon-wrapper">
                  <User size={18} strokeWidth={2} className="input-left-icon" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masalan: vali_01"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="login-label">
                  <Lock size={15} strokeWidth={2.3} />
                  <span>Parol</span>
                </label>
                <div className="input-icon-wrapper password-wrapper">
                  <Lock size={18} strokeWidth={2} className="input-left-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <div className="alert-error">{error}</div>}

              <button
                type="submit"
                className="btn-login-submit"
                disabled={isSubmitting || isSyncing}
              >
                <LogIn size={19} strokeWidth={2.3} />
                <span>{isSubmitting ? "Tekshirilmoqda..." : "Kirish"}</span>
              </button>
            </form>

            {syncStatus === "demo" && (
              <div className="demo-hint-row">
                <span className="demo-hint-label">Demo kirish:</span>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={handleFillDemo}
                  title="Demo ma'lumotlarni to'ldirish"
                >
                  <User size={13} strokeWidth={2.2} />
                  <span>admin</span>
                </button>
                <span className="demo-slash">/</span>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={handleFillDemo}
                  title="Demo ma'lumotlarni to'ldirish"
                >
                  <Lock size={13} strokeWidth={2.2} />
                  <span>123456</span>
                </button>
              </div>
            )}
          </div>

          <svg
            className="login-card-bottom-wave"
            viewBox="0 0 440 56"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0,26 C110,54 220,2 340,24 C390,34 420,24 440,16 L440,56 L0,56 Z"
              fill="#eff6ff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
