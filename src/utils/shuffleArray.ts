export default function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]; // 元の配列を変更しないようコピー
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0 〜 i のランダムな整数
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // 要素を入れ替え
  }
  return newArr;
}
