import {
  Timestamp,
  // } from 'npm:firebase@9.9.2/firestore'; // NOTE: Deno Deployがnpm moduleに対応していない
} from 'https://cdn.skypack.dev/firebase@9.9.2/firestore';

export type User = {
  uid: string;
  updatedAt: Timestamp;
};

export type LogType = 'syussya' | 'kyukei' | 'saikai' | 'taisya';

export type Log = {
  type: LogType;
  createdAt: Timestamp;
};
