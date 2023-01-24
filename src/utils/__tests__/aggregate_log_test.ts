import { assertEquals } from 'https://deno.land/std@0.173.0/testing/asserts.ts';
import { LogDocument } from '../../models/log.ts';
import { AggregateLog, aggregateLog, splitByDay } from '../aggregate_log.ts';
import endOfDay from 'https://deno.land/x/date_fns@v2.22.1/endOfDay/index.ts';

Deno.test('aggregateLog: logが存在しないとき', () => {
  const mockLogs: LogDocument[] = [];
  const result = aggregateLog(mockLogs);
  assertEquals(result, null);
});

Deno.test('aggregateLog: [正常系] 正しい形式のログが存在するとき', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'kyukei', createdAt: new Date('2023-01-01 12:00:00') },
    { type: 'saikai', createdAt: new Date('2023-01-01 13:00:00') },
    { type: 'kyukei', createdAt: new Date('2023-01-01 15:00:00') },
    { type: 'saikai', createdAt: new Date('2023-01-01 15:30:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 17:30:00') },
  ];
  const expected: AggregateLog = {
    restTime: 1.5,
    workTime: 6,
    start: new Date('2023-01-01 10:00:00'),
    end: new Date('2023-01-01 17:30:00'),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('aggregateLog: [正常系] 1日に出社が複数ある場合', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 12:00:00') },
    { type: 'syussya', createdAt: new Date('2023-01-01 15:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 17:00:00') },
  ];
  const expected: AggregateLog = {
    restTime: 0,
    workTime: 4,
    start: new Date('2023-01-01 10:00:00'),
    end: new Date('2023-01-01 17:00:00'),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('aggregateLog: [正常系] 日を跨ぐとき', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 17:00:00') },
    { type: 'syussya', createdAt: new Date('2023-01-02 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-02 12:00:00') },
  ];
  const expected: AggregateLog = {
    restTime: 0,
    workTime: 9,
    start: new Date('2023-01-01 10:00:00'),
    end: new Date('2023-01-02 12:00:00'),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('aggregateLog: [異常系] 退社時間が存在しないとき', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
  ];
  const expected: AggregateLog = {
    restTime: 0,
    workTime: 14,
    start: new Date('2023-01-01 10:00:00'),
    end: endOfDay(new Date('2023-01-01 10:00:00')),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('aggregateLog: [異常系] 休憩後、再開ログがない場合', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'kyukei', createdAt: new Date('2023-01-01 12:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 17:00:00') },
  ];
  const expected: AggregateLog = {
    restTime: 5,
    workTime: 2,
    start: new Date('2023-01-01 10:00:00'),
    end: new Date('2023-01-01 17:00:00'),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('aggregateLog: [異常系] 休憩後、退社ログがない場合', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'kyukei', createdAt: new Date('2023-01-01 12:00:00') },
  ];
  const expected: AggregateLog = {
    restTime: 12,
    workTime: 2,
    start: new Date('2023-01-01 10:00:00'),
    end: endOfDay(new Date('2023-01-01 10:00:00')),
    logs: mockLogs,
  };
  const result = aggregateLog(mockLogs);
  assertEquals(result, expected);
});

Deno.test('splitByDay: [正常系] ログデータを日毎に分割する', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 12:00:00') },
    { type: 'syussya', createdAt: new Date('2023-01-02 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-02 12:00:00') },
  ];
  const expected: LogDocument[][] = [
    [
      { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
      { type: 'taisya', createdAt: new Date('2023-01-01 12:00:00') },
    ],
    [
      { type: 'syussya', createdAt: new Date('2023-01-02 10:00:00') },
      { type: 'taisya', createdAt: new Date('2023-01-02 12:00:00') },
    ],
  ];
  const result = splitByDay(mockLogs);
  assertEquals(result, expected);
});

Deno.test('splitByDay: [正常系] ログデータが1日しか存在しない', () => {
  const mockLogs: LogDocument[] = [
    { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
    { type: 'taisya', createdAt: new Date('2023-01-01 12:00:00') },
  ];
  const expected: LogDocument[][] = [
    [
      { type: 'syussya', createdAt: new Date('2023-01-01 10:00:00') },
      { type: 'taisya', createdAt: new Date('2023-01-01 12:00:00') },
    ],
  ];
  const result = splitByDay(mockLogs);
  assertEquals(result, expected);
});

Deno.test('splitByDay: [正常系] ログデータが存在しない', () => {
  const result = splitByDay([]);
  assertEquals(result, []);
});
