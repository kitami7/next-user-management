import { z } from 'zod';

// バリデーションメッセージ
const ValidationMessages = {
  ID_REQUIRED: "IDは必須です",
  ID_FORMAT: "IDは4桁の数字である必要があります",
  ID_EXISTS: "IDは既に登録されています",
  ID_NOT_EXISTS: "IDが存在しません",
  FIRST_NAME_REQUIRED: "名は必須です",
  FIRST_NAME_MAX: "名は50文字以内である必要があります",
  LAST_NAME_REQUIRED: "姓は必須です",
  LAST_NAME_MAX: "姓は50文字以内である必要があります",
  BIRTHDAY_REQUIRED: "誕生日は必須です",
  BIRTHDAY_FORMAT: "誕生日のフォーマットが正しくありません",
};

// 共通フィールドのスキーマ
const FirstNameSchema = z.string()
  .min(1, ValidationMessages.FIRST_NAME_REQUIRED)
  .max(50, ValidationMessages.FIRST_NAME_MAX);

const LastNameSchema = z.string()
  .min(1, ValidationMessages.LAST_NAME_REQUIRED)
  .max(50, ValidationMessages.LAST_NAME_MAX);

const GenderSchema = z.string(); // 性別のバリデーションルールを追加することも可能

// 誕生日のバリデーションスキーマ
const BirthdaySchema = z.string()
  .min(1, ValidationMessages.BIRTHDAY_REQUIRED)
  .regex(/^\d{4}-\d{2}-\d{2}$/, ValidationMessages.BIRTHDAY_FORMAT); // YYYY-MM-DD形式

// IDバリデーションスキーマの作成
const IdCreateSchema = (shouldExist: boolean) => 
  z.string()
    .min(1, ValidationMessages.ID_REQUIRED)
    .regex(/^\d{4}$/, ValidationMessages.ID_FORMAT)
    .refine(async (value) => {
      try {
        const response = await fetch(`/api/users/${value}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data);
        return shouldExist ? data !== null && data !== undefined : data === null || data === undefined;
      } catch (error) {
        console.error('Error during fetch:', error);
        return false;
      }
    }, {
      message: shouldExist ? ValidationMessages.ID_NOT_EXISTS : ValidationMessages.ID_EXISTS,
    });

// POSTリクエスト用スキーマ
export const UserPostSchema = z.object({
  id: IdCreateSchema(false),
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  birthday: BirthdaySchema,
  gender: GenderSchema
});

// PUTリクエスト用スキーマ
export const UserPutSchema = z.object({
  id: IdCreateSchema(true),
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  birthday: BirthdaySchema,
  gender: GenderSchema
});

// フォームのユーザータイプ
export type UserFormType = z.infer<typeof UserPostSchema>