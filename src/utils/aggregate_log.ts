import { LogDocument } from '../models/log.ts';
import compareAsc from 'https://deno.land/x/date_fns@v2.22.1/compareAsc/index.ts';
import differenceInDays from 'https://deno.land/x/date_fns@v2.22.1/differenceInDays/index.ts';
import differenceInSeconds from 'https://deno.land/x/date_fns@v2.22.1/differenceInSeconds/index.ts';
import endOfDay from 'https://deno.land/x/date_fns@v2.22.1/endOfDay/index.ts';
import format from 'https://deno.land/x/date_fns@v2.22.1/format/index.js';
import startOfDay from 'https://deno.land/x/date_fns@v2.22.1/startOfDay/index.ts';

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
      workTime += Math.abs(differenceInSeconds(_workStart!, log.createdAt));
    }

    // 再開
    if (log.type === 'saikai') {
      _workStart = log.createdAt;
      if (_restStart != null) {
        restTime += Math.abs(differenceInSeconds(_restStart!, log.createdAt));
        _restStart = null;
      }
    }

    // 退社
    if (log.type === 'taisya') {
      end = log.createdAt;
      if (_restStart == null) {
        workTime += Math.abs(differenceInSeconds(_workStart!, log.createdAt));
      } else {
        restTime += Math.abs(differenceInSeconds(_restStart, log.createdAt));
      }
    }
  }

  if (end === null) {
    end = endOfDay(start!);
  }

  return {
    workTime: Math.round(workTime / 60),
    restTime: Math.round(restTime / 60),
    start: start,
    end: end!,
    logs: orderedLogs,
  };
};
