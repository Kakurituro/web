import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

const SmartphonePreview: React.FC = () => {
  // iframe内のURLにクエリパラメータを付与して、無限ループを回避する
  const previewUrl =
    window.location.pathname +
    window.location.search +
    (window.location.search ? "&" : "?") +
    "ui-only=true";

  return (
    <div style={styles.pcBackground}>
      <div style={styles.smartphoneFrame}>
        {/* ステータスバーなどの装飾用パーツをここに置くことも可能 */}
        <iframe
          src={previewUrl}
          style={styles.iframe}
          title="スマホプレビュー"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pcBackground: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  smartphoneFrame: {
    width: "min(430px, 90vw)", // PCなら430px、画面が小さければ90%
    height: "92vh",
    aspectRatio: "9 / 19.5",
    border: "12px solid #333", // ベゼル風の枠線
    borderRadius: "40px",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    backgroundColor: "#fff",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};

const Root: React.FC = () => {
  const isPortrait = window.innerHeight >= window.innerWidth;
  const isUiOnly =
    new URLSearchParams(window.location.search).get("ui-only") === "true";

  // 「縦画面」または「iframe内（ui-onlyフラグあり）」ならアプリ本体を表示
  if (isPortrait || isUiOnly) {
    return (
      <React.StrictMode>
        <BrowserRouter basename="web">
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }

  // それ以外（PCの横長画面）ならプレビュー枠を表示
  return <SmartphonePreview />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />,
);
