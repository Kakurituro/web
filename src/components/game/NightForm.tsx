import { motion } from "motion/react";
import { useLocalContext } from "../../context/game/local";
import PullDown from "./PullDown";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface NightFormInfoProps {
  playerId: number;
  onSelected: () => void;
}

export default function NightFormInfo({
  playerId,
  onSelected,
}: NightFormInfoProps) {
  const {
    players: contextPlayers,
    setPlayers,
    executedByVote,
    gameSetting,
  } = useLocalContext();

  const player = contextPlayers.find((v) => v.id === playerId);
  const [announce, setAnnounce] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ TargetId1: string; TargetId2: string }>();

  useEffect(() => {
    if (player?.charactersCode === "medium") {
      const executedId =
        executedByVote.length > 0
          ? executedByVote[executedByVote.length - 1]
          : undefined;
      const executed = contextPlayers.find(
        (v) => v.id === executedId && v.isDead
      );
      const resultText = executed
        ? `${executed.name} は${
            executed.charactersCode === "wolf"
              ? "人狼です。"
              : "人狼ではありません。"
          }`
        : "処刑された人はいません。";
      setAnnounce(resultText);
    }

    if (
      player &&
      !["seer", "wolf", "knight", "hero", "medium"].includes(
        player.charactersCode!
      )
    ) {
      setAnnounce("夜に使用可能な能力はありません。");
    }
  }, [player?.charactersCode, executedByVote, contextPlayers]);

  const onSubmit = (data: { TargetId1: string; TargetId2: string }) => {
    const id1 = Number(data.TargetId1);
    const id2 = data.TargetId2 ? Number(data.TargetId2) : null;

    if (!isNaN(id1) && (!id2 || id1 !== id2)) {
      const newTargets = [id1];
      if (id2) newTargets.push(id2);

      console.log("=== onSubmit実行 ===");
      console.log("playerId:", playerId);
      console.log("役職:", player?.charactersCode);
      console.log("更新前のabilityTarget:", player?.abilityTarget);
      console.log("追加するnewTargets:", newTargets);

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId
            ? { ...p, abilityTarget: [...p.abilityTarget, newTargets] }
            : p
        )
      );

      if (player?.charactersCode === "seer") {
        console.log("占い師の処理で早期リターン");
        const seerTarget = contextPlayers.find((v) => v.id === id1);
        setAnnounce(
          `${seerTarget?.name} は${
            seerTarget?.charactersCode === "wolf"
              ? "人狼です。"
              : "人狼ではありません。"
          }`
        );
        return;
      }

      console.log("onSelected()を呼び出し");
      onSelected();
    }
  };

  if (announce) {
    return (
      <div className="w-[80%] mt-[2%] flex flex-col items-center">
        <div className="w-full h-[23%] bg-white rounded-[6px] shadow p-[5%] flex items-center justify-center">
          <p className="text-[2.2vh] font-MoboBold text-center text-black">
            {announce}
          </p>
        </div>
        <motion.button
          onClick={() => {
            setAnnounce(undefined);
            onSelected();
          }}
          className="bg-[#47a2ff] -mt-[2.1%] w-[12vh] h-[4.2vh] rounded-full flex justify-center items-center cursor-pointer"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <p className="text-white text-[1.7vh]">確認</p>
        </motion.button>
      </div>
    );
  }

  const renderFormByRole = () => {
    const shake = {
      animate: { x: [0, -15, 15, -10, 10, -5, 5, 0] },
      transition: { duration: 0.67 },
    };

    switch (player?.charactersCode) {
      case "wolf":
      case "seer": {
        const targets = contextPlayers.filter(
          (v) => !v.isDead && v.id !== player.id
        );
        const label =
          player.charactersCode === "wolf" ? "噛み対象" : "占う対象";
        return (
          <>
            <p className="font-MoboBold text-black text-[2.2vh] text-center mb-[2%]">
              {label}を選択してください。
            </p>
            <motion.div {...(errors.TargetId1 ? shake : {})}>
              <PullDown
                options={targets.map((v) => ({
                  id: v.id.toString(),
                  name: v.name,
                }))}
                register={register("TargetId1", { required: true })}
              />
            </motion.div>
          </>
        );
      }

      case "knight":
      case "hero": {
        const isHero = player.charactersCode === "hero";
        const lastTarget =
          player.abilityTarget.length > 0
            ? player.abilityTarget[player.abilityTarget.length - 1]
            : [];

        let targets = (
          isHero
            ? gameSetting.heroAllowRepeatProtect
            : gameSetting.knightAllowRepeatProtect
        )
          ? contextPlayers.filter((v) => !v.isDead)
          : contextPlayers.filter(
              (v) => !v.isDead && !lastTarget.includes(v.id)
            );

        const canSelfProtect = isHero
          ? gameSetting.heroCanSelfProtect
          : gameSetting.knightCanSelfProtect;

        if (!canSelfProtect) {
          targets = targets.filter((v) => v.id !== player.id);
        }

        if (targets.length === 0) {
          return (
            <p className="font-MoboBold text-black text-[2.2vh] text-center mb-[2%]">
              守れる対象がいません。
            </p>
          );
        }

        const isFirstDay = lastTarget.length === 0;

        return (
          <>
            <p className="font-MoboBold text-black text-[2.2vh] text-center mb-[2%]">
              {isHero && isFirstDay
                ? "守る対象を2人選択してください。"
                : "守る対象を選択してください。"}
            </p>
            <motion.div
              className="flex flex-col gap-2"
              {...(errors.TargetId1 || errors.TargetId2 ? shake : {})}
            >
              <PullDown
                options={targets.map((v) => ({
                  id: v.id.toString(),
                  name: v.name,
                }))}
                register={register("TargetId1", { required: true })}
              />
              {isHero && isFirstDay && (
                <PullDown
                  options={targets.map((v) => ({
                    id: v.id.toString(),
                    name: v.name,
                  }))}
                  register={register("TargetId2", {
                    required: true,
                    validate: (value) =>
                      value !== watch("TargetId1") || "同じ対象を2回選べません",
                  })}
                />
              )}
            </motion.div>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <div className="border-[2px] border-[#b7b7b7] w-[80%]" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[80%] mt-[2%] flex flex-col items-center"
      >
        <div className="w-full h-[23%] bg-white rounded-[6px] shadow p-[5%] flex flex-col items-center justify-start">
          {renderFormByRole()}
        </div>
        {["seer", "wolf", "knight", "hero"].includes(
          player?.charactersCode!
        ) && (
          <motion.button
            type="submit"
            className="bg-[#47a2ff] -mt-[2.1%] w-[12vh] h-[4.2vh] rounded-full flex justify-center items-center cursor-pointer"
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <p className="text-white text-[1.7vh]">次へ</p>
          </motion.button>
        )}
      </form>
    </>
  );
}
