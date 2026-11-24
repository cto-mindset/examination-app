import { useCallback, useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import TestRunner from "./components/TestRunner";
import UpdateChecker from "./components/UpdateChecker";
import { getTestContent, syncCoreData } from "./utils/syncEngine";
import "./App.css";

function App() {
  const [usersData, setUsersData] = useState(null);
  const [manifestData, setManifestData] = useState(null);
  const [syncStatus, setSyncStatus] = useState("demo");
  const [isSyncing, setIsSyncing] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [loadingTestId, setLoadingTestId] = useState(null);
  const [testLoadError, setTestLoadError] = useState("");

  const performSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await syncCoreData();
      setUsersData(result.usersData);
      setManifestData(result.manifestData);
      setSyncStatus(result.status);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    performSync();
  }, [performSync]);

  const handleStartTest = async (testMeta) => {
    setTestLoadError("");
    setLoadingTestId(testMeta.id);
    try {
      const data = await getTestContent(testMeta);
      setActiveTest(data);
    } catch (err) {
      setTestLoadError(
        err?.message || "Testni yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoadingTestId(null);
    }
  };

  const handleLogout = () => {
    setActiveTest(null);
    setCurrentUser(null);
    setTestLoadError("");
  };

  let content = (
    <Dashboard
      user={currentUser}
      manifest={manifestData}
      syncStatus={syncStatus}
      loadingTestId={loadingTestId}
      testLoadError={testLoadError}
      onStartTest={handleStartTest}
      onLogout={handleLogout}
    />
  );

  if (!currentUser) {
    content = (
      <LoginScreen
        usersData={usersData}
        syncStatus={syncStatus}
        isSyncing={isSyncing}
        onRefreshSync={performSync}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    );
  } else if (activeTest) {
    content = (
      <TestRunner
        testData={activeTest}
        onExit={() => setActiveTest(null)}
      />
    );
  }

  return (
    <>
      {content}
      <UpdateChecker />
    </>
  );
}

export default App;
