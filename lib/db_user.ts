// lib/fetchUsers.ts
import { promises } from 'dns';
import pool from './db'; // データベース接続設定
import { UserDbType } from '@/types/userDbTypes';
import { use } from 'react';

// 全ユーザー情報を取得するクエリ
const SELECT_USERS_QUERY = 'SELECT id, first_name, last_name, birthday, age, gender FROM user';

// 特定のユーザー情報を取得するクエリ
const SELECT_USER_QUERY = 'SELECT id, first_name, last_name, birthday, age, gender FROM user WHERE id = ?'

// ユーザー情報を追加するクエリ
const INSERT_USER_QUERY = `
  INSERT INTO user (id, first_name, last_name, birthday, age, gender)
  VALUES (?, ?, ?, ?, ?, ?)
`;

// ユーザー情報を削除するクエリ
const DELETE_USER_QUERY = 'DELETE FROM user WHERE id = ?'

// ユーザー情報を更新するクエリ
const UPDATE_USER_QUERY = `
  UPDATE user
  SET
    first_name = ?,
    last_name = ?,
    birthday = ?,
    age = ?,
    gender = ?
  WHERE id = ?;
`;

// 全ユーザー情報を取得する関数
export async function selectUsers(): Promise<UserDbType[]> {
  try {
    console.log('selectUsers');
    // クエリを実行
    const [rows] = await pool.query(SELECT_USERS_QUERY);
    // rows の型を指定することで型安全を確保
    const users =  rows as UserDbType[];

    return users;
  } catch (error) {
    // エラーハンドリング
    console.error(`全ユーザーを取得出来ませんでした:${error}`);
    throw new Error('全ユーザー取得エラー');
  }
}

// 特定のユーザー情報を取得する関数
export async function selectUser(_id: string): Promise<UserDbType | null> {
  try {
    console.log('selectUser');
    // クエリを実行
    const [rows] = await pool.query(SELECT_USER_QUERY, [_id]);
    // rows の型を指定し、配列の最初の要素を取得
    const userArray = rows as UserDbType[];

    return userArray.length > 0 ? userArray[0] : null;
  } catch (error) {
    // エラーハンドリング
    console.error(`ユーザーID${_id}のユーザーを取得出来ませんでした`);
    throw new Error('取得エラー');
  }
}

// ユーザー情報を追加する関数
export async function insertUser(user: UserDbType): Promise<void> {
  try {
    console.log('insertUser');
    // クエリを実行
    const [result] = await pool.query(INSERT_USER_QUERY, [user.id, user.firstName, user.lastName, user.birthday, user.age, user.gender]);
    // 成功ログ
    console.log(`追加結果:${result}`);
  } catch (error) {
    console.error(`追加クエリを実行出来ませんでした:${error}`);
    throw new Error('追加エラー');
  }
}

// ユーザー情報を削除する関数
export async function deleteUser(id: string): Promise<void> {
  try {
    console.log('deleteUser');
    // クエリの実行
    const [result] = await pool.query(DELETE_USER_QUERY, [id]);
    // 削除結果の表示
    console.log(`削除結果:${result}`);
  } catch (error) {
    console.error(`削除クエリを実行出来ませんでした:${error}`);
    throw new Error('削除エラー');
  }
}

// ユーザー情報を更新する関数
export async function updateUser(id: string, user: UserDbType): Promise<void> {
  try {
    console.log('updateUser');
    // クエリを実行
    const [result] = await pool.query(UPDATE_USER_QUERY, [user.firstName, user.lastName, user.birthday, user.age, user.gender, id]);
    // 更新結果の表示
    console.log(`更新結果:${result}`);
  } catch (error) {
    console.error(`更新クエリを実行出来ませんでした ${error}`);
    throw new Error('更新エラー');
  }
}
