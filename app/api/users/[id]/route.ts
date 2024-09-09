// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { selectUser, deleteUser, updateUser } from '@/lib/db_user';
import { convertKeysToCamelCase } from '@/utils/transformUtils';
import { UserFormType, UserPutSchema } from '@/schemas/userFormSchemas';
import { convertFormToDb } from '@/service/userConverters';

// リクエストボディのバリデーション
const validatePutUser = (data: UserFormType): UserFormType => {
  const result = UserPutSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid user data');
  }
  return result.data;
};

// GET メソッドの処理
export async function GET(request: NextRequest, { params } : {params: { id: string } }) {
  try {
    const userId = params.id;
    // ユーザーIDに基づいてデータを取得
    const snakeCaseUsers = await selectUser(userId);
    // ユーザーが存在する場合にキャメルケースに変換
    if (snakeCaseUsers) {
      const camelCaseUsers = convertKeysToCamelCase(snakeCaseUsers);
      // レスポンスヘッダーの設定
      const headers = new Headers();
      headers.set('Cache-Control', 'no-cache');
      console.log(camelCaseUsers);
      return NextResponse.json(camelCaseUsers, { headers });
    } else {
      // ユーザーが見つからない場合のエラーレスポンス
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    // エラーレスポンスを返す
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT メソッドの処理
export async function PUT(request: NextRequest, { params } : {params: { id : string } }) {
  try {
    // IDを取得
    const userId = params.id;
    // IDを検証
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    // ボディ部を取得
    const requestBody = await request.json();
    // ボディ部を検証
    const userFormData = validatePutUser(requestBody);
    // DBデータに変換する
    const userDbData = convertFormToDb(userFormData);
    //
    console.log('put');
    // 更新する
    await updateUser(userId, userDbData);
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to update user', details: errorMessage }, { status: 500 });
  }
}

// DELETE メソッドの処理
export async function DELETE(request: NextRequest, { params } : { params: { id : string} }) {
  try {
    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await deleteUser(userId);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete user', details: errorMessage }, { status: 500 });
  }
}
