// app/users/page.tsx

import { convertBirthday, convertDbToTable, convertGender } from "@/service/userConverters";
import { UserDbType } from "@/types/userDbTypes";
import Link from "next/link";

const fetchUsers = async (): Promise<UserDbType[]> => {
  const res = await fetch('http://localhost:3000/api/users', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
};

const UserList = async () => {
  const users = await fetchUsers();
  console.log(users);
  return (
    <>
      <h1 className="text-center mb-4">ユーザー一覧</h1>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>姓</th>
            <th>名</th>
            <th>誕生日</th>
            <th>年齢</th>
            <th>性別</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{convertBirthday(user.birthday)}</td>
                <td>{user.age}</td>
                <td>{convertGender(user.gender)}</td>
                <td>
                  <Link href={`/users/${user.id}`}>編集</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default UserList;
