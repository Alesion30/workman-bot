import compareAsc from 'https://deno.land/x/date_fns@v2.22.1/compareAsc/index.ts';
import { LogDocument, LogType } from '../models/log.ts';

type ValidateResult = {
  isError: true;
  errorMessage: string;
} | {
  isError: false;
  errorMessage: null;
};

export const validatePostLog = (
  type: LogType,
  logs: LogDocument[],
): ValidateResult => {
  if (logs.length === 0) {
    if (type !== 'syussya') {
      return {
        isError: true,
        errorMessage: 'まだ出社していません:gopher-bom:',
      };
    } else {
      return {
        isError: false,
        errorMessage: null,
      };
    }
  }

  const orderedLogs = logs.sort((a, b) => compareAsc(a.createdAt, b.createdAt));
  const lastLog = orderedLogs[orderedLogs.length - 1];

  if (lastLog.type === 'syussya') {
    switch (type) {
      case 'syussya':
        return {
          isError: true,
          errorMessage: 'すでに出社済みです:gopher-bom:',
        };
      case 'kyukei':
        return {
          isError: false,
          errorMessage: null,
        };
      case 'saikai':
        return {
          isError: true,
          errorMessage: '休憩していません:gopher-bom:',
        };
      case 'taisya':
        return {
          isError: false,
          errorMessage: null,
        };
    }
  }

  if (lastLog.type === 'kyukei') {
    switch (type) {
      case 'syussya':
        return {
          isError: true,
          errorMessage: 'すでに出社済みです:gopher-bom:',
        };
      case 'kyukei':
        return {
          isError: true,
          errorMessage: 'すでに休憩済みです:gopher-bom:',
        };
      case 'saikai':
        return {
          isError: false,
          errorMessage: null,
        };
      case 'taisya':
        return {
          isError: false,
          errorMessage: null,
        };
    }
  }

  if (lastLog.type === 'saikai') {
    switch (type) {
      case 'syussya':
        return {
          isError: true,
          errorMessage: 'すでに出社済みです:gopher-bom:',
        };
      case 'kyukei':
        return {
          isError: false,
          errorMessage: null,
        };
      case 'saikai':
        return {
          isError: true,
          errorMessage: '休憩していません:gopher-bom:',
        };
      case 'taisya':
        return {
          isError: false,
          errorMessage: null,
        };
    }
  }

  if (lastLog.type === 'taisya') {
    switch (type) {
      case 'syussya':
        return {
          isError: false,
          errorMessage: null,
        };
      case 'kyukei':
        return {
          isError: true,
          errorMessage: '出社していません:gopher-bom:',
        };
      case 'saikai':
        return {
          isError: true,
          errorMessage: '出社していません:gopher-bom:',
        };
      case 'taisya':
        return {
          isError: true,
          errorMessage: '出社していません:gopher-bom:',
        };
    }
  }

  return {
    isError: false,
    errorMessage: null,
  };
};
