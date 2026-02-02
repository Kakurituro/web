import { motion } from "motion/react";

type UserInfoProps = {
  src: string;
  name: string;
  id: string;
  level: number;
  bar: number;
  className?: string;
};

export default function UserInfo(props: UserInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div
        className={`w-[65vw] h-[7.3vh] bg-white rounded-[6px] p-[0] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)]${
          props.className ? ` ${props.className}` : ""
        }`}
      >
        <img
          src={props.src}
          className="rounded-full w-[8.7vh] border-8 border-[#fad75f] absolute z-20 left-[-20px] top-[-0.7vh]"
          alt=""
        />

        <div className="pl-[16vw] h-[5vh] flex items-center">
          <div>
            <p className="font-MoboBold text-black text-[2.4vh] leading-none">
              {props.name}
            </p>
            <p className="font-Barlow text-blacksub text-[1.2vh] leading-[0.6em] ml-[3px] mt-[0.45vh]">
              @{props.id}
            </p>
          </div>
        </div>
        <div className="bg-[#0ebe63] text-white rounded-b-[6px] absolute h-[2.3vh] bottom-0 w-[65vw] pr-[1vw] pl-[13.8vw] flex items-center justify-center py-[0.2vh]">
          <p className="font-Barlow text-[1.3vh] mr-[2vw]">
            Lv.{props.level}
          </p>
          <LevelBar value={props.bar} />
        </div>
      </div>
    </motion.div>
  );
}

interface LevelBarProps {
  value: number; // 0〜100
}

const LevelBar: React.FC<LevelBarProps> = ({ value }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-[80%] h-[1.1vh] bg-[#238950] rounded-full overflow-hidden shadow-inner">
      <div
        className={`h-full bg-[#fad75f] transition-all duration-300`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
