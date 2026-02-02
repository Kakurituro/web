import { motion } from "motion/react";
import CardBack from "../../../components/characters/CardBack";
import { useLocalContext } from "../../../context/game/local";
import Announce from "../../../components/game/Announce";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "../../../components/game/NavButton";
import isGameEnd from "../../../utils/isGameEnd";
const CARD_RADIUS = 100;

export default function Noon() {
  const { players: contextPlayers, gameSetting } = useLocalContext();
  const aliveCount = contextPlayers.filter((v) => !v.isDead).length;
  const cards = Array.from({ length: aliveCount });

  const [announce, setAnnounce] = useState<string | undefined>();
  const [onAnnounceConfirm, setOnAnnounceConfirm] = useState<
    (() => void) | undefined
  >();
  const [onAnnounceCancel, setOnAnnounceCancel] = useState<
    (() => void) | undefined
  >();
  const [hasAnnounced, setHasAnnounced] = useState(false); // 初期アナウンス制御

  const [timeLeft, setTimeLeft] = useState(gameSetting.discussionMinutes * 60);
  const [extended, setExtended] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  // 初期アナウンス表示 → 確認後 議論開始アナウンス
  useEffect(() => {
    if (isGameEnd(contextPlayers) != "continue") {
      navigate("/game/local/result");
    }
    setAnnounce("朝になりました。議論を開始してください。");
    setOnAnnounceConfirm(() => () => {
      setOnAnnounceConfirm(undefined);
      setHasAnnounced(true);
    });
  }, []);

  // アナウンス消えたらタイマー開始
  useEffect(() => {
    if (hasAnnounced && !announce) {
      setTimerActive(true);
    }
  }, [announce, hasAnnounced]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimerActive(false);
      setAnnounce("時間切れです");
      setOnAnnounceConfirm(() => () => {
        navigate("/game/local/vote");
      });
    }
  }, [timeLeft, navigate]);

  const handleExtend = () => {
    if (!extended) {
      setTimeLeft((prev) => prev + gameSetting.prolongDiscussionMinutes * 60);
      setExtended(true);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleCancelAnnounce = () => {
    setAnnounce(undefined);
    setOnAnnounceConfirm(undefined);
    setOnAnnounceCancel(undefined);
    setTimerActive(true);
  };

  return (
    <motion.div
      className="relative min-h-screen w-screen overflow-hidden flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pt-[calc(env(safe-area-inset-top)) mt-[10svh] flex">
        <div className="bg-black/70 text-white rounded font-Barlow text-[5svh] px-[4svw]">
          {formatTime(timeLeft)}
        </div>

        {!extended && (
          <button
            onClick={handleExtend}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded ml-[5svw] px-[4svw] text-[5svh] font-Barlow"
          >
            +{gameSetting.prolongDiscussionMinutes}:00
          </button>
        )}
      </div>
      <div className="w-[100svw] h-[60svh] flex relative">
        {cards.map((_, i) => {
          const angle = (i / aliveCount) * 2 * Math.PI;
          const x = CARD_RADIUS * Math.cos(angle);
          const y = CARD_RADIUS * Math.sin(angle);
          const deg = (angle * 180) / Math.PI + 90;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, x, y }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="absolute left-1/2 top-1/2"
            >
              <div
                style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
              >
                <CardBack w_svw={21} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {announce && (
        <Announce
          text={announce}
          onConfirm={() => {
            if (onAnnounceConfirm) onAnnounceConfirm();
            else setAnnounce(undefined);
          }}
          onCancel={onAnnounceCancel}
          confirmText="はい"
          cancelText="戻る"
          showCancel={!!onAnnounceCancel}
        />
      )}

      <NavButton
        back={() => {
          setTimerActive(false);
          setAnnounce("ゲームを中止しますか？");
          setOnAnnounceConfirm(() => () => navigate("/"));
          setOnAnnounceCancel(() => handleCancelAnnounce);
        }}
        next="/game/local/vote"
        backText="中止"
        nextText="投票"
      />
    </motion.div>
  );
}
