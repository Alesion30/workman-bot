import { Timestamp } from 'npm:firebase@9.9.2/firestore';

export type User = {
  uid: string;
  updatedAt: Timestamp;
};

export type LogType = 'syussya' | 'kyukei' | 'saikai' | 'taisya';

export type Log = {
  type: LogType;
  createdAt: Timestamp;
};
