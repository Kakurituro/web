import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

const Root: React.FC = () => {
  // 画面の向きを管理するステート
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight >= window.innerWidth,
  );

  useEffect(() => {
    const handleResize = () => {
      // リアルタイムに画面の向きを判定
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 縦画面（スマホ）の場合のみアプリ本体を起動
  if (isPortrait) {
    return (
      <React.StrictMode>
        <BrowserRouter basename="/web">
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }

  // 縦画面以外（PC・横向き）の場合は、何も表示しないか警告のみを表示
  return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>
        このアプリはスマートフォンの縦画面専用です。
      </p>
      <p style={styles.errorSubText}>
        端末を縦向きにするか、スマートフォンでアクセスしてください。
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  errorContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#1a1a1a", // 真っ暗な背景で動作停止を強調
    color: "#ffffff",
    textAlign: "center",
    padding: "20px",
  },
  errorText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  errorSubText: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />,
);
