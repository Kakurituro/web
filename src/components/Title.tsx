import { motion } from "motion/react";

type TitleProps = {
  title: string;
};

export default function Title(props: TitleProps) {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <motion.div>
      <div className="w-[100%] h-[20%] flex items-center justify-center pt-[calc(env(safe-area-inset-top)-3%)] ">
        <div
          className="bg-center w-[80%] bg-size-[100%] bg-no-repeat"
          style={{ backgroundImage: `url('${baseUrl}images/common/title.svg')` }}
        >
          <p className="font-Kurobara text-[7.3vw] text-white py-[10%] text-center">
            {props.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
