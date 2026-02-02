import { motion } from "motion/react";
import Tag from "../characters/Tag";
import NumberInput from "./NumberInput";
import { useHopupContext } from "../../context/hopup";
import { characters } from "../../utils/characters";
import type { characterCode } from "../../types/character";
import Circle from "../characters/circle";

type RoleSettingProps = {
  code: characterCode;
  namePrefix: string;
};

export default function CharacterSetting({
  code,
  namePrefix,
}: RoleSettingProps) {
  const { setHopups, setIsVisible } = useHopupContext();

  let character = characters.find((v) => {
    return v.code == code;
  })!;

  return (
    <motion.div className="bg-white w-[63svw] mb-[1.8vh] flex items-center p-[0.5svh] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] relative">
      <div className="mr-[2.5svw]">
        <Circle code={code} size="14svw" />
      </div>
      <div className="">
        <p className="text-black font-MoboBold text-[5svw] leading-[5svw]">
          {character.name}
        </p>
        <Tag team={character.team} />
      </div>
      <div className="absolute right-[9svw]">
        <div className="w-[30%] flex items-center">
          <div className="flex items-end">
            <NumberInput name={`${namePrefix}.min`} defaultValue={1} />
            <p className="text-blacksub font-MoboBold text-[0.9svh] leading-[0.9svh]">
              人
            </p>
          </div>
          <p className="text-blacksub font-MoboBold text-[3svw] leading-[3svw]">
            ~
          </p>
          <div className="flex items-end ">
            <NumberInput name={`${namePrefix}.max`} defaultValue={1} />
            <p className="text-blacksub font-MoboBold text-[0.9svh] leading-[0.9svh]">
              人
            </p>
          </div>
        </div>
      </div>
      <motion.img
        src={`${import.meta.env.BASE_URL}images/common/arrow.svg`}
        alt=""
        className="h-[2svh] absolute right-[3svw]"
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setHopups(character.hopup);
          setIsVisible(true);
        }}
      />
    </motion.div>
  );
}
