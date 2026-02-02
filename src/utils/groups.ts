import type { group } from "../types/group";

export const groups: group[] = [
  {
    id: 1,
    code: "heroGroup",
    name: "狩人系",
    charactersID: [3, 4],
    charactersCode: ["hero", "knight"],
    team: "citizen",
    hopup: [
      {
        text: "英雄及び騎士から指定した人数分ランダムに抽選されます。",
      },
    ],
  },
  {
    id: 51,
    code: "wolfGroup",
    name: "人狼系",
    charactersID: [51, 52],
    charactersCode: ["wolf", "maniac"],
    team: "werewolf",
    hopup: [
      {
        text: "人狼及び狂人から指定した人数分ランダムに抽選される。\nただし人狼が1人未満になるような抽選は行われない。",
      },
    ],
  },
];
