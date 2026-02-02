import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Menu() {
  return (
    <motion.div>
      <div
        className="
          bg-white
          flex
          items-center
          justify-between
          shadow-[0_-3px_2px_rgba(128,128,128,0.2)]
          h-[calc(9%+env(safe-area-inset-bottom)/2)]
          fixed
          bottom-0
          left-0
          right-0
          z-50
        "
      >
        <div className="flex w-[93%] h-full justify-center items-center mx-auto py-[1svh]">
          {/* 左: 開発支援 */}
          <div className="flex justify-end items-center w-[28%] pl-[1%] mr-[3%] h-full">
            <Link to="/support" className="h-full">
              <motion.div
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                whileTap={{ scale: 0.9 }}
                className="h-full"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <img
                    src="/images/menu/support.svg"
                    className="h-[70%]"
                    alt="設定"
                  />
                  <p className="font-MoboBold text-[1.45svh] text-black">
                    開発支援
                  </p>
                </div>
              </motion.div>
            </Link>
            <div className="border-2 border-gray-300 h-[57%] ml-[23%]" />
          </div>

          {/* 中央: ホーム */}
          <Link to="/" className="w-[40%] h-full">
            <motion.div
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              whileTap={{ scale: 0.9 }}
              className="h-full"
            >
              <div className="flex justify-center items-center h-full">
                <img
                  src="/images/menu/home.svg"
                  className="h-[80%]"
                  alt="ホーム"
                />
                <p className="font-MoboBold text-black text-[2.3svh] mr-[3svw]">
                  ホーム
                </p>
              </div>
            </motion.div>
          </Link>

          {/* 右: 設定 */}
          <div className="flex justify-start items-center w-[28%] pr-[1%] ml-[3%] h-full">
            <div className="border-2 border-gray-300 h-[57%] mr-[23%]" />
            <Link to="/setting" className="h-full">
              <motion.div
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                whileTap={{ scale: 0.9 }}
                className="h-full"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <img
                    src="/images/menu/setting.svg"
                    className="h-[70%]"
                    alt="設定"
                  />
                  <p className="font-MoboBold text-[1.45svh] text-black">
                    設定
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
