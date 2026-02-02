import { characters } from "../../utils/characters";
import Circle from "../characters/circle";
import { groups } from "../../utils/groups";
import type { groupCode } from "../../types/group";

type CirclesProps = {
  code: groupCode;
  size_svw: number;
};

export default function Circles(props: CirclesProps) {
  const group = groups.find((v) => {
    return v.code == props.code;
  });

  const data1 = characters.find((v) => v.code == group?.charactersCode[0])!;
  const data2 = characters.find((v) => v.code == group?.charactersCode[1])!;
  const difference = 3;

  // ずらす距離（例として、props.size_svwの10%程度）
  const offsetX = props.size_svw * 0.1;
  const offsetY = props.size_svw * 0.1; // svw単位で5%ずらす

  return (
    <div
      style={{
        position: "relative",
        width: props.size_svw + "vw",
        height: props.size_svw + "vw",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% - ${offsetX}vw), calc(-50% - ${offsetY}vw))`,
          zIndex: 10,
        }}
      >
        <Circle code={data1.code} size={props.size_svw - difference + "vw"} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${offsetX}vw), calc(-50% + ${offsetY}vw))`,
          zIndex: 20,
        }}
      >
        <Circle code={data2.code} size={props.size_svw - difference + "vw"} />
      </div>
    </div>
  );
}
