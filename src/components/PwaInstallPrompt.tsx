import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 初回訪問かどうかをチェック
    const hasVisited = localStorage.getItem("pwa-visited");

    if (!hasVisited) {
      // beforeinstallpromptイベントをキャプチャ
      const handler = (e: Event) => {
        // デフォルトの動作を防止
        e.preventDefault();
        // イベントを保存してあとで使用
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWAインストール: 受け入れ");
    } else {
      console.log("PWAインストール: 拒否");
    }

    // 訪問済みフラグを設定
    localStorage.setItem("pwa-visited", "true");

    // プロンプトをクリア
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // 訪問済みフラグを設定
    localStorage.setItem("pwa-visited", "true");
    setShowPrompt(false);
  };

  // プロンプトを表示しない場合は何もレンダリングしない
  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md mx-4 mb-8 bg-[#2a2a2a] rounded-2xl shadow-2xl border border-[#3a3a3a] overflow-hidden animate-slide-up">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}pwa-192x192.png`}
                alt="確率狼"
                className="w-16 h-16 rounded-xl"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">
                確率狼をインストール
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                アプリとしてインストールして、いつでも快適にプレイできます
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  インストール
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  後で
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
