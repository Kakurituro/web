import Explain from "../components/characters/explain";
import Menu from "../components/menu";
import Title from "../components/Title";
import { characters } from "../utils/characters";

export default function Characters() {
  return (
    <div className="h-screen w-screen overflow-y-scroll overflow-x-clip">
      <div className="h-[91svh]">
        <Title title="役職の能力" />
        <div className="grid grid-cols-2 gap-[4svw] px-[7.3svw]">
          {characters.map((character) => (
            <Explain key={character.id} data={character} />
          ))}
        </div>
      </div>
      <Menu />
    </div>
  );
}
