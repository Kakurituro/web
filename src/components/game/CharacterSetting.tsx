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
    <motion.div
      className="bg-white w-[63%] mb-[1.8%] flex items-center p-[0.5%] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] relative"
      //これより下が変更点
    >
      <div className="mr-[2.5vw]">
        <Circle code={code} size="14vw" />
      </div>
      <div className="">
        <p className="text-black font-MoboBold text-[5vw] leading-[5vw]">
          {character.name}
        </p>
        <Tag team={character.team} />
      </div>
      <div className="absolute right-[9vw]">
        <div className="w-[30%] flex items-center">
          <div className="flex items-end">
            <NumberInput name={`${namePrefix}.min`} defaultValue={1} />
            <p className="text-blacksub font-MoboBold text-[0.9vh] leading-[0.9vh]">
              人
            </p>
          </div>
          <p className="text-blacksub font-MoboBold text-[3vw] leading-[3vw]">
            ~
          </p>
          <div className="flex items-end ">
            <NumberInput name={`${namePrefix}.max`} defaultValue={1} />
            <p className="text-blacksub font-MoboBold text-[0.9vh] leading-[0.9vh]">
              人
            </p>
          </div>
        </div>
      </div>
      <motion.img
        src={`${import.meta.env.BASE_URL}images/common/arrow.svg`}
        alt=""
        className="h-[2vh] absolute right-[3vw]"
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
