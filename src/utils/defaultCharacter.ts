import type { characterCode } from "../types/character";
import type { groupCode } from "../types/group";

type defaultCharacter = {
  count: number;
  set: {
    code: characterCode | groupCode;
    max: number;
    min: number;
  }[];
};

const defaultCharacter: defaultCharacter[] = [
  {
    count: 5,
    set: [
      { code: "wolf", max: 1, min: 1 },
      { code: "maniac", max: 1, min: 0 },
      { code: "seer", max: 2, min: 1 },
      { code: "villager", max: 2, min: 1 },
    ],
  },
  {
    count: 6,
    set: [
      { code: "wolfGroup", max: 2, min: 1 },
      { code: "seer", max: 2, min: 1 },
      { code: "villager", max: 3, min: 1 },
    ],
  },
  {
    count: 7,
    set: [
      { code: "wolfGroup", max: 2, min: 2 },
      { code: "seer", max: 2, min: 1 },
      { code: "heroGroup", max: 1, min: 1 },
      { code: "medium", max: 1, min: 0 },
      { code: "villager", max: 3, min: 1 },
    ],
  },
  {
    count: 8,
    set: [
      { code: "wolf", max: 2, min: 2 },
      { code: "seer", max: 2, min: 1 },
      { code: "knight", max: 1, min: 1 },
      { code: "medium", max: 1, min: 1 },
      { code: "villager", max: 3, min: 1 },
    ],
  },
  {
    count: 9,
    set: [
      { code: "wolf", max: 1, min: 1 },
      { code: "wolfGroup", max: 2, min: 1 },
      { code: "seer", max: 3, min: 1 },
      { code: "heroGroup", max: 2, min: 1 },
      { code: "medium", max: 1, min: 1 },
      { code: "villager", max: 3, min: 1 },
    ],
  },
  {
    count: 10,
    set: [
      { code: "wolf", max: 1, min: 1 },
      { code: "wolfGroup", max: 2, min: 1 },
      { code: "seer", max: 3, min: 1 },
      { code: "knight", max: 2, min: 1 },
      { code: "medium", max: 1, min: 1 },
      { code: "villager", max: 3, min: 2 },
    ],
  },
  {
    count: 11,
    set: [
      { code: "wolf", max: 1, min: 1 },
      { code: "maniac", max: 1, min: 1 },
      { code: "wolfGroup", max: 2, min: 1 },
      { code: "seer", max: 3, min: 1 },
      { code: "medium", max: 1, min: 1 },
      { code: "heroGroup", max: 2, min: 1 },
      { code: "villager", max: 3, min: 2 },
    ],
  },
];

export { defaultCharacter };
