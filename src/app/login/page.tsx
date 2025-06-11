'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => setShowPassword(prev => !prev)

  return (
    <div className="min-h-screen bg-gray-100" >
      {/* 본문 */}
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
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1">아이디</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">비밀번호</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요."
                className="w-full rounded-md bg-gray-100 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
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
