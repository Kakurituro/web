import type { Hopup } from "../types/hopup";
import { useHopupContext } from "../context/hopup";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Card from "./characters/Card";

type HopupProps = {
  data: Hopup[];
};

export default function Hopup({ data }: HopupProps) {
  const dataLength = data.length;
  const [inPage, setInPage] = useState(0);
  const { isVisible, setIsVisible } = useHopupContext();

  // データ数が変更された時にinPageを修正（上限を超えていないか確認）
  useEffect(() => {
    if (inPage >= dataLength) {
      setInPage(Math.max(0, dataLength - 1));
    }
  }, [dataLength, inPage]);

  return (
    <motion.div
      className="bg-[#fffef8] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1000 w-[80svw] rounded-[2.3svw] drop-shadow-lg pb-[4svh]"
      style={{ display: isVisible ? undefined : "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        const rect = (
          e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        const x = (e as React.MouseEvent).clientX - rect.left;

        if (dataLength <= 1) return;

        // 安全なインデックス制御
        setInPage((prev) => {
          if (x > rect.width / 2) {
            return Math.min(prev + 1, dataLength - 1);
          } else {
            return Math.max(prev - 1, 0);
          }
        });
      }}
    >
      <div className="flex justify-center items-center mt-[4svw]">
        {data[inPage]?.code ? (
          <div className="p-[7%]">
            <Card code={data[inPage].code} w_svw={47} />
          </div>
        ) : data[inPage]?.src ? (
          <motion.img
            src={data[inPage].src}
            className="w-[90%] rounded-[2.3svw] drop-shadow-sm"
            alt=""
            key={inPage}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        ) : null}
      </div>

      <div className="flex justify-center items-center mt-[2.5svw]">
        <div
          className={`w-[90%] pt-[2.5svw] px-[3svw] h-[12svh] ${
            !data[inPage]?.code && !data[inPage]?.src
              ? ""
              : "border-t-3 border-[#b7b7b7]"
          }`}
        >
          <motion.div
            className="text-[1.4svh] text-blacksub leading-[2svh] space-y-[1svh]"
            key={inPage}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          >
            {(data[inPage]?.text ?? "").split("\n").map((line, idx) => (
              <p className="" key={idx}>
                {line}
              </p>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-[2svh]">
        <div className="flex justify-between">
          {dataLength === 1
            ? ""
            : [...Array(dataLength)].map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    backgroundColor:
                      index === inPage ? "#565656" : "rgba(0,0,0,0)",
                    scale: index === inPage ? 1.2 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-[2svw] h-[2svw] border-[2px] border-[#565656] rounded-full mx-[1svw]"
                />
              ))}
        </div>
      </div>

      <motion.div
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(false)}
      >
        <div className="absolute mt-[2svh] left-1/2 -translate-x-1/2">
          <div className="bg-[#47a2ff] w-[12svh] h-[4.2svh] rounded-full flex justify-center items-center">
            <p className="text-white text-[1.7svh]">閉じる</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
