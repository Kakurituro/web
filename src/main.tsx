import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { BrowserRouter } from "react-router-dom";

const SmartphonePreview: React.FC = () => {
  return (
    <div style={styles.fullscreen}>
      <div style={styles.smartphonePreview}>
        <iframe
          src="/"
          style={styles.iframe}
          title="スマホビュー"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  fullscreen: {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
  },
  smartphonePreview: {
    width: "calc(80svh / 2)",
    height: "85svh",
    maxWidth: "100vw",
    maxHeight: "100vh",
    border: "1px solid #ccc",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
    overflowX: "hidden",
    overflowY: "hidden",
  },
};

const Root: React.FC = () => {
  // 初回のみ画面の向きを判定
  const isPortrait = window.innerHeight >= window.innerWidth;

  return isPortrait ? (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <SmartphonePreview />
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />
);
