'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserFormSchema, UserFormType } from "@/schemas/userFormSchemas";
import { UserDbType } from "@/types/userDbTypes";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertDbToForm } from "@/service/userConverters";

type UserFormProps = {
    edit: boolean;
    userId?: string;
    getUserRequest?: (userId: string) => Promise<UserDbType | undefined>;
    deleteUserRequest?: (userId: string) => Promise<any>;
    putUserRequest?: (userId: string, userData: UserFormType) => Promise<UserDbType | undefined>;
    postUserRequest?: (userData: UserFormType) => Promise<UserDbType | undefined>;
};

const UserForm: React.FC<UserFormProps> = ({ edit, userId, getUserRequest, deleteUserRequest, putUserRequest, postUserRequest }) => {
    const [defaultUser, setDefaultUser] = useState<UserFormType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: {errors, isDirty, isValid }, reset} = useForm<UserFormType>({
        resolver: zodResolver(UserFormSchema),
        defaultValues: {
            birthday: new Date().toISOString().split('T')[0],
        }
    })
    useEffect(() => {
        if (!edit || !userId || !getUserRequest) {
            return;
        }

        const fetchUser = async () => {
            try {
                const userDbData = await getUserRequest(userId);
                if (userDbData) {
                    const userFormData = convertDbToForm(userDbData);
                    console.log(userDbData);
                    reset(userFormData);
                }
            } catch (err) {
                setError('Failed to fetch user');
                console.error('Error fetching user:', err);
            } finally {
            }
        };

        fetchUser();
    }, [edit, userId, getUserRequest, reset]);

    // PUTリクエストまたはPOSTリクエスト
    const handlePostOrPut: SubmitHandler<UserFormType> = async (formData) => {
        console.log("post");
        if (edit) {
            // PUTリクエスト
            console.log('PUTリクエスト');
        } else {
            // POSTリクエスト
            console.log('POSTリクエスト');
        }
        console.log(formData);
    };

    // バリデーションエラー
    const onError = (errors: FieldErrors<UserFormType>) => {
        console.log(errors);
    };        
    // DELETEリクエスト
    const handleDelete = async () => {
        console.log('DELETEリクエスト');
    };

    if (error) return <p>{error}</p>;

    return (
        <>
            <h1 className="text-center mb-4">{edit ? "ユーザー編集" : "ユーザー作成"}</h1>
            <form noValidate onSubmit={handleSubmit(handlePostOrPut, onError)}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">ID</label>
                    <input 
                        type="text" 
                        {...register('id')} 
                        id="id" 
                        className={`form-control ${errors.id ? 'is-invalid' : ''}`} 
                    />
                    {errors.id && <div className="invalid-feedback">{errors.id.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">姓</label>
                    <input 
                        type="text"
                        {...register('firstName')} 
                        id="firstName" 
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}  
                     />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">名</label>
                    <input 
                        type="text" 
                        {...register("lastName")} 
                        id="lastName" 
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} 
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}

                </div>
                <div className="mb-3">
                    <label htmlFor="birthday" className="form-label">誕生日</label>
                    <input 
                        type="date" 
                        {...register("birthday", {valueAsDate: true})} 
                        id="birthday" 
                        className={`form-control ${errors.birthday ? 'is-invalid' : ''}`}
                    />
                    {errors.birthday && <div className="invalid-feedback">{errors.birthday.message}</div>}

                </div>
                <div className="mb-3">
                    <p>性別</p>
                    <div className="form-check form-check-inline">
                        <input 
                            type="radio" 
                            {...register('gender')} 
                            id="male" 
                            className="form-check-input" 
                            value="m" 
                        />
                        <label className="form-check-label" htmlFor="male">男性</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input 
                            type="radio" 
                            {...register('gender')} 
                            id="female" 
                            className="form-check-input" 
                            value="f" 
                        />
                        <label className="form-check-label" htmlFor="female">女性</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input 
                            type="radio" 
                            {...register('gender')} 
                            id="other" 
                            className="form-check-input" 
                            value="o" 
                        />
                        <label className="form-check-label" htmlFor="other">その他</label>
                    </div>
                </div>
                <div className="mb-3">
                    <button type="submit" className={`btn btn-${edit ? 'warning' : 'success'} me-2`}>{edit ? '変更' : '新規'}</button>
                    {edit && <button type="button" className="btn btn-danger me-2" onClick={handleDelete}>削除</button>}
                    <button type="reset" className="btn btn-secondary">リセット</button>
                </div>
            </form>
        </>
    );
}

export default UserForm;
