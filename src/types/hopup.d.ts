import { characterCode } from "./character";

export type Hopup =
  | {
      code: characterCode;
      src?: never;
      text: string;
    }
  | {
      src: string;
      code?: never;
      text: string;
    }
  | {
      text: string;
      src?: never;
      code?: never;
    };
