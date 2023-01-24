import { db } from '../libs/firebase.ts';
import { LogDocument, logDocumentConverter } from '../models/log.ts';
import { UserDocument } from '../models/user.ts';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'npm:firebase@9.9.2/firestore';
import { userDocumentConverter } from '../models/user.ts';

const userCol = () =>
  collection(db, 'users').withConverter(userDocumentConverter());
const logCol = (uid: string) =>
  collection(doc(userCol(), uid), 'logs').withConverter(
    logDocumentConverter(),
  );

type UserApi = {
  fetchUser: (uid: string) => Promise<UserDocument>;
  fetchLogs: (uid: string, start: Date, end: Date) => Promise<LogDocument[]>;
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
    const logs = docs.map((doc) => doc.data());
    return logs;
  },
});
