'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useState, Dispatch,  SetStateAction, useEffect, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Dialog from '@/components/shared/ui/Dialog';


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
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const setIsLoading = useState(true)[1];
  const [previousPath, setPreviousPath] = useState<string>('/');

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleDialogClose = () => {
    setShowDialog(false);

    if (dialogMessage === '회원가입이 완료되었습니다.') {
      router.replace('/login');
    }

    if (dialogMessage === '로그인에 성공했습니다.') {
      router.replace(previousPath);
    }

    if (dialogMessage === '로그인 정보가 유효하지 않습니다. \n다시 로그인 해주세요.') {
      localStorage.clear();
      setToken(null);
      setUserId(0);
      setUserName('');
      router.replace('/login');
    }
  };

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
        setDialogMessage('회원가입이 완료되었습니다.');
        setShowDialog(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setDialogMessage(
          typeof message === 'string'
            ? message
            : '회원가입 중 오류가 발생했습니다.'
        );
      } else {
        setDialogMessage('알 수 없는 오류가 발생했습니다.');
      }
  
      setShowDialog(true);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await axios.post('/api/auth/signin', { email, password });
  
      if (result.status === 200) {
        localStorage.setItem('token', result.data.token);
        setToken(result.data.token);
        await fetchUser(result.data.token);
        setDialogMessage('로그인에 성공했습니다.');
        setShowDialog(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setDialogMessage(
          typeof message === 'string'
            ? message
            : '로그인 중 오류가 발생했습니다.'
        );
      } else {
        setDialogMessage('알 수 없는 오류가 발생했습니다.');
      }
  
      setShowDialog(true);
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
      console.error('❌ 사용자 정보 요청 실패:', error);
      setDialogMessage('로그인 정보가 유효하지 않습니다. \n다시 로그인 해주세요.');
      setShowDialog(true);
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

  useEffect(() => {
    setPreviousPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [setIsLoading]);

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

      {showDialog && (
        <Dialog onClose={handleDialogClose}>
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <p className="text-center text-base font-semibold mb-6">
              {dialogMessage}
            </p>
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
              onClick={handleDialogClose}
            >
              확인
            </button>
          </div>
        </Dialog>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
