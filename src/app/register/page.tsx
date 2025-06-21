import AuthPoster from '@/components/auth/AuthPoster';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className='w-full h-full py-20 flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20'>
                <AuthPoster />
                <RegisterForm />
            </div>
        </main>
    );
}

