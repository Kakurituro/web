import { Hopup } from "./hopup";

export type characterCode =
  | "villager"
  | "seer"
  | "knight"
  | "hero"
  | "medium"
  | "wolf"
  | "maniac";

export type character = {
  id: number;
  name: string;
  code: characterCode;
  color1: string;
  color2: string;
  team: "werewolf" | "citizen";
  hopup: Hopup[];
  longText: string;
};
