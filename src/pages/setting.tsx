import { motion } from "motion/react";
import Menu from "../components/menu";
import Title from "../components/Title";
import Notice from "../components/support/notice";
import PwaInstallNotice from "../components/support/PwaInstallNotice";

export default function Characters() {
  return (
    <div className="  h-screen w-screen overflow-y-scroll overflow-x-clip">
      <motion.div
        className="h-[91svh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title title="アプリ設定" />
        <div className="flex flex-col justify-center items-center">
          <PwaInstallNotice />
          <Notice
            text={"プライバシーポリシー"}
            subtext={"アプリのプライバシーポリシーを見る"}
            to={"https://docs.kakurituro.com/policy/privacy/"}
          />
        </div>
      </motion.div>
      <Menu />
    </div>
  );
}
