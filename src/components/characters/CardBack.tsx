interface CardProps {
  w_svw: number;
}

export default function CardBack({ w_svw }: CardProps) {
  const width = `${w_svw}svw`;
  const height = `${w_svw * 1.4}svw`;
  const logoSize = `${w_svw * 0.45}svw`;
  const cornerSize = `${w_svw * 0.3}svw`;
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div
      style={{ width, height }}
      className="relative bg-white rounded-[6px] shadow-[2.4px_2.9px_3px_rgba(128,128,128,0.2)] flex items-center justify-center overflow-hidden"
    >
      {/* 左上 */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: cornerSize,
          height: cornerSize,
          backgroundImage: `url('${baseUrl}images/game/card_corner.svg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />

      {/* 右下（回転） */}
      <div
        className="absolute bottom-0 right-0 rotate-180"
        style={{
          width: cornerSize,
          height: cornerSize,
          backgroundImage: `url('${baseUrl}images/game/card_corner.svg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        aria-hidden="true"
      />

      {/* ロゴ */}
      <img
        src={`${baseUrl}images/logo.svg`}
        alt="ゲームロゴ"
        style={{ width: logoSize, height: logoSize }}
        className="pointer-events-none select-none"
      />
    </div>
  );
}
