'use client';

import { useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider'; 
import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, signout, userName } = useContext(AuthContext); 

  const navLinks = [
    { href: '/gatherings', label: '모임찾기' },
    { href: '/saved', label: '찜한 모임' },
    { href: '/reviews', label: '모든 리뷰' },
  ];

  const handleLogout = () => {
    signout();
    router.push('/login');
  };

  return (
    <nav className="sticky z-50 top-0 w-full bg-white border-b-2 border-gray-300 text-xs md:text-base font-bold">
      <div className="max-w-screen-lg mx-auto h-[3.75rem] py-8 px-5 flex justify-between items-center">
        {/* 왼쪽: 로고 + 메뉴 */}
        <section className="flex gap-4 items-center">
          <Link href="/gatherings">
            <Image
              src="/logo.svg"
              alt="같이달램 로고"
              width={100}
              height={100}
              className="w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem] pointer-events-none"
            />
          </Link>

          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:opacity-50 transition duration-300 ease-in-out ${
                pathname.includes(link.href) ? 'text-[#f45b0f]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </section>

        {/* 오른쪽: 로그인 or 드롭다운 */}
        <section className="flex items-center">
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Image
                  src="/profile.svg"
                  alt="프로필 이미지"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[9rem] mt-2 p-2 border-2 border-gray-300 rounded-md bg-white flex flex-col gap-2">
                <DropdownMenuLabel className="text-[#f45b0f]">{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator className="h-[1px] bg-gray-300" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hover:opacity-50 transition duration-300 ease-in-out">
              로그인
            </Link>
          )}
        </section>
      </div>
    </nav>
  );
}
