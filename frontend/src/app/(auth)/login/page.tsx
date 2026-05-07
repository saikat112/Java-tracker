'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input {...register('email')} type="email" placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input {...register('password')} type="password" placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        {errors.root && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{errors.root.message}</div>
        )}
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-violet-600 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-600 font-semibold hover:underline">Sign up</Link>
      </p>
    </>
  );
}
