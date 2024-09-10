import UserForm from "@/app/components/UserForm";
import { convertDbToForm } from "@/service/userConverters";
import { UserDbType } from "@/types/userDbTypes";
import { use } from "react";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

const fetchUser = async (_id: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${_id}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (res.ok) {
      const user: UserDbType = await res.json();
      return user;
    } else {
      throw new Error(`Failed to fetch user with id ${_id}. Status: ${res.status}`);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data.");
  }
}
const EditUserPage: React.FC<EditUserPageProps> = async ({ params }) => {

  try {
    const user = await fetchUser(params.id);
    console.log(user);
    return(
      <>
        <UserForm edit={true} defalutUser={convertDbToForm(user)}/>
      </>
    );
  } catch (error) {
    return(
      <>
        <h1 className="text-center mb-4">ユーザー一覧</h1>
        <div className="alert alert-danger" role="alert">
          ユーザーの読み込み中にエラーが発生しました。
        </div>
      </>
    );
  }
}

export default EditUserPage;