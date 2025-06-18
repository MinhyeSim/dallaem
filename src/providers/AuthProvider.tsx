'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// 타입
type AuthContextType = {
  token: string | null;
  loginModalOpen: boolean;
  setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<string | null>>;
  signup: (
    email: string,
    password: string,
    name: string,
    companyName: string
  ) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  userName: string;
  userId: number;
};

// 기본값
export const AuthContext = createContext<AuthContextType>({
  token: null,
  loginModalOpen: false,
  setLoginModalOpen: () => {},
  setToken: () => {},
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
  userName: '',
  userId: 0,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previousPath, setPreviousPath] = useState<string>('/');

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const signup = async (
    email: string,
    password: string,
    name: string,
    companyName: string
  ) => {
    try {
      const result = await axios.post('/api/auth/signup', {
        email,
        password,
        name,
        companyName,
      });
      if (result.status === 200) {
        alert('회원가입이 완료되었습니다.');
        router.replace('/login');
      }
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await axios.post('/api/auth/signin', { email, password });
      if (result.status === 200) {
        alert('로그인에 성공했습니다.');
        localStorage.setItem('token', result.data.token);
        setToken(result.data.token);
        await fetchUser(result.data.token);
        router.replace(previousPath);
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const result = await axios.post('/api/auth/fetch-user', { token });
      if (result.status === 200) {
        localStorage.setItem('user_id', result.data.id);
        localStorage.setItem('user_email', result.data.email);
        localStorage.setItem('user_name', result.data.name);
        localStorage.setItem('user_company_name', result.data.companyName);
        localStorage.setItem('user_image', result.data.image);
        setUserName(result.data.name);
        setUserId(result.data.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const signout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_company_name');
    localStorage.removeItem('user_image');
    setToken(null);
    setUserId(0);
    setUserName('');
    queryClient.invalidateQueries({ queryKey: ['checkGatheringJoined'] });
    await axios.post('/api/auth/signout');
  };

  // 최초 렌더링 시 localStorage에서 인증 정보 읽어오기
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const userName = localStorage.getItem('user_name');
      const userId = localStorage.getItem('user_id');
      if (storedToken) setToken(storedToken);
      if (userName) setUserName(userName);
      if (userId) setUserId(Number(userId));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        userId,
        loginModalOpen,
        setLoginModalOpen,
        setToken,
        signup,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
