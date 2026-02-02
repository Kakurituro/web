import type { PlayerType } from "../context/game/local";

// プレイヤーごとに必要なターゲット選択の数・対象を返す
export function getAbilityTargets(
  currentPlayer: PlayerType,
  allPlayers: PlayerType[],
) {
  if (currentPlayer.isDead) return [];

  switch (currentPlayer.charactersCode) {
    case "wolf":
      return [
        {
          label: "噛む対象を選択",
          options: allPlayers.filter(
            (p) => !p.isDead && p.id !== currentPlayer.id,
          ),
        },
      ];
    case "seer":
      return [
        {
          label: "占う対象を選択",
          options: allPlayers.filter(
            (p) => !p.isDead && p.id !== currentPlayer.id,
          ),
        },
      ];
    case "knight":
      return [
        {
          label: "守る対象を選択",
          options: allPlayers.filter(
            (p) =>
              !p.isDead &&
              p.id !== currentPlayer.id &&
              p.id !== currentPlayer.abilityTarget?.slice(-1)[0][0], // 前の日に守った人は除外
          ),
        },
      ];
    case "hero":
      return [
        {
          label: "守る対象を選択",
          options: allPlayers.filter(
            (p) =>
              !p.isDead &&
              p.id !== currentPlayer.id &&
              p.id !== currentPlayer.abilityTarget?.slice(-1)[0][0] &&
              p.id !== currentPlayer.abilityTarget?.slice(-1)[0][1],
          ),
        },
        {
          label: "守る対象を選択",
          options: allPlayers.filter(
            (p) =>
              !p.isDead &&
              p.id !== currentPlayer.id &&
              p.id !== currentPlayer.abilityTarget?.slice(-1)[0][0] &&
              p.id !== currentPlayer.abilityTarget?.slice(-1)[0][1],
          ),
        },
      ];
    default:
      return [];
  }
}
