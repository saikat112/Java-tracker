'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      setError('root', { message: msg });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'John Doe' },
          { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••' },
          { name: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input {...register(field.name)} type={field.type} placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message}</p>}
          </div>
        ))}
        {errors.root && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{errors.root.message}</div>}
        <button type="submit" disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </>
  );
}
