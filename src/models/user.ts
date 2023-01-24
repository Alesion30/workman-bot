import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
  // } from 'npm:firebase@9.9.2/firestore'; // NOTE: Deno Deployがnpm moduleに対応していない
} from 'https://cdn.skypack.dev/firebase@9.9.2/firestore';

export type UserDocument = {
  uid: string;
  createdAt: Date;
  updatedAt?: Date;
};

export const userDocumentConverter = (): FirestoreDataConverter<
  UserDocument
> => ({
  toFirestore(user: WithFieldValue<UserDocument>): DocumentData {
    return {
      uid: user.uid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): UserDocument {
    const data = snapshot.data(options)!;
    return {
      uid: data.uid,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp | undefined)?.toDate(),
    };
  },
});
