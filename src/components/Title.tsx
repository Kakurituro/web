import { motion } from "motion/react";

type TitleProps = {
  title: string;
};

export default function Title(props: TitleProps) {
  return (
    <motion.div>
      <div className="w-[100%] h-[20%] flex items-center justify-center pt-[calc(env(safe-area-inset-top)-3%)] ">
        <div className="bg-[url('/images/common/title.svg')] bg-center w-[80%] bg-size-[100%] bg-no-repeat">
          <p className="font-Kurobara text-[7.3svw] text-white py-[10%] text-center">
            {props.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
