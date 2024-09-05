import { z } from "zod";

// バリデーションメッセージの定義
const ValidationMessages = {
  ID_REQUIRED: 'IDは入力必須',
  ID_FORMAT: '４桁の半角数字で',
  FIRST_NAME_REQUIRED: '姓は入力必須',
  FIRST_NAME_MAX: '姓は最大５０文字',
  LAST_NAME_REQUIRED: '名前は入力必須',
  LAST_NAME_MAX: '名前は最大５０文字',
  BIRTHDAY_INVALID: '有効な日付を入力してください',
};

// id
const idSchema = z.
  string().
  min(1, ValidationMessages.ID_REQUIRED).
  regex(/^\d{4}$/, ValidationMessages.ID_FORMAT)
  .refine(async value => {
    const response = await fetch(`/api/users/${value}`);
    const data = await response.json();

    return !data
  });

// firstName
const firstNameSchema = z.string().
  min(1, ValidationMessages.FIRST_NAME_REQUIRED).
  max(50, ValidationMessages.FIRST_NAME_MAX);

// lastName
const lastNameSchema = z.
    string().
    min(1, ValidationMessages.LAST_NAME_REQUIRED).
    max(50, ValidationMessages.LAST_NAME_MAX);

// birthday
const birthdaySchema = z.string();

const ageSchema = z.string();

const genderSchema = z.string();

export const UserFormSchema = z.object({
  id: idSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  birthday: birthdaySchema,
  age: ageSchema,
  gender: genderSchema,
});

export type UserFormType = z.infer<typeof UserFormSchema>;