import type { characterCode } from "../types/character";
import { characters } from "./characters";

export default function characterCodeToInfo(code: characterCode) {
  let result = characters.find((v) => {
    return v.code == code;
  });

  return result;
}
