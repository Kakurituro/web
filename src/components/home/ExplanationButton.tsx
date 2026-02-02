import { motion } from "motion/react";
import { Link } from "react-router-dom";

type ExplanationButtonProps = {
  text: string;
  src: string;
  to?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  mb?: number; // margin-bottom in percent
};

export default function ExplanationButton({
  text,
  src,
  to,
  onClick,
  width = "38%",
  height = "50%",
  mb = 0,
}: ExplanationButtonProps) {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  const sharedStyle = {
    width,
    height,
    marginBottom: `${mb}%`,
  };

  const content = (
    <motion.div
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      whileTap={{ scale: 0.9 }}
      style={sharedStyle}
      className="flex items-center bg-white pr-[2%] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)]"
    >
      <img src={src} alt="" className="h-full rounded-l-[7px] flex-shrink-0" />
      <p className="font-MoboBold text-[3.7vw] text-black ml-[5%] truncate whitespace-nowrap">
        {text}
      </p>
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} onClick={handleClick} style={sharedStyle} className="block">
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        ...sharedStyle,
        cursor: onClick ? "pointer" : "default",
      }}
      className="block"
    >
      {content}
    </div>
  );
}
