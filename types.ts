import { Timestamp } from 'https://cdn.skypack.dev/firebase@9/firestore';

export type User = {
  uid: string;
  updatedAt: Timestamp;
};

export type LogType = 'syussya' | 'kyukei' | 'saikai' | 'taisya';

export type Log = {
  type: LogType;
  createdAt: Timestamp;
};
