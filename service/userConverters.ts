// services/userConverters.ts

import { UserFormType } from '@/schemas/userFormSchemas';
import { UserDbType } from '@/types/userDbTypes';
import { UserTableTypes } from '@/types/userTableTypes';
import { date, number } from 'zod';
import { calculateAgeFromDateNumber, convertToYYYYMMDD } from './dateUtils';

export const convertFormToDb = (formData: UserFormType): UserDbType => {
  return {
    ...formData,
    // age: 誕生日計算
    birthday: new Date(formData.birthday),
    age: calculateAgeFromDateNumber(convertToYYYYMMDD(formData.birthday)),
  };
};

export const convertDbToForm = (dbData: UserDbType): UserFormType => {
  const { age, ...rest } = dbData;

  const formatToJSTISO = (date: Date | null): string => {
    if (!date) return '';
    
    // 日本時間に変換してからISO 8601形式で取得
    const jstDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    return jstDate.toISOString().split('T')[0];
  };

  return {
    ...rest,
    birthday: formatToJSTISO(dbData.birthday),
  };
};
export const convertBirthday = (birthday: Date | null): string => {
  return birthday ? new Date(birthday).toISOString().split('T')[0] : '';
}

export const convertGender = (gender: string): string => {
  if (gender === 'm') {
    return "男性";
  } else if (gender === 'f') {
    return "女性";
  } else if (gender === 'o') {
    return "その他";
  } else {
    return "不明";
  }
}

export const convertDbToTable = (dbData: UserDbType): UserTableTypes => {
  return {
    ...dbData,
    age: dbData.age.toString(),
    birthday: convertBirthday(dbData.birthday),
    gender: convertGender(dbData.gender),
  };
};
