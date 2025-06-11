'use client'

import { useState } from 'react'
import axios from 'axios'
import Input from '@/components/signup/Input'
import PasswordInput from '@/components/signup/PasswordInput'


export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/auths/signup`,
        {
          name: form.name,
          email: form.email,
          companyName: form.companyName,
          password: form.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-team-id': process.env.NEXT_PUBLIC_TEAM_ID!,
          },
        }
      )

      console.log('✅ 회원가입 성공:', response.data)
      alert('회원가입이 완료되었습니다!')
    } catch (error: any) {
      console.error('❌ 회원가입 실패:', error.response?.data || error.message)
      alert('회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[calc(100vh-64px)] px-6 md:px-16 gap-8">
        {/* 왼쪽 소개 */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Welcome to 같이 달램!</h2>
          <p className="text-gray-600">바쁜 일상 속 잠깐의 휴식,<br />이제는 같이 달램과 함께 해보세요</p>
          <img src="/welcome.svg" alt="welcome" className="mx-auto max-w-[300px]" />
        </section>

        {/* 오른쪽 회원가입 폼 */}
        <section className="bg-white p-8 rounded-2xl shadow w-full max-w-md mx-auto">
          <h1 className="text-xl font-bold text-center mb-6">회원가입</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="이름" name="name" value={form.name} onChange={handleChange} />
            <Input label="아이디" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="회사명" name="companyName" value={form.companyName} onChange={handleChange} />

            <PasswordInput
              label="비밀번호"
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(prev => !prev)}
            />

            <PasswordInput
              label="비밀번호 확인"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
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
              이미 회원이신가요? <a href="/login" className="text-orange-500 font-semibold hover:underline">로그인</a>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
