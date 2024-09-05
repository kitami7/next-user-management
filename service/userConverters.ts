// services/userConverters.ts

import { UserFormType } from '@/schemas/userFormSchemas';
import { UserDbType } from '@/types/userDbTypes';

export const convertFormToDb = (formData: UserFormType): UserDbType => {
  return {
    ...formData,
    age: Number(formData.age),
    birthday: new Date(formData.birthday),
  };
};

export const convertDbToForm = (dbData: UserDbType): UserFormType => {
  return {
    ...dbData,
    age: dbData.age.toString(),
    birthday: dbData.birthday ? dbData.birthday.toISOString().split('T')[0] : '',
  };
};
