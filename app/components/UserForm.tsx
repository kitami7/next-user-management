'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserFormType, UserPostSchema, UserPutSchema } from "@/schemas/userFormSchemas";
import { UserDbType } from "@/types/userDbTypes";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertDbToForm } from "@/service/userConverters";
import { undefined } from "zod";
import { useRouter } from "next/navigation";

type UserFormProps = {
    edit: boolean;
    defalutUser?: UserFormType;
};

const UserForm: React.FC<UserFormProps> = ({ edit, defalutUser }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const { register, handleSubmit, getValues, formState: {errors, isDirty, isValid }, reset} = useForm<UserFormType>({
        resolver: zodResolver(edit ? UserPutSchema : UserPostSchema),
        defaultValues: {
            id: edit ? defalutUser?.id : '',
            firstName: edit ? defalutUser?.firstName : '',
            lastName: edit ? defalutUser?.lastName : '',
            birthday: edit ? defalutUser?.birthday : '',
            gender: edit ? defalutUser?.gender : '',
        },
    });

    // ユーザー追加
    const postUser = async (userFormData: UserFormType): Promise<Response> => {
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userFormData),
            });
            if (res.ok) {
                console.log(res);
                return res;
            } else {
                throw new Error('POSTエラー');
            }
        } catch (error) {
            throw new Error('ネットワークエラー');
        }
    }

    // ユーザー変更
    const putUser = async (id: string, userFormData: UserFormType): Promise<Response> => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userFormData),
            });
            if (res.ok) {
                return res;
            } else {
                throw new Error('PUTエラー');
            }
        } catch (error) {
            throw new Error('ネットワークエラー');
        }
    };

    // ユーザー削除
    const deleteUser = async (id: string): Promise<Response> => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res.ok) {
                return res;
            } else {
                throw new Error('DELETEエラー');
            }
        } catch (error) {
            throw new Error('ネットワークエラー');
        }
    }
    // PUTリクエストまたはPOSTリクエスト
    const handlePostOrPut: SubmitHandler<UserFormType> = async (formData) => {
        console.log('POST又はPUT');
        if (edit) {
            console.log('PUTリクエスト')
            try {
                const res = await putUser(formData.id, formData);
                console.log(`PUT結果:${res}`);
                router.push('/users');
                router.refresh();
            } catch (error) {
                console.log('PUTエラー');
            }
        } else {
            // POSTリクエスト
            console.log('POSTリクエスト');
            try {
                const res = await postUser(formData);
                console.log(`POST結果:${res}`);
                router.push('/users');
                router.refresh();
            } catch(error) {
                console.log('POSTエラー');
            }
        }
        console.log(formData);
    };

    // バリデーションエラー
    const onError = (errors: FieldErrors<UserFormType>) => {
        console.log(errors);
    };        
    // DELETEリクエスト
    const handleDelete = async () => {
        try {
            const id = getValues('id');
            const res = await deleteUser(id);
            console.log(res);
            router.push('/users');
            router.refresh();
        } catch (error) {
            console.log('DELETEエラー');
        }
    }

    if (error) return <p>{error}</p>;

    return (
        <>
            <form noValidate onSubmit={handleSubmit(handlePostOrPut, onError)}>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">ID</label>
                    <input 
                        type="text" 
                        {...register('id')} 
                        id="id" 
                        className={`form-control ${errors.id ? 'is-invalid' : ''}`}
                        readOnly={edit} 
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
                        {...register("birthday")} 
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
                    <button type="button" className="btn btn-secondary" onClick={() => { reset() }}>リセット</button>
                </div>
            </form>
        </>
    );
}

export default UserForm;
