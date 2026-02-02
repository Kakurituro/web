import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import type { FormValues } from "../../pages/game/local/characters";
import type { characterCode } from "../../types/character";

// 型定義
export type PlayerType = {
  id: number;
  name: string;
  charactersCode: characterCode | undefined;
  isDead: boolean;
  voteTarget: number[];
  abilityTarget: number[][];
};

export type gameSetting = {
  seerAnnouncement: boolean;
  heroAllowRepeatProtect: boolean;
  heroCanSelfProtect: boolean;
  knightAllowRepeatProtect: boolean;
  knightCanSelfProtect: boolean;
  maniacSeesWolf: boolean;
  wolfSeesManiac: boolean;
  wolvesKnowEachOther: boolean;
  discussionMinutes: number;
  prolongDiscussionMinutes: number;
  voteTargetOpen: boolean;
};

export type LocalContextType = {
  players: PlayerType[];
  characters: FormValues;
  gameSetting: gameSetting;
  executedByVote: number[];
  setGameSetting: Dispatch<SetStateAction<gameSetting>>;
  setPlayers: Dispatch<SetStateAction<PlayerType[]>>;
  setCharacters: Dispatch<SetStateAction<FormValues>>;
  setExecutedByVote: Dispatch<SetStateAction<number[]>>;
};

// Context 初期値は型アサーションで
const LocalContext = createContext<LocalContextType>({} as LocalContextType);

// Provider コンポーネント
export const LocalProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [characters, setCharacters] = useState<FormValues>({});
  const [executedByVote, setExecutedByVote] = useState<number[]>([]);
  const [gameSetting, setGameSetting] = useState<gameSetting>({
    seerAnnouncement: true, //OK
    heroAllowRepeatProtect: false, //OK
    heroCanSelfProtect: true, //OK
    knightAllowRepeatProtect: false, //OK
    knightCanSelfProtect: true, //OK
    maniacSeesWolf: false,
    wolfSeesManiac: false,
    wolvesKnowEachOther: false,
    discussionMinutes: 7,
    prolongDiscussionMinutes: 5,
    voteTargetOpen: true,
  });

  const value = useMemo(
    () => ({
      players,
      setPlayers,
      characters,
      setCharacters,
      gameSetting,
      setExecutedByVote,
      executedByVote,
      setGameSetting,
    }),
    [players, characters, gameSetting, executedByVote],
  );

  return (
    <LocalContext.Provider value={value}>{children}</LocalContext.Provider>
  );
};

// カスタムフック
export const useLocalContext = () => useContext(LocalContext);
