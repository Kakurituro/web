import ExplanationButton from "../components/home/ExplanationButton";
import Menu from "../components/menu";
import { useHopupContext } from "../context/hopup";
import { useLocalContext } from "../context/game/local";
import { motion } from "motion/react";
import Notice from "../components/support/notice";
import Card from "../components/characters/Card";
import CardBack from "../components/characters/CardBack";
import { useEffect, useState } from "react";
import { characters } from "../utils/characters";
import type { characterCode } from "../types/character";

function useTypewriterEffect(text: string, delay = 30) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    let cancelled = false;

    setDisplayedText("");

    const type = () => {
      if (cancelled) return;
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
        setTimeout(type, delay);
      }
    };

    type(); // 最初の1文字目を即時開始

    return () => {
      cancelled = true; // クリーンアップで中断
    };
  }, [text, delay]);

  return displayedText;
}

export default function Home() {
  const { setHopups, setIsVisible } = useHopupContext();
  const { setPlayers, setGameSetting } = useLocalContext();
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState(0); // 累積回転角度
  const [isFront, setIsFront] = useState(false); // カードが表向きかどうか
  const [nameText, setNameText] = useState("");
  const [longText, setLongText] = useState("");

  const characterCodes: characterCode[] = characters.map((v) => {
    return v.code;
  });

  useEffect(() => {
    // 表の表示時間と裏の表示時間（ms）
    const frontDuration = 8000; // 表示5秒
    const backDuration = 1500; // 裏表示2秒

    // 表なら frontDuration、裏なら backDuration 待つ
    const timeout = setTimeout(
      () => {
        if (!isFront) {
          // 裏→表へ右回転
          setRotation((prev) => prev + 180);
          setIsFront(true);
        } else {
          // 表→裏へ左回転
          setRotation((prev) => prev + 180);
          setIsFront(false);
          // キャラ変更は onAnimationComplete で行うほうが自然
        }
      },
      isFront ? frontDuration : backDuration,
    );

    return () => clearTimeout(timeout);
  }, [isFront]);
  useEffect(() => {
    if (isFront) {
      setNameText(characters[index].name);
      setLongText(characters[index].longText);
    } else {
      // 表示前に一度空にしてから入れ直す
      setNameText("");
      setLongText("");
    }
  }, [isFront, index]);
  const nameTyped = useTypewriterEffect(nameText, 50);
  const longTextTyped = useTypewriterEffect(longText, 15);
  return (
    <div className="h-full w-full overflow-y-clip overflow-x-clip">
      <div className="h-[5%]"></div>
      <motion.div
        className="h-full w-full top-0 flex flex-col justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-[5%]"></div>
        <div className="w-full h-[27%] flex justify-center items-stretch">
          <div
            className="relative w-[30%] h-[42vw]"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="relative w-full"
              animate={{ rotateY: rotation }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
              onAnimationComplete={() => {
                if (!isFront) {
                  // 裏返っているタイミング（裏面が見えている状態）
                  setIndex((prev) => (prev + 1) % characterCodes.length);
                }
              }}
            >
              {/* 裏面（初期表示） */}
              <div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <CardBack w_svw={30} />
              </div>

              {/* 表面（回転後） */}
              <div
                className="absolute w-full top-0 left-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Card code={characterCodes[index]} w_svw={30} />
              </div>
            </motion.div>
          </div>
          <div className="w-[50%] ml-[3%] bg-white px-[1%] py-[3%] rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] flex flex-col items-center h-[42vw]">
            <motion.p
              className="font-MoboBold text-black text-[4.8vw]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {nameTyped}
            </motion.p>

            {/* longText 複数行のフェード表示 */}
            <motion.div
              className="text-[2.8vw] text-black p-1 text-left w-full whitespace-pre-wrap leading-[4.1vw]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p>{longTextTyped}</p>
            </motion.div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center h-[33%] mt-[0%]">
          <Notice
            text={"ローカル対戦"}
            subtext={"みんなで1台のスマートフォンを共有して対戦"}
            to={"/game/local/players"}
            onclick={() => {
              setPlayers([]);
              setGameSetting({
                seerAnnouncement: true,
                heroAllowRepeatProtect: false,
                heroCanSelfProtect: true,
                knightAllowRepeatProtect: false,
                knightCanSelfProtect: true,
                maniacSeesWolf: false,
                wolfSeesManiac: false,
                wolvesKnowEachOther: false,
                discussionMinutes: 7,
                prolongDiscussionMinutes: 5,
                voteTargetOpen: true,
              });
            }}
            inapp
            mb={3}
          />
          <Notice
            text={"オンライン対戦"}
            subtext={"現在準備中"}
            to={"/game/local/players"}
            isDisabled
          />
        </div>

        {/* 説明ボタン */}
        <div className="w-[38%] flex flex-col gap-[0] ml-[3%] mt-[5%] h-[13%]">
          <ExplanationButton
            text={"役職の能力"}
            src={`${import.meta.env.BASE_URL}images/home/role_button.svg`}
            to="/characters"
            height="5%"
            width="100%"
            mb={8}
          />
          <ExplanationButton
            text={"ルールブック"}
            src={`${import.meta.env.BASE_URL}images/home/rule_button.svg`}
            height="5%"
            width="100%"
            onClick={() => {
              setHopups([
                {
                  src: `${import.meta.env.BASE_URL}images/hopup/rule/1.png`,
                  text: "人狼ゲームではプレイヤーは市民/人狼陣営のいずれかに割り振られます。\n市民陣営は全ての人狼を処刑すれば勝利です。",
                },
                {
                  src: `${import.meta.env.BASE_URL}images/hopup/rule/2.png`,
                  text: "人狼陣営は市民陣営及び狂人等の他陣営で市民陣営の人数としてカウントするプレイヤーが1人以下であり、人狼が生きていれば勝利です。",
                },
                {
                  src: `${import.meta.env.BASE_URL}images/hopup/rule/3.png`,
                  text: "デフォルト設定では人狼はお互いを認識できません。また、全ての人狼が人狼を攻撃したとき誰も死にません。",
                },
                {
                  src: `${import.meta.env.BASE_URL}images/hopup/rule/4.png`,
                  text: "確率狼独自の仕様として役職人数に幅を持たせる設定ができます。そのためにいくつかの変更点を設けました。\n 初めは初期設定で試合を重ねて、慣れてきたら自分たち好みの設定を作ってみてください。",
                },
              ]);
              setIsVisible(true);
            }}
          />
        </div>
      </motion.div>

      {/* 下部メニュー */}
      <Menu />
    </div>
  );
}
