import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

type NavButtonProps = {
  next?: (() => void) | string;
  back?: (() => void) | string;
  nextText?: string;
  backText?: string;
};

export default function NavButton({
  next,
  back,
  nextText = "次へ",
  backText = "戻る",
}: NavButtonProps) {
  const navigate = useNavigate();

  const isValid = (val: unknown): val is (() => void) | string =>
    typeof val === "function" || typeof val === "string";

  const handleClick = (target: (() => void) | string) => {
    if (typeof target === "function") {
      target();
    } else {
      navigate(target);
    }
  };

  const renderButton = (
    label: string,
    action: (() => void) | string,
    gradient: string
  ) => (
    <div
      onClick={() => handleClick(action)}
      role="button"
      tabIndex={0}
      className="focus:outline-none"
    >
      <motion.div
        className="w-[30svw] flex justify-center items-center rounded-full py-[1.3svh] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)]"
        style={{
          backgroundImage: gradient,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <p className="text-white font-MoboBold text-[3.3svh] leading-[3.3svh]">
          {label}
        </p>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed bottom-[6%] left-0 w-full flex justify-center items-center container-type-size z-50 ">
      {isValid(back) && (
        <div className="flex justify-center items-center mr-[2%]">
          {renderButton(
            backText,
            back,
            "linear-gradient(135deg, #316df4, #1a77ff)"
          )}
        </div>
      )}

      {isValid(next) && (
        <div className="flex justify-center items-center ml-[2%]">
          {renderButton(
            nextText,
            next,
            "linear-gradient(135deg, #ff6354, #ff6372)"
          )}
        </div>
      )}
    </div>
  );
}
