import { assertEquals } from 'https://deno.land/std@0.173.0/testing/asserts.ts';
import { LogDocument, LogType } from '../../models/log.ts';
import { validatePostLog } from '../validate_post_log.ts';

Deno.test('validatePostLog: 出社可能', () => {
  const type: LogType = 'syussya';
  const mockLogs: LogDocument[] = [];
  const result = validatePostLog(type, mockLogs);
  assertEquals(result.isError, false);
});

Deno.test('validatePostLog: すでに出社済みなので、出社できない', () => {
  const type: LogType = 'syussya';
  const mockLogs: LogDocument[] = [
    {
      type: 'syussya',
      createdAt: new Date('2023-01-01 12:00:00'),
    },
  ];
  const result = validatePostLog(type, mockLogs);
  assertEquals(result.isError, true);
});

Deno.test('validatePostLog: 退社可能', () => {
  const type: LogType = 'taisya';
  const mockLogs: LogDocument[] = [
    {
      type: 'syussya',
      createdAt: new Date('2023-01-01 12:00:00'),
    },
  ];
  const result = validatePostLog(type, mockLogs);
  assertEquals(result.isError, false);
});
