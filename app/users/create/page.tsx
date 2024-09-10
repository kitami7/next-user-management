import UserForm from "@/app/components/UserForm";
import { UserFormType } from "@/schemas/userFormSchemas";

const UserCreatePage: React.FC = () => {
    return(
        <>
        <UserForm  edit={false} />
        </>
    );
}

export default UserCreatePage;