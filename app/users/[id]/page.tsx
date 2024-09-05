'use client';

import UserForm from "@/app/components/UserForm";
import { UserDbType } from "@/types/userDbTypes";
import axios from "axios";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

const EditUserPage: React.FC<EditUserPageProps> = ({ params }) => {
  // ユーザー削除リクエスト
  const deleteUserRequest = async (userId: string): Promise<any> => {
    try {
      const response = await axios.delete(`/api/users/${userId}`);
      console.log('User deleted successfully:', response.data);
      return response.data; // または必要に応じて適切な値を返す
    } catch (error) {
      console.error('There was an error deleting the user:', error);
      return undefined; // エラー時に返す値（エラーハンドリング）
    }
  };
  
  // ユーザー更新リクエスト
  const putUserRequest = async (userId: string, userData: UserDbType): Promise<UserDbType | undefined> => {
    try {
      const response = await axios.put<UserDbType>(`/api/users/${userId}`, userData);
      console.log('User updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('There was an error updating the user:', error);
      return undefined; // エラー時に返す値（エラーハンドリング）
    }
  };

  // ユーザー取得リクエスト
  const getUserRequest = async (userId: string): Promise<UserDbType | undefined> => {
    try {
      const response = await axios.get<UserDbType>(`/api/users/${userId}`);
      //console.log('User fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the user:', error);
      return undefined;
    }
  };


    const { id } = params;
    console.log(id);

    return(
        <>
        <UserForm edit={true} userId={id} getUserRequest={getUserRequest}/>
        </>
    );
}

export default EditUserPage;