// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { selectUsers, insertUser } from '@/lib/db_user';
import { UserDbType } from '@/types/userDbTypes';
import { UserFormSchema, UserFormType } from '@/schemas/userFormSchemas';
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '@/utils/transformUtils';
import { convertFormToDb } from '@/service/userConverters';

// リクエストボディのバリデーション
const validateUser = (data: UserFormType): UserFormType => {
  const result = UserFormSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid user data');
  }
  return result.data;
};

// GET メソッドの処理
export async function GET(request: NextRequest) {
  try {
    const snakeCaseUsers = await selectUsers();
    const camelCaseUsers = snakeCaseUsers.map(user => convertKeysToCamelCase(user));
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache');
    return NextResponse.json(camelCaseUsers, { headers });
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch users', details: errorMessage }, { status: 500 });
  }
}

// POST メソッドの処理
export async function POST(request: NextRequest) {
  try {
    // ボディ部のデータを取得
    const requestBody = await request.json();
    // スキーマで検証し、変換する
    const userFormData = validateUser(requestBody);
    // DBデータに変換する
    const userDbData = convertFormToDb(userFormData);
    // 追加する
    await insertUser(userDbData);
    // レスポンス
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to add user', details: errorMessage }, { status: 500 });
  }
}
