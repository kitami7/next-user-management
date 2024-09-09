// services/userConverters.ts

import { UserFormType } from '@/schemas/userFormSchemas';
import { UserDbType } from '@/types/userDbTypes';
import { UserTableTypes } from '@/types/userTableTypes';
import { date, number } from 'zod';

export const convertFormToDb = (formData: UserFormType): UserDbType => {
  return {
    ...formData,
    // age: 誕生日計算
    birthday: new Date(formData.birthday),
  };
};

export const convertDbToForm = (dbData: UserDbType): UserFormType => {
  const { age, ...rest } = dbData;

  return {
    ...rest,
    birthday: dbData.birthday ? new Date(dbData.birthday).toISOString().split('T')[0] : '',
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
