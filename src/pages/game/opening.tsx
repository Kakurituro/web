import Card from "../../components/characters/Card";
import { characters } from "../../utils/characters";
import shuffleArray from "../../utils/shuffleArray";

export default function Opening() {
  let randomCharacters = shuffleArray(characters);
  return (
    <div className="  h-screen w-screen flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        {randomCharacters.map((v) => (
          <div key={v.id} className="w-min">
            <Card data={v} w_svw={24.33} />
          </div>
        ))}
      </div>
    </div>
  );
}
