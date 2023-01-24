import { db } from '../libs/firebase.ts';
import { LogDocument, logDocumentConverter, LogType } from '../models/log.ts';
import { UserDocument } from '../models/user.ts';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  // } from 'npm:firebase@9.9.2/firestore'; // NOTE: Deno Deployがnpm moduleに対応していない
} from 'https://cdn.skypack.dev/firebase@9.9.2/firestore';
import { userDocumentConverter } from '../models/user.ts';
import startOfDay from 'https://deno.land/x/date_fns@v2.22.1/startOfDay/index.ts';
import endOfDay from 'https://deno.land/x/date_fns@v2.22.1/endOfDay/index.ts';
import { validatePostLog } from '../utils/validate_post_log.ts';

const userCol = () =>
  collection(db, 'users').withConverter(userDocumentConverter());
const logCol = (uid: string) =>
  collection(doc(userCol(), uid), 'logs').withConverter(
    logDocumentConverter(),
  );

type UserApi = {
  fetchUser: (uid: string) => Promise<UserDocument>;
  fetchLogs: (uid: string, start: Date, end: Date) => Promise<LogDocument[]>;
  postLog: (uid: string, type: LogType, date: Date) => Promise<LogDocument>;
};

export const userApi = (): UserApi => ({
  fetchUser: async (uid) => {
    const snap = await getDoc(doc(userCol(), uid));
    const user = snap.data();
    if (!user) throw new Error('not found user data');
    return user;
  },
  fetchLogs: async (uid, start, end) => {
    const snaps = await getDocs(
      query(
        logCol(uid),
        where('createdAt', '>=', start),
        where('createdAt', '<=', end),
      ),
    );
    const docs = snaps.docs;
    const logs = docs.map((doc: any) => doc.data());
    return logs;
  },
  postLog: async (uid, type, date) => {
    const log: LogDocument = {
      type,
      createdAt: date,
    };
    await addDoc(logCol(uid), log);
    return log;
  },
});
