import { useEffect, useState } from "react";
import { useLocalContext } from "../../../context/game/local";
import Announce from "../../../components/game/Announce";
import CardBack from "../../../components/characters/CardBack";
import { motion } from "motion/react";
import Card from "../../../components/characters/Card";
import { useNavigate } from "react-router-dom";
import NightForm from "../../../components/game/NightForm";
import shuffleArray from "../../../utils/shuffleArray";
import isGameEnd from "../../../utils/isGameEnd";
export default function Night() {
  const { players: contextPlayers, setPlayers } = useLocalContext();
  const [focusPlayer, setFocusPlayer] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [announce, setAnnounce] = useState<string>();
  const [hasAnnounced, setHasAnnounced] = useState<boolean>(false);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isLastPlayerProcessing, setIsLastPlayerProcessing] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const alivePlayer = contextPlayers.filter((v) => !v.isDead);
  const currentPlayer = alivePlayer[focusPlayer];

  // 最後のプレイヤーの処理が完了したかを監視
  useEffect(() => {
    if (isLastPlayerProcessing) {
      console.log("最後のプレイヤーの状態更新を確認中...", contextPlayers);

      const result = isGameEnd(contextPlayers);
      if (result === "continue") {
        setAnnounce(abilityTotaling());
        setNextAction(() => () => {
          setIsTransitioning(true);
          console.log(contextPlayers);
          navigate("/game/local/noon");
        });
      } else {
        setIsTransitioning(true);
        navigate("/game/local/result");
      }

      setIsLastPlayerProcessing(false);
    }
  }, [contextPlayers, isLastPlayerProcessing]);

  // 既存のuseEffectは変更なし
  useEffect(() => {
    setAnnounce("夜になりました。夜の行動を開始してください。");
  }, []);

  useEffect(() => {
    if (focusPlayer >= alivePlayer.length && alivePlayer.length > 0) {
      setFocusPlayer(0);
    }
  }, [alivePlayer.length, focusPlayer]);

  useEffect(() => {
    if (confirmed) {
      setMounted(false);
      const timeout = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timeout);
    }
  }, [confirmed, focusPlayer]);

  const handleConfirm = () => setConfirmed(true);

  const handleNext = () => {
    if (focusPlayer < alivePlayer.length - 1) {
      setFocusPlayer(focusPlayer + 1);
      setConfirmed(false);
      setFlipped(false);
    } else {
      // 最後のプレイヤーの場合、状態更新の監視を開始
      setIsLastPlayerProcessing(true);
    }
  };

  // abilityTotaling関数は変更なし
  const abilityTotaling = (): string => {
    console.log("=== abilityTotaling 実行 ===");
    console.log("現在のcontextPlayers:", contextPlayers);

    // 人狼の攻撃対象を取得
    const wolfPlayers = contextPlayers.filter(
      (player) => player.charactersCode === "wolf" && !player.isDead
    );

    console.log("人狼プレイヤー:", wolfPlayers);

    const wolfTargets = wolfPlayers.flatMap((player) => {
      const last = player.abilityTarget.slice(-1)[0];
      console.log(`${player.name}のabilityTarget:`, player.abilityTarget);
      console.log(`${player.name}の最新ターゲット:`, last);
      if (!last) return [];
      return last.filter((id) => {
        const target = contextPlayers.find((p) => p.id === id);
        return target && target.charactersCode !== "wolf" && !target.isDead;
      });
    });

    // 重複を除去
    const uniqueTargets = Array.from(new Set(wolfTargets));
    console.log("攻撃対象:", uniqueTargets);

    if (uniqueTargets.length === 0) {
      return "昨晩の犠牲者はいません。①";
    }

    // ランダム選択
    const killedId = shuffleArray(uniqueTargets)[0];

    // 守護者の対象を取得
    const protectors = contextPlayers.filter(
      (p) =>
        (p.charactersCode === "knight" || p.charactersCode === "hero") &&
        !p.isDead
    );

    const protectedIds = protectors.flatMap((p) => {
      const last = p.abilityTarget.slice(-1)[0];
      return last || [];
    });

    console.log("守護対象:", protectedIds);

    // 守護チェック
    if (protectedIds.includes(killedId)) {
      return "昨晩の犠牲者はいません。②";
    }

    // 犠牲者の名前を取得してから状態更新
    const victim = contextPlayers.find((p) => p.id === killedId);
    const victimName = victim?.name || "不明";

    // 状態更新
    setTimeout(() => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === killedId ? { ...p, isDead: true } : p))
      );
    }, 0);

    return `昨晩の犠牲者は${victimName} です。`;
  };

  // 残りのコードは変更なし
  if (!currentPlayer) {
    return (
      <Announce
        text="プレイヤー情報が見つかりません。"
        onConfirm={() => navigate("/game/local")}
      />
    );
  }

  return (
    <motion.div
      className="min-h-screen w-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {announce ? (
        <Announce
          text={announce}
          onConfirm={() => {
            setAnnounce(undefined);
            if (!hasAnnounced) setHasAnnounced(true);
            if (nextAction) {
              setIsTransitioning(true);
              nextAction();
              setNextAction(null);
            }
          }}
        />
      ) : !hasAnnounced || isTransitioning ? null : !confirmed ? (
        <Announce
          text={`${currentPlayer.name} ですか?`}
          onConfirm={handleConfirm}
        />
      ) : (
        <div className="flex flex-col items-center justify-end pb-[7svh] h-[100svh]">
          <div
            className="mt-auto mb-auto"
            style={{
              perspective: "1000px",
              visibility: mounted ? "visible" : "hidden",
            }}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              onAnimationComplete={() => setFlipped(true)}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-fit h-fit"
            >
              <motion.div
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <CardBack w_svw={63} />
              </motion.div>

              <motion.div
                className="absolute top-0 left-0"
                initial={false}
                animate={{ rotateY: flipped ? 0 : -180 }}
                transition={{ duration: 0.5 }}
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <Card code={currentPlayer.charactersCode!} w_svw={63} />
              </motion.div>
            </motion.div>
          </div>

          <NightForm playerId={currentPlayer.id} onSelected={handleNext} />
        </div>
      )}
    </motion.div>
  );
}
