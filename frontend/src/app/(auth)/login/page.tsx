'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email'),
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
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h2>
      <p className="text-gray-400 text-sm mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-base placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={show ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pr-16 text-gray-900 text-base placeholder-gray-400 outline-none transition-all focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* Error */}
        {errors.root && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
            {errors.root.message}
          </div>
        )}

        {/* Forgot */}
        <div className="flex justify-end -mt-2">
          <Link href="#" className="text-sm font-semibold text-violet-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-600 font-bold hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
