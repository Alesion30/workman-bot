import { LogDocument } from '../models/log.ts';
import {
  compareAsc,
  differenceInDays,
  differenceInMinutes,
  endOfDay,
  format,
  startOfDay,
} from 'npm:date-fns@2.29.3';

export type AggregateLog = {
  restTime: number;
  workTime: number;
  start: Date;
  end: Date;
  logs: LogDocument[];
};

export const splitByDay = (logs: LogDocument[]): LogDocument[][] => {
  const dateList = [
    ...new Set(
      logs.map((log) => format(startOfDay(log.createdAt), 'yyyy-MM-dd')),
    ),
  ]
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => compareAsc(a, b));

  return dateList.reduce<LogDocument[][]>((a, b) => {
    const filteredLogs = logs.filter((log) =>
      differenceInDays(startOfDay(log.createdAt), startOfDay(b)) === 0
    );
    a.push(filteredLogs);
    return a;
  }, []);
};

export const aggregateLog = (
  logs: LogDocument[],
): AggregateLog | null => {
  if (logs.length === 0) {
    return null;
  }

  const orderedLogs = logs.sort((a, b) => compareAsc(a.createdAt, b.createdAt));

  let workTime = 0;
  let restTime = 0;

  const start: Date = orderedLogs[0].createdAt;
  let end: Date | null = null;
  let _workStart: Date | null = null;
  let _restStart: Date | null = null;

  if (orderedLogs[0].type !== 'syussya') {
    return null;
  }

  if (orderedLogs[orderedLogs.length - 1].type !== 'taisya') {
    orderedLogs.push({
      type: 'taisya',
      createdAt: endOfDay(start),
    });
  }

  for (const log of orderedLogs) {
    // 出社
    if (log.type === 'syussya') {
      _workStart = log.createdAt;
    }

    // 休憩
    if (log.type === 'kyukei') {
      _restStart = log.createdAt;
      workTime += Math.abs(differenceInMinutes(_workStart!, log.createdAt));
    }

    // 再開
    if (log.type === 'saikai') {
      _workStart = log.createdAt;
      if (_restStart != null) {
        restTime += Math.abs(differenceInMinutes(_restStart!, log.createdAt));
        _restStart = null;
      }
    }

    // 退社
    if (log.type === 'taisya') {
      end = log.createdAt;
      if (_restStart == null) {
        workTime += Math.abs(differenceInMinutes(_workStart!, log.createdAt));
      } else {
        restTime += Math.abs(differenceInMinutes(_restStart, log.createdAt));
      }
    }
  }

  if (end === null) {
    end = endOfDay(start!);
  }

  return {
    workTime: Math.round(workTime / 6) / 10,
    restTime: Math.round(restTime / 6) / 10,
    start: start,
    end: end!,
    logs: orderedLogs,
  };
};
