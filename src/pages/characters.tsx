import Explain from "../components/characters/explain";
import Menu from "../components/menu";
import Title from "../components/Title";
import { characters } from "../utils/characters";

export default function Characters() {
  return (
    <div className="h-full w-full overflow-y-scroll overflow-x-clip">
      <div className="h-[91%]">
        <Title title="役職の能力" />
        <div className="grid grid-cols-2 gap-[4vw] px-[7.3%]">
          {characters.map((character) => (
            <Explain key={character.id} data={character} />
          ))}
        </div>
      </div>
      <Menu />
    </div>
  );
}
