import { motion } from "motion/react";
import React, { forwardRef, useState } from "react";

type PlayerProps = {
  number: number;
  error?: { message: string };
  onRemove?: () => void;
  disableRemove?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Player = forwardRef<HTMLInputElement, PlayerProps>((props, ref) => {
  const { number, error, onRemove, disableRemove, ...inputProps } = props;
  const [focus, setFocus] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <motion.div
      className="w-[99%] bg-white rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] flex items-center justify-start bg-no-repeat"
      style={{ backgroundImage: `url('${baseUrl}images/game/player.svg')` }}
      animate={error ? { x: [0, -15, 15, -10, 10, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.67 }}
    >
      <div className="h-[10.5svw] flex justify-center items-center aspect-square">
        {focus && !disableRemove ? (
          <img
            src={`${baseUrl}images/game/player_remove.svg`}
            className="w-[60%] cursor-pointer"
            alt="削除"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.();
            }}
          />
        ) : (
          <p className="font-Barlow text-white text-[5.4svw] leading-[5.4svw] text-center">
            {numberToString(number)}
          </p>
        )}
      </div>
      <input
        type="text"
        className={`font-MoboBold ml-[3%] w-[80%] bg-white text-[5.7svw] text-black border border-none rounded leading-[5.7svw] px-2 outline-none ${
          error && "placeholder-[#ea3d3d]"
        }`}
        placeholder="名前を入力"
        ref={ref}
        autoComplete="off"
        {...inputProps}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      />
    </motion.div>
  );
});

Player.displayName = "Player";

function numberToString(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export default Player;
