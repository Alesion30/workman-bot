import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from 'npm:firebase@9.9.2/firestore';

export type LogType = 'syussya' | 'kyukei' | 'saikai' | 'taisya';

export type LogDocument = {
  type: LogType;
  createdAt: Date;
};

export const logDocumentConverter = (): FirestoreDataConverter<
  LogDocument
> => ({
  toFirestore(log: WithFieldValue<LogDocument>): DocumentData {
    return {
      type: log.type,
      createdAt: log.createdAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): LogDocument {
    const data = snapshot.data(options)!;
    return {
      type: data.type,
      createdAt: (data.createdAt as Timestamp).toDate(),
    };
  },
});
