import { motion } from "motion/react";
import Circle from "../../../components/characters/circle";
import NavButton from "../../../components/game/NavButton";
import Title from "../../../components/Title";
import { useLocalContext } from "../../../context/game/local";
import isGameEnd from "../../../utils/isGameEnd";

export default function Result() {
  const { players: contextPlayers } = useLocalContext();
  const result = isGameEnd(contextPlayers);

  const wolfs = contextPlayers.filter(
    (v) => v.charactersCode === "wolf" || v.charactersCode === "maniac"
  );
  const citizens = contextPlayers.filter(
    (v) => v.charactersCode !== "wolf" && v.charactersCode !== "maniac"
  );

  const isWolfWin = result === "wolfWin";
  const winners = isWolfWin ? wolfs : citizens;
  const losers = isWolfWin ? citizens : wolfs;

  return (
    <div className="h-[100%] w-[100%]">
      <motion.div
        className="h-[100%] w-[100%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title title="結果" />

        <div className="flex-1 px-[10%] py-[2%] overflow-y-auto space-y-[2.5%] h-[86%]">
          {/* 勝利陣営 */}
          <div className="bg-white rounded-[6px] shadow-md p-[2vh] space-y-[1.5vh]">
            <p className="font-MoboBold text-[2.5vh] text-green-700 text-center">
              勝利：{isWolfWin ? "人狼陣営" : "市民陣営"}
            </p>
            <div className="space-y-2">
              {winners.map((v, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 pb-2 ${
                    idx !== winners.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <Circle code={v.charactersCode!} size={"10vw"} />
                  <p className="font-MoboBold text-[2.2vh] text-gray-800">
                    {v.name ?? "名無し"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 敗北陣営 */}
          <div className="bg-white rounded-[6px] shadow-md p-[2vh] space-y-[1.5vh]">
            <p className="font-MoboBold text-[2.5vh] text-red-700 text-center">
              敗北：{!isWolfWin ? "人狼陣営" : "市民陣営"}
            </p>
            <div className="space-y-2">
              {losers.map((v, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 pb-2 ${
                    idx !== losers.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <Circle code={v.charactersCode!} size={"10vw"} />
                  <p className="font-MoboBold text-[2.2vh] text-gray-800">
                    {v.name ?? "名無し"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-[4%] pb-[3%]">
          <NavButton next={"/"} />
        </div>
      </motion.div>
    </div>
  );
}
