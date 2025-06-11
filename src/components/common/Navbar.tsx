'use client'

export default function Navbar() {
  return (
    <header className="bg-[#f45b0f] text-white py-4 shadow">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* 왼쪽: 로고 + 메뉴 */}
        <div className="flex items-center space-x-10">
          <div className="text-xl font-bold">같이달램</div>
          <nav className="flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:underline">모임 찾기</a>
            <a href="#" className="hover:underline">찜한 모임</a>
            <a href="#" className="hover:underline">모든 리뷰</a>
          </nav>
        </div>

        {/* 오른쪽: 로그인 */}
        <div className="text-sm font-medium">
          <a href="#" className="hover:underline">로그인</a>
        </div>
      </div>
    </header>
  )
}
