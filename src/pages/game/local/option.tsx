import { motion } from "motion/react";
import Title from "../../../components/Title";
import NavButton from "../../../components/game/NavButton";
import { useForm, type UseFormRegister } from "react-hook-form";
import { useLocalContext } from "../../../context/game/local";
import type { gameSetting } from "../../../context/game/local";
import { useNavigate } from "react-router-dom";

type FormValues = gameSetting;

export default function Option() {
  const navigate = useNavigate();
  const { gameSetting, setGameSetting } = useLocalContext();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: Object.fromEntries(
      Object.entries(gameSetting).map(([k, v]) => [
        k,
        typeof v === "boolean" ? String(v) : v,
      ]),
    ) as any,
  });

  const onSubmit = (data: any) => {
    // boolean値のradioはstringとして渡されるため、変換
    const parsed = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        k,
        v === "true" ? true : v === "false" ? false : Number(v),
      ]),
    ) as gameSetting;

    setGameSetting(parsed);
    navigate("/game/local/notice");
  };

  return (
    <div className="h-[100%] w-[100%]">
      <motion.div
        className="h-[100%] w-[100%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title title="オプション選択" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 px-[10svw] py-[0.6svh] overflow-y-auto space-y-[2vh] h-[67svh]"
        >
          <OptionRadio
            label="占い師のお告げ"
            name="seerAnnouncement"
            register={register}
          />
          <OptionRadio
            label="英雄が連続で同じ人を守れる"
            name="heroAllowRepeatProtect"
            register={register}
          />
          <OptionRadio
            label="英雄が自分を守る"
            name="heroCanSelfProtect"
            register={register}
          />
          <OptionRadio
            label="騎士が連続で同じ人を守れる"
            name="knightAllowRepeatProtect"
            register={register}
          />
          <OptionRadio
            label="騎士が自分を守る"
            name="knightCanSelfProtect"
            register={register}
          />
          <OptionRadio
            label="狂人が人狼を知る"
            name="maniacSeesWolf"
            register={register}
          />
          <OptionRadio
            label="人狼が狂人を知る"
            name="wolfSeesManiac"
            register={register}
          />
          <OptionRadio
            label="人狼同士が認識できる"
            name="wolvesKnowEachOther"
            register={register}
          />
          <OptionRadio
            label="投票先の公開"
            name="voteTargetOpen"
            register={register}
          />
          <OptionNumber
            label="議論の時間"
            name="discussionMinutes"
            register={register}
          />
        </form>

        <div className="px-[4svw] pb-[3svh]">
          <NavButton
            next={handleSubmit(onSubmit)}
            nextText="開始"
            back={"/game/local/players"}
          />
        </div>
      </motion.div>
    </div>
  );
}

// サブコンポーネント: ラジオボタン
function OptionRadio({
  label,
  name,
  register,
}: {
  label: string;
  name: keyof FormValues;
  register: UseFormRegister<FormValues>;
}) {
  return (
    <div className="bg-white rounded-[6px] shadow-md p-[2.9svw] flex flex-col justify-center h-[10svh]">
      <p className="font-MoboBold text-[4.5svw] text-black">{label}</p>
      <div className="flex mt-[0.7svh]">
        <label className="mr-[5svw] flex items-center">
          <input
            type="radio"
            value="true"
            className="font-MoboBold text-[2.3svw] text-black w-[2.3svw]"
            {...register(name)}
          />
          <p className="text-[4svw] ml-[0.7svw]">はい</p>
        </label>
        <label className="mr-4 flex items-center">
          <input
            type="radio"
            value="false"
            className="font-MoboBold text-[2.3svh] text-black w-[2.3svw]"
            {...register(name)}
          />
          <p className="text-[4svw] ml-[0.7svw]">いいえ</p>
        </label>
      </div>
    </div>
  );
}

function OptionNumber({
  label,
  name,
  register,
}: {
  label: string;
  name: keyof FormValues;
  register: UseFormRegister<FormValues>;
}) {
  return (
    <div className="bg-white rounded-[6px] shadow-md p-[2.9svw] flex flex-col justify-center h-[10svh]">
      <p className="font-MoboBold text-[4.5svw] text-black">{label}</p>

      <div className="flex items-center text-black p-0 mt-[0.7svh]">
        <input
          type="number"
          {...register(name, {
            valueAsNumber: true,
            validate: (value) =>
              (typeof value === "number" && value > 0) ||
              "1以上を入力してください",
            min: {
              value: 1,
              message: "1以上を入力してください",
            },
            max: {
              value: 94,
              message: "94以下を入力してください",
            },
          })}
          className=""
        />
        <p className="text-[4svw] leading-[0.7svw] text-black">分</p>
      </div>
    </div>
  );
}
