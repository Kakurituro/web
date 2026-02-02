type TagProps = {
  team: "werewolf" | "citizen";
};

export default function Tag(props: TagProps) {
  return (
    <p
      className={`${
        props.team == "citizen" ? "bg-[#62b290]" : "bg-[#f24c4c]"
      } rounded-full text-white text-[2.3vw] px-[4px] py-[4px]  leading-[2.3vw] text-center inline-block w-[32%]}`}
    >
      {props.team == "citizen" ? "市民陣営" : "人狼陣営"}
    </p>
  );
}
