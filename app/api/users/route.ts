// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { selectUsers, insertUser } from '@/lib/db_user';
import { UserDbType } from '@/types/userDbTypes';
import { UserPostSchema, UserPutSchema, UserFormType } from '@/schemas/userFormSchemas';
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '@/utils/transformUtils';
import { convertFormToDb } from '@/service/userConverters';

// POSTリクエストのバリデーション
const validatePostUser = async (data: UserFormType): Promise<UserFormType> => {
  try {
    const result = await UserPostSchema.parseAsync(data);
    return result;
  } catch (error) {
    console.error('バリデーション追加エラー');
    throw new Error('バリデーション追加エラー');
  }  
};

// GET メソッドの処理
export async function GET(request: NextRequest) {
  try {
    console.log('GETエンドポイント');
    const snakeCaseUsers = await selectUsers();
    console.log(snakeCaseUsers);
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
    console.log('POSTエンドポイント');
    // ボディ部のデータを取得
    const userFormData: UserFormType = await request.json();
    // スキーマで検証し、変換する
    const validatedData = await UserPostSchema.parseAsync(userFormData);
    // DBデータに変換する
    const userDbData: UserDbType = convertFormToDb(validatedData);
    console.log(userDbData);
    // 追加する
    insertUser(userDbData);
    // レスポンス
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to add user', details: errorMessage }, { status: 500 });
  }
}
