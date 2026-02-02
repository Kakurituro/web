import type { FormValues } from "../pages/game/local/characters";

export default function isGameEstablished(
  count: number,
  characters: FormValues,
): [boolean, string] {
  let sumMax = 0;
  let sumMin = 0;

  Object.entries(characters).forEach(([_, value]) => {
    if (value.min > value.max) {
      const temp = value.min;
      value.min = value.max;
      value.max = temp;
    }
    sumMax += value.max;
    sumMin += value.min;
  });

  //人数が範囲外の場合を除外
  if (count < sumMin) {
    return [false, "役職の最低人数が多すぎます"];
  }
  if (sumMax < count) {
    return [false, "役職の最高人数が不足しています"];
  }

  //人狼が0の条件
  let wolfZero: boolean = characters.wolf.min === 0;
  //人狼系が0の条件
  let wolfGroupZero: boolean = characters.wolfGroup.min === 0;

  //人狼が明らかに0名の場合を除外
  if (wolfZero && wolfGroupZero) {
    return [false, "人狼が0人の可能性があります"];
  }

  //人狼が全員になる場合を排除する
  if (characters.wolf.max + characters.wolfGroup.max >= count) {
    return [false, "全員が人狼の可能性があります"];
  }

  //人狼が全員になる場合を排除する
  if (characters.wolf.max + characters.wolfGroup.max > count - 2) {
    return [false, "村人が1名以下になる可能性があります"];
  }

  return [true, "ゲームが成立しました"];
}
