import {
  addDoc,
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  setDoc,
  startAt,
  Timestamp,
} from 'https://cdn.skypack.dev/firebase@9/firestore';
import addDays from 'https://deno.land/x/date_fns@v2.22.1/addDays/index.ts';
import { getUserDoc } from './firebase.ts';
import { Log, LogType, User } from './types.ts';

// ログを取得する
export const fetchLogs = async (uid: string, time: Date) => {
  const userDoc = getUserDoc(uid);
  const logCollection = collection(userDoc, 'logs');

  const startOfTime = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
  );
  const endOfTime = addDays(startOfTime, 1);

  const { docs } = await getDocs(
    query(
      logCollection,
      orderBy('createdAt'),
      startAt(Timestamp.fromDate(startOfTime)),
      endAt(Timestamp.fromDate(endOfTime)),
    ),
  );

  return docs.map((doc: any) => doc.data()) as Log[];
};

// ログを記録する
export const recordLog = async (uid: string, type: LogType, time: Date) => {
  const userDoc = getUserDoc(uid);
  const logCollection = collection(userDoc, 'logs');

  const logs = await fetchLogs(uid, time);

  // 最新のログ
  const lastLog: Log | null = logs.length > 0 ? logs[logs.length - 1] : null;
  console.log(lastLog);

  if (lastLog?.type === type) {
    return true;
  }

  // 勤務ログ追加
  const log: Log = {
    type,
    createdAt: Timestamp.fromDate(time),
  };
  await addDoc(logCollection, log);

  // ユーザー情報更新
  const user: User = {
    uid,
    updatedAt: Timestamp.fromDate(time),
  };
  await setDoc(userDoc, user, { merge: true });

  return false;
};
