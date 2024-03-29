import format from 'https://deno.land/x/date_fns@v2.22.1/format/index.js';
import { LogDocument } from '../models/log.ts';
import { aggregateLog } from './aggregate_log.ts';

/// 出社投稿時のリプライメッセージ
export const postSyussyaMessage = () => {
  const now = new Date();
  const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss');
  return `打刻しました！${nowstr}`;
};

/// 休憩投稿時のリプライメッセージ
export const postKyukeiMessage = () => {
  const now = new Date();
  const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss');
  return `休憩しましょう！${nowstr}`;
};

/// 再開投稿時のリプライメッセージ
export const postSaikaiMessage = () => {
  const now = new Date();
  const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss');
  return `引き続き頑張ってください！${nowstr}`;
};

/// 退社投稿時のリプライメッセージ
export const postTaisyaMessage = (logs: LogDocument[]) => {
  const now = new Date();
  const nowstr = format(now, 'yyyy-MM-dd HH:mm:ss');

  const result = aggregateLog(logs);
  if (result) {
    const start = format(result.start, 'HH:mm:ss');
    const end = format(result.end, 'HH:mm:ss');

    return [
      `お疲れ様でした！${nowstr}`,
      `- 稼働時間: ${timeStr(result.workTime)}`,
      `- 休憩時間: ${timeStr(result.restTime)}`,
      `（${start} 〜 ${end}の記録）`,
    ].join('\n');
  } else {
    return '勤怠情報がありません';
  }
};

/// 本日の稼働時間
export const postTodayRecordMessage = (logs: LogDocument[]) => {
  const result = aggregateLog(logs);
  if (result) {
    const start = format(result.start, 'HH:mm:ss');
    const end = format(result.end, 'HH:mm:ss');

    return [
      `- 稼働時間: ${timeStr(result.workTime)}`,
      `- 休憩時間: ${timeStr(result.restTime)}`,
      `（${start} 〜 ${end}の記録）`,
    ].join('\n');
  } else {
    return '勤怠情報がありません';
  }
};

/// エラーメッセージ
export const errorMessage = () => 'エラーが発生しました:gopher-bom:';

const timeStr = (time: number) => {
  const h = Math.round(time / 60);
  const m = time - h * 60;
  return `${h}時間${m}分`;
};
