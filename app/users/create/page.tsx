import UserForm from "@/app/components/UserForm";

const UserCreatePage: React.FC = () => {
    return(
        <>
        <UserForm  edit={false} />
        </>
    );
}

export default UserCreatePage;