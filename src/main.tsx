import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

// スマホフレームコンポーネント: PCでアクセス時にスマホサイズの枠を表示
const SmartphoneFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div style={styles.pcBackground}>
      <div style={styles.phoneContainer}>{children}</div>
    </div>
  );
};

const Root: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter basename="/web">
        <SmartphoneFrame>
          <App />
        </SmartphoneFrame>
      </BrowserRouter>
    </React.StrictMode>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pcBackground: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#121212", // アプリ外側を暗くして没入感を出す
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  phoneContainer: {
    // スマホの縦長比率(9:19.5)を強制。PCブラウザがどんなサイズでもこの比率を保つ
    height: "92vh",
    aspectRatio: "9 / 19.5",
    backgroundColor: "#fcfcfc",
    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
    overflow: "hidden", // コンテンツのはみ出しをカット
    position: "relative",
  },
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />,
);
