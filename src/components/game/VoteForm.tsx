import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useLocalContext } from "../../context/game/local";
import PullDown from "./PullDown";

interface VoteFormProps {
  playerId: number;
  onSelected: () => void;
}

export default function VoteForm({ playerId, onSelected }: VoteFormProps) {
  const { players, setPlayers } = useLocalContext();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const voteCandidates = players.filter((p) => !p.isDead && p.id !== playerId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ voteTargetId: string }>();

  const onSubmit = async (data: { voteTargetId: string }) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? {
              ...p,
              voteTarget: [...(p.voteTarget || []), Number(data.voteTargetId)],
            }
          : p
      )
    );
    setIsSubmitted(true); // 状態更新後 useEffect にて onSelected 実行
  };

  useEffect(() => {
    const updated = players.find((p) => p.id === playerId);
    if (updated?.voteTarget !== null && isSubmitted) {
      onSelected();
    }
  }, [players, playerId, onSelected, isSubmitted]);

  return (
    <>
      <div className="border-[2px] border-[#b7b7b7] w-[80svw]" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[80svw] mt-[2svh] flex flex-col items-center"
      >
        <div className="w-full h-[23svh] bg-white rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] p-[5svw] flex flex-col items-center justify-start">
          <p className="font-MoboBold text-black text-[2.2svh] text-center mb-[2svh]">
            処刑者を選択してください。
          </p>

          <motion.div
            animate={
              errors.voteTargetId
                ? { x: [0, -10, 10, -6, 6, -3, 3, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <PullDown
              options={[
                ...voteCandidates.map((v) => ({
                  id: v.id.toString(),
                  name: v.name,
                })),
                { id: "0", name: "処刑をスキップ" },
              ]}
              register={register("voteTargetId", { required: true })}
            />
          </motion.div>
        </div>

        <motion.button
          type="submit"
          className={`bg-[#47a2ff] -mt-[2.1svh] w-[12svh] h-[4.2svh] rounded-full flex justify-center items-center cursor-pointer ${
            isSubmitting || isSubmitted ? "opacity-50 pointer-events-none" : ""
          }`}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting || isSubmitted}
        >
          <p className="text-white text-[1.7svh]">
            {isSubmitting ? "送信中..." : "決定"}
          </p>
        </motion.button>
      </form>
    </>
  );
}
