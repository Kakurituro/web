import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallNotice() {
  const controls = useAnimation();
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

    // すでにインストール済みかチェック
    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [isInstalled]);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!deferredPrompt) {
        await controls.start({
          x: [0, -10, 10, -6, 6, -3, 3, 0],
          transition: { duration: 0.5 },
        });
        return;
      }

      // インストールプロンプトを表示
      deferredPrompt.prompt();

      // ユーザーの選択を待つ
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }

      // プロンプトをクリア
      setDeferredPrompt(null);
    },
    [deferredPrompt, controls]
  );

  // インストール済みまたは利用不可の場合は表示しない
  if (isInstalled) {
    return null;
  }

  const isDisabled = !deferredPrompt;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) {
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent);
      }
    },
    [handleClick, isDisabled]
  );

  return (
    <div className="w-full flex justify-center">
      <motion.div
        animate={controls}
        whileTap={!isDisabled ? { scale: 0.9 } : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        className={`relative bg-white flex w-[75%] px-[1%] py-[3%] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] items-center ${
          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {isDisabled && (
          <div
            className="absolute inset-0 bg-gray-300 opacity-50 rounded-[6px] pointer-events-none z-10"
            aria-hidden="true"
          />
        )}

        {/* レイアウト調整用の空白 */}
        <div className="w-[3%] relative z-20"></div>
        <div className="ml-[2%] relative z-20">
          <p className="font-MoboBold text-black text-[5.4svw] leading-[5.7svw]">
            PWAとしてインストール
          </p>
          <p className="text-blacksub text-[2.7svw] mt-[1.5%]">
            {isDisabled
              ? "このブラウザではPWAインストールが利用できません"
              : "アプリとしてインストールして快適にプレイ"}
          </p>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/common/arrow.svg`}
          className="h-[25%] ml-[3%] absolute right-[5.5%] z-20"
          alt=""
          role="presentation"
        />
      </motion.div>
    </div>
  );
}
