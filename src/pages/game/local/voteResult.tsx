import { motion } from "motion/react";
import Title from "../../../components/Title";
import NavButton from "../../../components/game/NavButton";
import { useLocalContext } from "../../../context/game/local";
import { useNavigate } from "react-router-dom";

export default function VoteResult() {
  const { players } = useLocalContext();
  console.log(players);
  const navigate = useNavigate();

  return (
    <div className="h-[100%] w-[100%]">
      <motion.div
        className="h-[100%] w-[100%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title title="投票結果" />

        <div className="flex-1 px-[10%] py-[2%] overflow-y-auto space-y-[2.5%] h-[86%]">
          <div className="bg-white rounded-[6px] shadow-md p-[2vh] space-y-[1.5vh]">
            {(() => {
              if (!players || players.length === 0) return null;

              // voteTargetの最大長を取得
              const maxLength = Math.max(
                ...players.map((p) => p.voteTarget.length)
              );

              // voteTarget長がmaxLengthのプレイヤーだけ抽出
              const maxPlayers = players.filter(
                (p) => p.voteTarget.length === maxLength
              );

              return maxPlayers.map((player) => {
                const lastTargetId =
                  player.voteTarget[player.voteTarget.length - 1];
                const target = players.find((p) => p.id === lastTargetId);
                return (
                  <div
                    key={`${player.id}-${lastTargetId}`}
                    className="flex items-center gap-4 pb-2"
                  >
                    <div className="flex items-center gap-2 w-[35%] min-w-[100px]">
                      <p className="font-MoboBold text-[2.2vh] text-gray-800 truncate">
                        {player.name}
                      </p>
                    </div>
                    <p className="text-[2vh] text-gray-600 w-[5%] text-center">
                      &#x25B6;
                    </p>
                    <div className="flex items-center gap-2 w-[35%] min-w-[100px]">
                      <p className="font-MoboBold text-[2.2vh] text-gray-800 truncate">
                        {lastTargetId === 0
                          ? "スキップ"
                          : target?.name ?? "不明"}
                      </p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="px-[4%] pb-[3%]">
          <NavButton
            next={() => {
              navigate("/game/local/night");
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
