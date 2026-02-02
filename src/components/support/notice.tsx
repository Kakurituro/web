import { motion, useAnimation } from "motion/react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

type NoticeProps = {
  text: string;
  subtext: string;
  src?: string;
  to: string;
  onclick?: () => void;
  inapp?: boolean;
  isDisabled?: boolean;
  mb?: number;
};
export default function Notice(props: NoticeProps) {
  const controls = useAnimation();
  const navigate = useNavigate();

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (props.isDisabled) {
        await controls.start({
          x: [0, -10, 10, -6, 6, -3, 3, 0],
          transition: { duration: 0.5 },
        });
      } else {
        props.onclick?.();
        if (props.inapp) {
          navigate(props.to);
        } else {
          window.open(props.to, "_blank", "noopener,noreferrer");
        }
      }
    },
    [props, controls, navigate]
  );

  const mbPercent = props.mb ?? 0;

  return (
    <div className="w-full flex justify-center">
      <motion.div
        animate={controls}
        whileTap={!props.isDisabled ? { scale: 0.9 } : undefined}
        onClick={handleClick}
        style={{ marginBottom: `${mbPercent}%` }}
        className="relative bg-white flex w-[75%] px-[1%] py-[3%] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] items-center cursor-pointer"
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {props.isDisabled && (
          <div className="absolute inset-0 bg-gray-300 opacity-50 rounded-[6px] pointer-events-none z-10" />
        )}

        {props.src ? (
          <img src={props.src} className="w-[16] rounded-full z-0" alt="" />
        ) : (
          <div className="w-[3%] z-0"></div>
        )}
        <div className="ml-[2%] z-0">
          <p className="font-MoboBold text-black text-[5.4vw] leading-[5.7vw]">
            {props.text}
          </p>
          <p className="text-blacksub text-[2.7vw] mt-[1.5%]">
            {props.subtext}
          </p>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}images/common/arrow.svg`}
          className="h-[25%] ml-[3%] absolute right-[5.5%] z-0"
          alt=""
        />
      </motion.div>
    </div>
  );
}
