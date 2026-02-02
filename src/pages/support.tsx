import { motion } from "motion/react";
import Menu from "../components/menu";
import Notice from "../components/support/notice";
import Title from "../components/Title";

export default function Characters() {
  return (
    <div className="h-[100%] w-[100%]">
      <motion.div
        className="h-[100%] w-[100%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title title="開発支援" />
        <div className="flex flex-col justify-center items-center">
          <Notice
            text={"X（旧Twitter）"}
            subtext={"開発に関する情報を発信中です。"}
            to={"https://x.com/kakurituro"}
            mb={2.2}
          />
          <Notice
            text={"note"}
            subtext={"ルール解説や試遊会の情報を発信中です。"}
            to={"https://note.com/kakurituro"}
          />
          {/* 
            <div className="bg-white flex flex-col w-[86svw] px-[2svw] py-[2svh] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] items-center justify-center">
            <p className="inline-block text-center font-mintyou text-[6svw] font-bold text-black">
              支援者の皆様へ
            </p>
            <p className="text-[3.1svw] w-[90%] mt-[1svh] text-black font-mintyou">
              基本的に「ご支援」という言葉を使う時は、口頭で使うよりは、メール等で使うことが多いでしょう。社外の取引先やお世話になった目上の人に、お礼や支援をお願いする際に文末に入れたり、顧客や取引先に、お詫びをする際に冒頭で日頃の「ご支援」のお礼を伝えるなど。
            </p>
            </div>
            */}
        </div>
      </motion.div>
      <Menu />
    </div>
  );
}
