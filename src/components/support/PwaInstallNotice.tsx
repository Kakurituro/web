import { motion, useAnimation } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// 画面遷移しても消えないようにコンポーネントの外で保持
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export default function PwaInstallNotice() {
  const controls = useAnimation();

  const [isInstalled, setIsInstalled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches,
  );

  // 初期値として、すでに保存されているグローバルプロンプトを参照する
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);

  useEffect(() => {
    if (isInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent; // グローバルに保存
      setDeferredPrompt(promptEvent); // Stateに反映
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      globalDeferredPrompt = null;
    };

    // すでにイベントが発火済みで保存されている場合を考慮
    if (globalDeferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt);
    }

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
        // インストール不可時のシェイクアニメーション
        await controls.start({
          x: [0, -10, 10, -6, 6, -3, 3, 0],
          transition: { duration: 0.5 },
        });
        return;
      }

      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        globalDeferredPrompt = null;
      }
      setDeferredPrompt(null);
    },
    [deferredPrompt, controls],
  );

  if (isInstalled) return null;

  const isDisabled = !deferredPrompt;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent);
      }
    },
    [handleClick, isDisabled],
  );

  return (
    <div className="w-full flex justify-center mb-4.5">
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

        <div className="w-[3%] relative z-20"></div>
        <div className="ml-[2%] relative z-20">
          <p className="font-MoboBold text-black text-[5.4svw] leading-[5.7svw]">
            アプリをインストール
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
