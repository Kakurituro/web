import type { PlayerType } from "../context/game/local";
import type { FormValues } from "../pages/game/local/characters";
import type { characterCode } from "../types/character";
import { characters } from "./characters";

type RandomCharactersProps = {
  players: PlayerType[];
  data: FormValues;
};

export default function randomCharacters({
  data,
  players,
}: RandomCharactersProps): PlayerType[] {
  let assignedPlayers = [...players];
  const remainder: { code: characterCode; num: number }[] = characters.map(
    (c) => ({
      code: c.code,
      num: 0,
    }),
  );

  Object.entries(data).forEach(([key, value]) => {
    if (value.min > value.max) {
      [value.min, value.max] = [value.max, value.min];
    }

    if (key === "wolfGroup") {
      if (value.min === 0) {
        // value.max の範囲で wolf と maniac の比率をランダムに決める
        const wolfNum = getUniformRandomInt(0, value.max);
        const maniacNum = value.max - wolfNum;
        updateRemainder(remainder, "wolf", wolfNum);
        updateRemainder(remainder, "maniac", maniacNum);
      } else if (value.min === 1) {
        const availableIndexes = getAvailableIndexes(assignedPlayers);
        if (availableIndexes.length > 0) {
          const randIdx = getUniformRandomInt(0, availableIndexes.length - 1);
          const playerIdx = availableIndexes[randIdx];
          assignedPlayers[playerIdx] = {
            ...assignedPlayers[playerIdx],
            charactersCode: "wolf",
          };
        }
        updateRemainder(remainder, "wolf", value.max - 1);
      } else {
        const wolfNum = getUniformRandomInt(1, value.min);
        const maniacNum = value.min - wolfNum;

        assignedPlayers = assignCharactersShuffled(assignedPlayers, {
          wolf: wolfNum,
          maniac: maniacNum,
        });

        const remainderRange = value.max - value.min;
        const wolfRemainderNum = getUniformRandomInt(0, remainderRange);
        const maniacRemainderNum = remainderRange - wolfRemainderNum;

        updateRemainder(remainder, "wolf", wolfRemainderNum);
        updateRemainder(remainder, "maniac", maniacRemainderNum);
      }
    } else if (key === "heroGroup") {
      const heroNum = getUniformRandomInt(0, value.min);
      const knightNum = value.min - heroNum;

      assignedPlayers = assignCharactersShuffled(assignedPlayers, {
        hero: heroNum,
        knight: knightNum,
      });

      const remainderRange = value.max - value.min;
      const heroRemainderNum = getUniformRandomInt(0, remainderRange);
      const knightRemainderNum = remainderRange - heroRemainderNum;

      updateRemainder(remainder, "hero", heroRemainderNum);
      updateRemainder(remainder, "knight", knightRemainderNum);
    } else if (value.min !== 0) {
      const countMap: { [character in characterCode]?: number } = {};
      countMap[key as characterCode] = value.min;
      assignedPlayers = assignCharactersShuffled(assignedPlayers, countMap);
      updateRemainder(remainder, key as characterCode, value.max - value.min);
    } else {
      updateRemainder(remainder, key as characterCode, value.max - value.min);
    }
  });

  // 未割り当てプレイヤーに余りキャラをシャッフルで割り当て
  const remainderCharacters: characterCode[] = remainder.flatMap((r) =>
    Array(r.num).fill(r.code),
  );
  shuffleArray(remainderCharacters);

  // 未割り当て人数の確認
  const unassignedIndexes = assignedPlayers
    .map((p, i) => (!p.charactersCode ? i : null))
    .filter((i): i is number => i !== null);

  // キャラクターが足りない場合はエラー
  if (remainderCharacters.length < unassignedIndexes.length) {
    throw new Error(
      `キャラクターの数がプレイヤー数に対して不足しています。
  プレイヤー数: ${players.length}
  割り当て済み: ${players.length - unassignedIndexes.length}
  未割り当て: ${unassignedIndexes.length}
  用意されたキャラクター数: ${remainderCharacters.length}
  data 設定: ${JSON.stringify(data)}`,
    );
  }

  // 足りていれば割り当て
  unassignedIndexes.forEach((idx) => {
    assignedPlayers[idx] = {
      ...assignedPlayers[idx],
      charactersCode: remainderCharacters.pop()!,
    };
  });
  console.log("割り当て済み（ほんもの）");
  console.log(assignedPlayers);

  return assignedPlayers;
}

// ---------- 補助関数 ----------

function getAvailableIndexes(players: PlayerType[]): number[] {
  return players
    .map((player, idx) => (player.charactersCode ? null : idx))
    .filter((idx): idx is number => idx !== null);
}

function updateRemainder(
  remainder: { code: characterCode; num: number }[],
  code: characterCode,
  delta: number,
) {
  const target = remainder.find((r) => r.code === code);
  if (target) target.num += delta;
}

function assignCharactersShuffled(
  assignedPlayers: PlayerType[],
  countMap: { [character in characterCode]?: number },
): PlayerType[] {
  const charactersToAssign: characterCode[] = [];

  for (const [char, count] of Object.entries(countMap)) {
    charactersToAssign.push(...Array(count).fill(char as characterCode));
  }

  shuffleArray(charactersToAssign);

  const availableIndexes = getAvailableIndexes(assignedPlayers);
  shuffleArray(availableIndexes);
  for (
    let i = 0;
    i < charactersToAssign.length && i < availableIndexes.length;
    i++
  ) {
    const idx = availableIndexes[i];
    assignedPlayers[idx] = {
      ...assignedPlayers[idx],
      charactersCode: charactersToAssign[i],
    };
  }

  return assignedPlayers;
}

function getUniformRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getUniformRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
