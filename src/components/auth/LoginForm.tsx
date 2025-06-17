'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import InputField from './shared/ui/InputField';
import FormFooter from './shared/ui/FormFooter';

const signinFormSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type SigninFormSchemaType = z.infer<typeof signinFormSchema>;

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);
  const router = useRouter();

  const { setToken } = useContext(AuthContext); 

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SigninFormSchemaType>({
    resolver: zodResolver(signinFormSchema),
  });

  const email = watch('email');
  const password = watch('password');

  console.log('email:', email);
  console.log('password:', password);

  const onSubmit = async (data: SigninFormSchemaType) => {
    setErrorResponseMessage(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/auths/signin`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-team-id': process.env.NEXT_PUBLIC_API_URI!,
          },
        }
      );

      const accessToken = response.data.token;
      setToken(accessToken);
      router.push('/gatherings');
    } catch (error: any) {
      const message = error?.response?.data?.message;

      if (message?.includes('존재하지 않는 아이디')) {
        setError('email', { message: '존재하지 않는 아이디입니다.' });
      } else if (message?.includes('비밀번호')) {
        setError('password', { message: '비밀번호가 아이디와 일치하지 않습니다.' });
      } else {
        setErrorResponseMessage('로그인 처리 중 오류가 발생했습니다.');
        console.error('로그인 실패:', message);
      }
    }
  };

  return (
    <div className="w-[24rem] md:w-[31rem] h-[26.5rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-4/5 flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        {/* 이메일 입력 */}
        <InputField
          label="아이디"
          id="email"
          type="email"
          placeholder="이메일을 입력해 주세요"
          {...register('email')}
          isSubmitted={isSubmitted}
          error={errors.email?.message}
        />

        {/* 비밀번호 입력 */}
        <InputField
          label="비밀번호"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          {...register('password')}
          isSubmitted={isSubmitted}
          handlePasswordVisibility={() => setIsPasswordVisible((prev) => !prev)}
          isPasswordVisible={isPasswordVisible}
          error={errors.password?.message}
          errorResponseMessage={errorResponseMessage}
        />

        {/* 로그인 버튼 */}
        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#f45b0f] text-white py-2 rounded-md font-semibold hover:bg-[#d94e07] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
        {isSubmitting ? '로그인 중' : '로그인'}
        </button>

        {/* 회원가입 링크 */}
        <FormFooter
          route="/register"
          description="같이 달램이 처음이신가요?"
          text="회원가입"
        />
      </form>
    </div>
  );
}
