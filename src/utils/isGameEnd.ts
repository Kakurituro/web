import type { PlayerType } from "../context/game/local";

export default function isGameEnd(
  players: PlayerType[],
): "wolfWin" | "citizenWin" | "continue" {
  let wolf = players.filter((v) => {
    return v.charactersCode === "wolf" && v.isDead === false;
  });
  if (wolf.length === 0) {
    return "citizenWin";
  } else {
    let citizen = players.filter((v) => {
      return v.charactersCode != "wolf" && v.isDead === false;
    });
    if (citizen.length <= 1) {
      return "wolfWin";
    } else {
      return "continue";
    }
  }
}
