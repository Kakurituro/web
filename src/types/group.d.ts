import { characterCode } from "../utils/characters";
import { Hopup } from "./hopup";
export type groupCode = "heroGroup" | "wolfGroup";
export type group = {
  id: number;
  code: groupCode;
  name: string;
  team: "werewolf" | "citizen";
  charactersCode: characterCode[];
  charactersID: number[];
  hopup: Hopup[];
};
