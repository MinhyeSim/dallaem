'use client';

import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import InputField from './shared/ui/InputField';
import FormFooter from './shared/ui/FormFooter';
import axios from 'axios';


const signupFormSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해 주세요.'),
    email: z.string().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
    companyName: z.string().min(1, '회사명을 입력해 주세요.'),
    password: z.string().min(8, '비밀번호가 8자 이상이 되도록 해 주세요.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type SignupFormSchemaType = z.infer<typeof signupFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { signup } = useContext(AuthContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit = async (data: SignupFormSchemaType) => {
    try {
      await signup(data.email, data.password, data.name, data.companyName);
      router.push('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
  
        if (typeof message === 'string' && message.includes('이미 존재하는')) {
          setError('email', { message: '중복된 이메일입니다.' });
        } else {
          alert('회원가입 중 오류가 발생했습니다.');
          console.error('회원가입 오류:', message);
        }
      } else {
        alert('예상치 못한 오류가 발생했습니다.');
        console.error('알 수 없는 에러:', error);
      }
    }
  };

  return (
    <section className="w-[24rem] h-[44.5rem] md:w-[31rem] md:h-[40.5rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-4/5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        <InputField
          label="이름"
          id="name"
          type="text"
          placeholder="이름을 입력해 주세요"
          {...register('name')}
          isSubmitted={isSubmitted}
          error={errors.name?.message}
        />

        <InputField
          label="아이디"
          id="email"
          type="text"
          placeholder="이메일을 입력해 주세요"
          {...register('email')}
          isSubmitted={isSubmitted}
          error={errors.email?.message}
        />

        <InputField
          label="회사명"
          id="companyName"
          type="text"
          placeholder="회사명을 입력해 주세요"
          {...register('companyName')}
          isSubmitted={isSubmitted}
          error={errors.companyName?.message}
        />

        <InputField
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력해 주세요"
        {...register('password')}
        isSubmitted={isSubmitted}
        error={errors.password?.message}
        isPasswordField
        isPasswordVisible={isPasswordVisible}
        handlePasswordVisibility={() => setIsPasswordVisible((prev) => !prev)}
        />

        <InputField
        label="비밀번호 확인"
        id="confirmPassword"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요"
        {...register('confirmPassword')}
        isSubmitted={isSubmitted}
        error={errors.confirmPassword?.message}
        isPasswordField
        isPasswordVisible={isConfirmPasswordVisible}
        handlePasswordVisibility={() => setIsConfirmPasswordVisible((prev) => !prev)}
        />

        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#f45b0f] text-white py-2 rounded-md font-semibold hover:bg-[#d94e07] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
        {isSubmitting ? '가입 중' : '확인'}
        </button>


        <FormFooter
          route="/login"
          description="이미 회원이신가요?"
          text="로그인"
        />
      </form>
    </section>
  );
}
