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
import compareAsc from 'https://deno.land/x/date_fns@v2.22.1/compareAsc/index.ts';
import differenceInSeconds from 'https://deno.land/x/date_fns@v2.22.1/differenceInSeconds/index.ts';

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
    throw new Error('すでに登録済みです');
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
};

// 勤務時間・休憩時間を算出する
export const calculate = (logs: Log[]) => {
  const ascLogs = logs.sort((a, b) =>
    compareAsc(a.createdAt.toDate(), b.createdAt.toDate())
  );

  let isWork = false;
  const time: { [key in 'work' | 'rest']: number } = {
    'work': 0,
    'rest': 0,
  };
  const stack: { [key in 'work' | 'rest']: Log | null } = {
    'work': null,
    'rest': null,
  };

  for (let i = 0; i < ascLogs.length; i++) {
    const log = ascLogs[i];

    if (stack['work'] === null) {
      if (log.type === 'syussya') {
        stack['work'] = log;
        isWork = true;
      }
    }

    if (stack['work']?.type === 'syussya') {
      if (log.type === 'taisya') {
        const start = stack['work'].createdAt.toDate();
        const end = log.createdAt.toDate();
        const diff = Math.abs(differenceInSeconds(start, end));
        time['work'] += diff;
        stack['work'] = null;
        isWork = false;
      }
    }

    if (stack['rest'] === null) {
      if (isWork && log.type === 'kyukei') {
        stack['rest'] = log;
      }
    }

    if (stack['rest']?.type === 'kyukei') {
      if (log.type === 'saikai') {
        const start = stack['rest'].createdAt.toDate();
        const end = log.createdAt.toDate();
        const diff = Math.abs(differenceInSeconds(start, end));
        time['rest'] += diff;
        stack['rest'] = null;
      }
    }
  }

  return time;
};

export const seconds2timelabel = (seconds: number) => {
  const hour = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hour * 3600) / 60);
  return `${hour}時間${minutes}分`;
};
