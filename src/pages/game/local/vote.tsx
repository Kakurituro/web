import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocalContext } from "../../../context/game/local";
import Announce from "../../../components/game/Announce";
import CardBack from "../../../components/characters/CardBack";
import { motion } from "motion/react";
import Card from "../../../components/characters/Card";
import { useNavigate } from "react-router-dom";
import VoteForm from "../../../components/game/VoteForm";
import isGameEnd from "../../../utils/isGameEnd";

export default function Vote() {
  const {
    players: contextPlayers,
    setPlayers,
    executedByVote,
    setExecutedByVote,
    gameSetting,
  } = useLocalContext();

  const navigate = useNavigate();

  const alivePlayers = useMemo(
    () => contextPlayers.filter((p) => !p.isDead),
    [contextPlayers]
  );

  const [focusIndex, setFocusIndex] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [announce, setAnnounce] = useState<string>();
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayer = alivePlayers[focusIndex];

  // 初期アナウンス
  useEffect(() => {
    setAnnounce("これから処刑者を決める投票を行います");
  }, []);

  // 不正なインデックスを修正
  useEffect(() => {
    if (focusIndex >= alivePlayers.length) {
      setFocusIndex(0);
    }
  }, [alivePlayers.length, focusIndex]);

  // カード表示用アニメーション準備
  useEffect(() => {
    if (confirmed) {
      setMounted(false);
      const timeout = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timeout);
    }
  }, [confirmed, focusIndex]);

  const handleConfirm = () => setConfirmed(true);

  const calculateVoteResult = useCallback(() => {
    const voteCount: Record<number, number> = {};

    contextPlayers.forEach((player) => {
      if (!player.isDead) {
        const targetId =
          player.voteTarget.length > 0
            ? player.voteTarget[player.voteTarget.length - 1]
            : undefined;
        if (targetId !== undefined) {
          voteCount[targetId] = (voteCount[targetId] || 0) + 1;
        }
      }
    });

    const maxVotes = Math.max(...Object.values(voteCount), 0);
    const topVoted = Object.entries(voteCount)
      .filter(([_, count]) => count === maxVotes)
      .map(([id]) => Number(id));
    let executedId: number | undefined;
    let updatedPlayers = [...contextPlayers];

    if (topVoted.length > 0) {
      executedId = topVoted[Math.floor(Math.random() * topVoted.length)];
      updatedPlayers = updatedPlayers.map((p) =>
        p.id === executedId
          ? {
              ...p,
              isDead: true,
            }
          : p
      );
      setExecutedByVote([...executedByVote, executedId]);
      setPlayers(updatedPlayers);
    }

    const executedName = contextPlayers.find((p) => p.id === executedId)?.name;
    return { executedName, updatedPlayers };
  }, [contextPlayers, executedByVote, setExecutedByVote, setPlayers]);

  const handleNext = () => {
    if (focusIndex < alivePlayers.length - 1) {
      setFocusIndex((prev) => prev + 1);
      setConfirmed(false);
      setFlipped(false);
      return;
    }

    const { executedName, updatedPlayers } = calculateVoteResult();
    const gameState = isGameEnd(updatedPlayers);

    setAnnounce(
      executedName
        ? `${executedName} が処刑されました。`
        : "処刑がスキップされました。"
    );

    setNextAction(() => () => {
      setAnnounce(undefined);
      setConfirmed(false);
      setFlipped(false);
      setIsTransitioning(true); // ここでトランジション開始
      console.log("NightかResultかvote-Resultに行く前のPlayersの状態");
      console.log(contextPlayers);
      navigate(
        gameState === "continue"
          ? gameSetting.voteTargetOpen
            ? "/game/local/vote-result"
            : "/game/local/night"
          : "/game/local/result"
      );
    });
  };

    if (!currentPlayer) {
    return (
      <div className="min-h-full bg-black text-white flex items-center justify-center">
        <p>有効なプレイヤーが存在しません。</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-full w-full flex items-center justify-center"
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
            }
          }}
        />
      ) : !hasAnnounced || isTransitioning ? null : !confirmed ? (
        <Announce
          text={`${currentPlayer.name} ですか?`}
          onConfirm={handleConfirm}
        />
      ) : (
        <div className="flex flex-col items-center justify-end pb-[7%] h-full">
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
              className="relative w-fit h-fit"
              style={{ transformStyle: "preserve-3d" }}
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

          <VoteForm playerId={currentPlayer.id} onSelected={handleNext} />
        </div>
      )}
    </motion.div>
  );
}
