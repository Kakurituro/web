import { useEffect, useState } from "react";

// グローバル変数として保持
let globalDeferredPrompt: any = null;

export default function PwaInstallNotice() {
  const [isInstalled, setIsInstalled] = useState(false);
  // 初期値にグローバル変数を代入
  const [prompt, setPrompt] = useState(globalDeferredPrompt);

  useEffect(() => {
    // 既にインストール済みかチェック
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // イベントを受け取る関数
    const handler = (e: any) => {
      e.preventDefault();
      globalDeferredPrompt = e; // グローバルに保存
      setPrompt(e); // 状態を更新してボタンを表示
    };

    // すでにグローバルに保存されている場合は、それを反映
    if (globalDeferredPrompt && !prompt) {
      setPrompt(globalDeferredPrompt);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [prompt]);

  // プロンプトがない、またはインストール済みの場合は非表示
  if (isInstalled || !prompt) return null;

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      globalDeferredPrompt = null;
    }
  };

  return <button onClick={handleInstall}>アプリをインストール</button>;
}
