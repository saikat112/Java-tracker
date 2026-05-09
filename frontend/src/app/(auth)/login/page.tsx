'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type F = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d: F) => {
    try {
      await login(d.email, d.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;

      if (!status) {
        // Network error — server might be sleeping
        setError('root', { message: 'Server is waking up, please try again in 30 seconds...' });
      } else if (status === 401 || status === 400) {
        setError('root', { message: msg || 'Invalid email or password.' });
      } else {
        setError('root', { message: 'Something went wrong. Please try again.' });
      }
    }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-base placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h2>
      <p className="text-gray-400 text-sm mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com"
            className={inputCls} autoComplete="email" />
          {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input {...register('password')} type={show ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`${inputCls} pr-16`}
              autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
            <span className="mt-0.5">⚠️</span>
            <span>{errors.root.message}</span>
          </div>
        )}

        <div className="flex justify-end -mt-1">
          <Link href="#" className="text-sm font-semibold text-violet-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
          {isLoading
            ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Signing in...</span></>
            : 'Sign In →'}
        </button>
      </form>

      {/* Hint for first load */}
      <div className="mt-4 bg-blue-50 border border-blue-100 text-blue-600 text-xs px-4 py-3 rounded-2xl text-center">
        💡 First login may take 30-60 seconds as the server wakes up (free tier)
      </div>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-600 font-bold hover:underline">Sign up free</Link>
      </p>
    </div>
  );
}
