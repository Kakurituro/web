import type { characterCode } from "../../types/character";
import { characters } from "../../utils/characters";
import hexToRgba from "../../utils/hexToRgba";

type CircleProps = {
  code: characterCode;
  size: string; // 例: "13svw" や "100px"
};

export default function Circle(props: CircleProps) {
  let character = characters.find((v) => {
    return v.code == props.code;
  })!;
  const color1Transparent = hexToRgba(character.color1, 0.56); // 0.56は16進の90に相当

  return (
    <div
      className="flex justify-center items-center rounded-full"
      style={{
        width: props.size,
        height: props.size,
        backgroundImage: `linear-gradient(135deg, ${character.color1}, ${color1Transparent} 67%, ${character.color2})`,
      }}
    >
      <div
        className="flex justify-center items-center rounded-full border-[2.5px] border-white"
        style={{
          width: "90.6%",
          height: "90.6%",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}/images/characters/${props.code}/silhouette.svg`}
          alt=""
          style={{ height: "78%" }}
        />
      </div>
    </div>
  );
}
