import React, { useState } from "react";
import { type PlayerType, useLocalContext } from "../../../context/game/local";
import Announce from "../../../components/game/Announce";
import CardBack from "../../../components/characters/CardBack";
import { motion } from "motion/react";
import Card from "../../../components/characters/Card";
import { useNavigate } from "react-router-dom";
import characterCodeToInfo from "../../../utils/characterCodeToInfo";
import shuffleArray from "../../../utils/shuffleArray";
import type { gameSetting } from "../../../context/game/local";
import type { character } from "../../../types/character";

// ユーザー側でインポートする想定の関数

// --- NoticeInfoコンポーネントの定義 ---

interface RoleInfoProps {
  playerId: number;
}

function NoticeInfo({ playerId }: RoleInfoProps) {
  const { players: contextPlayers, gameSetting } = useLocalContext();
  const player = contextPlayers.find((v) => v.id === playerId);
  const character = characterCodeToInfo(player?.charactersCode!);
  let addInfo = AddInfo(contextPlayers, character!, gameSetting, player!);

  return (
    <>
      <div className="border-[2px] border-[#b7b7b7] w-[80%]" />
      <div className="w-[80%] h-[23%] bg-white mt-[2%] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] p-[5%] flex items-center justify-center">
        <div className="font-MoboBold text-black text-[2.2vh] text-center">
          <p>{`あなたの役職は「${character?.name ?? "不明"}」です`}</p>
          {addInfo.map((v, idx) => (
            <p key={idx}>{v}</p>
          ))}
        </div>
      </div>
    </>
  );
}

function AddInfo(
  contextplayers: PlayerType[],
  character: character,
  gameSetting: gameSetting,
  player: PlayerType,
): string[] {
  let result: string[] = [];

  switch (character.code) {
    case "wolf":
      if (gameSetting.wolfSeesManiac) {
        let maniac = contextplayers.filter(
          (v) => v.charactersCode === "maniac" && v.id !== player.id,
        );
        maniac.forEach((v) => {
          result.push(`${v.name} は狂人です`);
        });
      }
      if (gameSetting.wolvesKnowEachOther) {
        let wolf = contextplayers.filter(
          (v) => v.charactersCode === "wolf" && v.id !== player.id,
        );
        wolf.forEach((v) => {
          result.push(`${v.name} は人狼です`);
        });
      }
      break;
    case "maniac":
      if (gameSetting.maniacSeesWolf) {
        let wolf = contextplayers.filter(
          (v) => v.charactersCode === "wolf" && v.id !== player.id,
        );
        wolf.forEach((v) => {
          result.push(`${v.name} は人狼です`);
        });
      }
      break;
    case "seer":
      if (gameSetting.seerAnnouncement) {
        let noWolf = contextplayers.filter(
          (v) => v.charactersCode !== "wolf" && v.id !== player.id,
        );
        let select = shuffleArray(noWolf)[0];
        if (select) {
          result.push(`${select.name} は人狼ではありません`);
        }
      }
      break;
  }

  return result;
}

// NoticeInfoコンポーネントをReact.memoでラップ
const MemoizedNoticeInfo = React.memo(NoticeInfo);

// --- ページの本体コンポーネント ---

export default function Notice() {
  const { players: contextPlayers } = useLocalContext();
  const [focusPlayer, setFocusPlayer] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [flipped, setFlipped] = useState<boolean>(false);

  const navigate = useNavigate();
  const currentPlayer = contextPlayers[focusPlayer];

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleNext = () => {
    if (focusPlayer < contextPlayers.length - 1) {
      setFocusPlayer(focusPlayer + 1);
      setConfirmed(false);
      setFlipped(false);
    } else {
      navigate("/game/local/noon");
    }
  };

  return (
    <motion.div
      className="min-h-full   w-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!confirmed ? (
        <Announce
          text={`${currentPlayer?.name} ですか?`}
          onConfirm={handleConfirm}
        />
      ) : (
        <div className="flex flex-col items-center justify-end pb-[7%] h-full">
          <div className="mt-auto mb-auto" style={{ perspective: "1000px" }}>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              onAnimationComplete={() => setFlipped(true)}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-fit h-fit"
            >
              {/* 裏面 */}
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
              {/* 表面 */}
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
                {currentPlayer && (
                  <Card code={currentPlayer.charactersCode!} w_svw={63} />
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* memo化されたNoticeInfoコンポーネントを呼び出す */}
          <MemoizedNoticeInfo playerId={currentPlayer.id} />

          {/* 次へボタン */}
          <div onClick={handleNext}>
            <motion.div
              className="bg-[#47a2ff] -mt-[2.1%] w-[12vh] h-[4.2vh] rounded-full flex justify-center items-center cursor-pointer"
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <p className="text-white text-[1.7vh]">はい</p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
