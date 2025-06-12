'use client'

import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/signup/Input'
import PasswordInput from '@/components/signup/PasswordInput'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const signupSchema = z
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
  })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/auths/signup`,
        {
          name: data.name,
          email: data.email,
          companyName: data.companyName,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-team-id': process.env.NEXT_PUBLIC_TEAM_ID!,
          },
        }
      )

      alert('회원가입이 완료되었습니다!')
      router.push('/login');
    } catch (error: any) {
      const message = error?.response?.data?.message

      if (message?.includes('이미 존재하는')) {
        setError('email', { message: '중복된 이메일입니다.' })
      } else {
        alert('회원가입 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] px-4 md:px-12 gap-6 items-center justify-center">
        {/* 왼쪽 소개 */}
        <section className="flex-[1.2] max-w-lg w-full text-center space-y-6 mt-8 md:mt-16">
        <h2 className="text-2xl font-semibold">Welcome to 같이 달램!</h2>
          <p className="text-gray-600">바쁜 일상 속 잠깐의 휴식,<br />이제는 같이 달램과 함께 해보세요</p>
          <img src="/welcome.svg" alt="welcome" className="mx-auto max-w-[300px]" />
        </section>

        {/* 오른쪽 회원가입 폼 */}
        <section className="flex-[1.4] max-w-md w-full bg-white p-8 rounded-2xl shadow">

          <h1 className="text-xl font-bold text-center mb-6">회원가입</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="이름" {...register('name')} error={errors.name?.message} />
            <Input label="아이디" type="text" {...register('email')} error={errors.email?.message} />
            <Input label="회사명" {...register('companyName')} error={errors.companyName?.message} />

            <PasswordInput
              label="비밀번호"
              {...register('password')}
              error={errors.password?.message}
              show={showPassword}
              toggle={() => setShowPassword(prev => !prev)}
            />

            <PasswordInput
              label="비밀번호 확인"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              show={showConfirm}
              toggle={() => setShowConfirm(prev => !prev)}
            />

            <button
              type="submit"
              className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-[#f45b0f] transition"
            >
              확인
            </button>

            <p className="text-sm text-center text-gray-500">
              이미 회원이신가요?{' '}
              <a href="/login" className="text-orange-500 font-semibold hover:underline">
                로그인
              </a>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
