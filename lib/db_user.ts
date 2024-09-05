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
  UPDATE users
  SET
    first_name = ?,
    last_name = ?,
    birthday = ?,
    gender = ?)
  WHERE id = ?;
`;

// 全ユーザー情報を取得する関数
export async function selectUsers(): Promise<UserDbType[]> {
  try {
    // クエリを実行
    const [rows] = await pool.query(SELECT_USERS_QUERY);
    // rows の型を指定することで型安全を確保
    const users =  rows as UserDbType[];

    return users;
  } catch (error) {
    // エラーハンドリング
    console.error('Error select users:', error);
    throw new Error('Failed to select users');
  }
}

// 特定のユーザー情報を取得する関数
export async function selectUser(_id: string): Promise<UserDbType | null> {
  try {
    // クエリを実行
    const [rows] = await pool.query(SELECT_USER_QUERY, [_id]);
    
    // rows の型を指定し、配列の最初の要素を取得
    const userArray = rows as UserDbType[];

    return userArray.length > 0 ? userArray[0] : null;
  } catch (error) {
    // エラーハンドリング
    console.error('Error select user with ID:', _id, 'Error', error);
    throw new Error('Failed to select user');
  }
}

// ユーザー情報を追加する関数
export async function insertUser(user: UserDbType): Promise<void> {
  try {
    console.log('addUser');
    const { id, firstName, lastName, birthday } = user;
    await pool.beginTransaction();
    // クエリを実行
    await pool.query(INSERT_USER_QUERY, [id, firstName, lastName, birthday]);
    // コミット
    await pool.commit();
    // 成功ログ
    console.log('User added successfully');
  } catch (error) {
    // エラーハンドリング
    console.error('Error adding user:', error);
    // トランザクションをロールバック
    try {
      await pool.rollback();
    } catch (rollbackError) {
      console.error('Error rolling back transaction', rollbackError);
    }
    // エラーをスロー
    throw new Error('Failed to insert user');
  }
}

// ユーザー情報を削除する関数
export async function deleteUser(id: string): Promise<void> {
  try {
    console.log(`Deleting user with ID:${id}`);
    // トランザクションを開始
    await pool.beginTransaction();
    // 削除クエリを実行
    await pool.query(DELETE_USER_QUERY, [id]);
    // トランザクションをコミット
    await pool.commit();
    // 成功ログ
    console.log('User deleted successfully');
  }
  catch (error) {
    // エラーハンドリング
    console.error('Error deleteing user:', error);

    // トランザクションをロールバック
    try {
      await pool.rollback();
    } catch (rollbackError) {
      console.error('Error rolling back transaction', rollbackError);
    }
    // エラーをスロー
    throw new Error('Failed to delete user');
  }
}

// ユーザー情報を更新する関数
export async function updateUser(_id: string, user: UserDbType): Promise<void> {
  try {
    console.log('updateUser');
    const { id, firstName, lastName, birthday } = user;
    await pool.beginTransaction();
    // クエリを実行
    await pool.query(UPDATE_USER_QUERY, [_id, firstName, lastName, birthday]);
    // コミット
    await pool.commit();
    // 成功ログ
    console.log('User update successfully');
  } catch (error) {
    // エラーハンドリング
    console.error('Error update user:', error);
    // トランザクションをロールバック
    try {
      await pool.rollback();
    } catch (rollbackError) {
      console.error('Error rolling back transaction', rollbackError);
    }
    // エラーをスロー
    throw new Error('Failed to update user');
  }
}
