import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaInstallButtonProps {
  onInstallSuccess?: () => void;
}

const PwaInstallButton = ({ onInstallSuccess }: PwaInstallButtonProps) => {
  // PWAがすでにインストールされているかチェック（初期化時に）
  const [isInstalled, setIsInstalled] = useState(() =>
    window.matchMedia("(display-mode: standalone)").matches
  );
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // すでにインストール済みの場合はイベントリスナーを設定しない
    if (isInstalled) {
      return;
    }

    // beforeinstallpromptイベントをキャプチャ
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // すでにインストール済みかチェック
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setIsInstalled(true);
      onInstallSuccess?.();
    }

    // プロンプトをクリア
    setDeferredPrompt(null);
  };

  // インストール済みの場合
  if (isInstalled) {
    return null;
  }

  // インストール可能でない場合（ブラウザが対応していない、またはすでにインストール済み）
  if (!deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
    >
      アプリとしてインストール
    </button>
  );
};

export default PwaInstallButton;
