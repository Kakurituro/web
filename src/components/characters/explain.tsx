import { motion } from "motion/react";
import type { character } from "../../types/character";
import Circle from "./circle";
import { useHopupContext } from "../../context/hopup";
import Tag from "./Tag";

type ExplainProps = {
  data: character;
};

export default function Explain({ data }: ExplainProps) {
  const { setHopups, setIsVisible } = useHopupContext();
  return (
    <div
      onClick={(_) => {
        if (data.hopup.length == 0) {
          return;
        }
        setHopups(data.hopup);
        setIsVisible(true);
      }}
    >
      <motion.div
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="bg-white rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] justify-left items-center w-full flex px-[0.5svw] py-[0.5svh]">
          <div className="mr-[1.5svw]">
            <Circle code={data.code} size="14svw" />
          </div>
          <div className="flex-none w-[43%]">
            <p className="text-[5svw] leading-[5svw] font-MoboBold text-black">
              {data.name}
            </p>
            <Tag team={data.team} />
          </div>
          <img src="/images/common/arrow.svg" alt="" className="h-[2svh]" />
        </div>
      </motion.div>
    </div>
  );
}
