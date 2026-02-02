import { motion, AnimatePresence } from "motion/react";

type AnnounceProps = {
  text: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export default function Announce({
  text,
  onConfirm,
  onCancel,
  confirmText = "はい",
  cancelText = "いいえ",
  showCancel = false,
}: AnnounceProps) {
  const lines = text.split("\n");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full w-full bg-[rgba(40,40,40,0.3)] drop-shadow-lg flex justify-center items-center absolute z-100 top-0"
      >
        <div>
          <div className="bg-white w-[77%] min-h-[25.66vw] rounded-[6px] flex items-center justify-center px-[5%] py-[2%]">
            <div className="text-black font-MoboBold text-[2.1vh] text-center leading-snug">
              {lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* ボタン行 */}
          <div className="flex justify-center gap-[4%] -mt-[2%]">
            {/* 確定ボタン */}
            <div onClick={onConfirm}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-[#47a2ff] w-[12vh] h-[4.2vh] rounded-full flex justify-center items-center cursor-pointer"
              >
                <p className="text-white text-[1.7vh]">{confirmText}</p>
              </motion.div>
            </div>

            {/* キャンセルボタン */}
            {showCancel && (
              <div onClick={onCancel}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-gray-400 w-[12vh] h-[4.2vh] rounded-full flex justify-center items-center cursor-pointer"
                >
                  <p className="text-white text-[1.7vh]">{cancelText}</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
