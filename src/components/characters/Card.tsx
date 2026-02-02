import type { character, characterCode } from "../../types/character";
import hexToRgba from "../../utils/hexToRgba";
import { characters } from "../../utils/characters";
type CardProps =
  | {
      data: character;
      code?: never;
      w_svw: number;
    }
  | {
      data?: never;
      code: characterCode;
      w_svw: number;
    };

export default function Card({ data, code, w_svw }: CardProps) {
  // dataがなければcodeからcharacters配列を検索
  const characterData =
    data || (code ? characters.find((c) => c.code === code) : undefined);

  if (!characterData) return null;

  const color1Transparent = hexToRgba(characterData.color1, 0.56); // 0.56は16進の90に相当

  return (
    <div
      style={{
        width: w_svw + "svw",
        height: w_svw * 1.4 + "svw",
      }}
      className="bg-white shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] rounded-[6px]"
    >
      <div
        className="h-[76%] rounded-t-[6px] flex items-end justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, ${characterData.color1}, ${color1Transparent} 70%, ${characterData.color2})`,
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/characters/${characterData.code}/silhouette.svg`}
          className="h-[70%] -m-0.5"
          alt=""
        />
      </div>
      <div className="bg-[#1e1e1e] text-white font-MoboBold h-[24%] rounded-b-[6px] flex justify-center items-center">
        <p
          style={{
            fontSize: w_svw * 0.13 + "svw",
          }}
        >
          {characterData.name}
        </p>
      </div>
    </div>
  );
}
