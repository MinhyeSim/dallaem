import Image from 'next/image';

export default function AuthPoster() {
  return (
    <div className="flex flex-col gap-2 sm:gap-4 items-center justify-center mb-8">
      <Image
        src="/auth_poster.svg"
        alt="auth poster"
        width={300}
        height={300}
        className="w-[10rem] h-auto md:w-[18rem] lg:w-[22rem] mx-auto hover:scale-105 transition-all duration-200 ease-in-out pointer-events-none"
      />
      <div className="text-center space-y-1 sm:space-y-2">
        <h2 className="mb-1 text-lg lg:text-2xl font-bold">Welcome to 같이 달램!</h2>
        <p className="text-2xs sm:text-sm lg:text-base text-gray-600">
          바쁜 일상 속 잠깐의 휴식,
          <br />
          이제는 같이 달램과 함께 해보세요
        </p>
      </div>
    </div>
  );
}
