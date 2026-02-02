import { motion } from "motion/react";
import type { group } from "../../types/group";
import Tag from "../characters/Tag";
import Circles from "../group/Circles";
import NumberInput from "./NumberInput";
import { useHopupContext } from "../../context/hopup";

type GroupSettingProps = {
  data: group;
  namePrefix: string;
};

export default function GroupSetting({ data, namePrefix }: GroupSettingProps) {
  const { setHopups, setIsVisible } = useHopupContext();

  return (
    <motion.div className="bg-white w-[63%] mb-[1.8%] flex items-center py-[0.5%] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] relative">
      <div className="mr-[2.5vw]">
        <Circles code={data.code} size_svw={14} />
      </div>
      <div className="w-[15vw]">
        <p className="text-black font-MoboBold text-[5vw] leading-[5vw]">
          {data.name}
        </p>
        <Tag team={data.team} />
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
          <div className="flex items-end">
            <NumberInput name={`${namePrefix}.max`} defaultValue={3} />
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
          setHopups(data.hopup);
          setIsVisible(true);
        }}
      />
    </motion.div>
  );
}
