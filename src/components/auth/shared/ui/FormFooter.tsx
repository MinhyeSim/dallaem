import Link from 'next/link';

interface FormFooterProps {
  route: string;
  description: string;
  text: string;
}

export default function FormFooter({ route, description, text }: FormFooterProps) {
  return (
    <p className="text-sm text-center text-gray-500">
      {description} {''}
      <Link
        href={route}
        className="text-[#f45b0f] font-semibold hover:underline"
      >
        {text}
      </Link>
    </p>
  );
}
