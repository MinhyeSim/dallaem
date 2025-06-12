'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { EyeIcon, EyeOffIcon } from 'lucide-react'


const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginFormSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword(prev => !prev)


  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/auths/signin`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-team-id': process.env.NEXT_PUBLIC_TEAM_ID!,
          },
        }
      )

      console.log('✅ 로그인 성공:', response.data)
      alert('로그인 성공!')

    } catch (error: any) {
      const message = error?.response?.data?.message

      if (message?.includes('존재하지 않는 아이디')) {
        setError('email', { message: '존재하지 않는 아이디입니다.' })
      } else if (message?.includes('비밀번호')) {
        setError('password', { message: '비밀번호가 아이디와 일치하지 않습니다.' })
      } else {
        console.error('로그인 실패:', message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[calc(100vh-64px)] px-6 md:px-16 gap-8">
        {/* 왼쪽 소개 영역 */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Welcome to 같이 달램!</h2>
          <p className="text-gray-600">바쁜 일상 속 쉼같은 휴식,<br />이제는 같이 달램과 함께 해보세요</p>
          <img src="/welcome.svg" alt="welcome" className="mx-auto max-w-[300px]" />
        </section>

        {/* 로그인 폼 영역 */}
        <section className="bg-white p-8 rounded-2xl shadow w-full max-w-md mx-auto">
          <h1 className="text-xl font-bold text-center mb-6">로그인</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1">아이디</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
                  errors.email
                    ? 'border border-red-500 bg-red-50 focus:ring-red-500'
                    : 'bg-gray-100 focus:ring-orange-500'
                }`}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">비밀번호</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요."
                  className={`w-full rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
                    errors.password
                      ? 'border border-red-500 bg-red-50 focus:ring-red-500'
                      : 'bg-gray-100 focus:ring-orange-500'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-400 text-white py-2 rounded-md transition hover:bg-[#f45b0f]"
            >
              로그인
            </button>

            <p className="text-sm text-center text-gray-500">
              같이 달램이 처음이신가요? <a href="/signup" className="text-orange-500 font-semibold hover:underline">회원가입</a>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
