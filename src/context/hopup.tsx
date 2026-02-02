import { createContext, useContext, useState, type ReactNode } from "react";
import type { Hopup } from "../types/hopup";

// 型に isVisible とその setter を追加
type HopupContextType = {
  hopups: Hopup[];
  setHopups: (hopups: Hopup[]) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const HopupContext = createContext<HopupContextType | undefined>(undefined);

export const HopupProvider = ({ children }: { children: ReactNode }) => {
  const [hopups, setHopups] = useState<Hopup[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false); // 初期状態: 非表示

  return (
    <HopupContext.Provider
      value={{ hopups, setHopups, isVisible, setIsVisible }}
    >
      {children}
    </HopupContext.Provider>
  );
};

export const useHopupContext = (): HopupContextType => {
  const context = useContext(HopupContext);
  if (!context) {
    throw new Error("useHopupContext must be used within a HopupProvider");
  }
  return context;
};
