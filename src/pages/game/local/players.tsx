import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Player from "../../../components/game/Player";
import Title from "../../../components/Title";
import { useLocalContext } from "../../../context/game/local";
import { useNavigate } from "react-router-dom";
import type { characterCode } from "../../../types/character";
import NavButton from "../../../components/game/NavButton";
import Announce from "../../../components/game/Announce";

type FormValues = {
  players: {
    name: string;
  }[];
};

export default function Players() {
  const navigate = useNavigate();

  const { players: contextPlayers, setPlayers } = useLocalContext();
  const [announce, setAnnounce] = useState<string | undefined>(undefined);
  const [hasAnnounced, setHasAnnounced] = useState<boolean>(false);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);
  const [cancel, setCancel] = useState<boolean>(false);

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      players:
        contextPlayers.length > 0
          ? contextPlayers.map((p) => ({
              name: p.name,
              charactersCode: undefined,
              isDead: false,
              voteTarget: [],
              abilityTarget: [],
            }))
          : Array.from({ length: 3 }, () => ({ name: "" })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  useEffect(() => {
    if (contextPlayers.length > 0) {
      reset({
        players: contextPlayers.map((p) => ({ name: p.name })),
      });
    }
  }, [contextPlayers, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const names = data.players.map((p) => p.name.trim());

    if (names.length < 3) {
      setAnnounce("プレイヤーは3人以上必要です");
      return;
    }

    if (names.length > 100) {
      setAnnounce("100人以上のプレイヤーは入力できません");
      return;
    }

    const nameSet = new Set<string>();
    for (const name of names) {
      if (nameSet.has(name)) {
        setAnnounce("同じ名前は使用できません");
        return;
      }
      nameSet.add(name);
    }

    const formattedPlayers = names.map((name, i) => ({
      id: i + 1,
      name,
      charactersCode: undefined as unknown as characterCode,
      isDead: false,
      voteTarget: [],
      abilityTarget: [],
    }));

    setPlayers(formattedPlayers);
    navigate("/game/local/characters");
  };

  const onInvalid = (errors: any) => {
    const firstError = errors.players?.find(
      (playerError: any) => playerError?.name,
    );
    if (firstError?.name?.message) {
      setCancel(false);
      setAnnounce(firstError.name.message);
    }
  };

  return (
    <div className="h-[100%] w-[100%]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {announce ? (
          <Announce
            text={announce}
            onConfirm={() => {
              setAnnounce(undefined);
              if (!hasAnnounced) setHasAnnounced(true);
              if (nextAction) {
                nextAction();
                setNextAction(null);
              }
            }}
            onCancel={() => {
              setAnnounce(undefined);
              setNextAction(null);
            }}
            showCancel={cancel}
          />
        ) : null}

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="h-full w-full overflow-x-clip overflow-y-clip"
        >
          <div className="h-full">
            <Title title="プレイヤー設定" />
            <div className="flex flex-col justify-center items-center space-y-2 ">
              <div className="h-[67%] overflow-y-scroll w-[70%]">
                <AnimatePresence initial={false}>
                  {fields.map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex justify-center mb-[2.7%]"
                    >
                      <Player
                        number={i + 1}
                        {...register(`players.${i}.name` as const, {
                          required: "名前は必須です",
                          maxLength: {
                            value: 10,
                            message: "名前は10文字以内です",
                          },
                          minLength: {
                            value: 1,
                            message: "名前は1文字以上で入力してください",
                          },
                        })}
                        onRemove={() => remove(i)}
                        disableRemove={fields.length <= 3}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="rounded-[6px] flex items-center justify-start bg-no-repeat h-[10.5vw]"
                  style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/game/player_add.svg')` }}
                >
                  <div
                    className="w-[100%] h-[100%]"
                    onClick={() => append({ name: "" })}
                  ></div>
                </motion.div>
              </div>
            </div>

            {/* ← 確認付きで戻る */}
          </div>
        </form>
      </motion.div>
      <NavButton
        back={() => {
          setAnnounce("ホームに戻りますか?");
          setCancel(true);
          setNextAction(() => () => navigate("/"));
        }}
        next={() => handleSubmit(onSubmit, onInvalid)()}
      />
    </div>
  );
}
