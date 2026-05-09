'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type F = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: reg, isLoading } = useAuthStore();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (d: F) => {
    try {
      await reg(d.name, d.email, d.password);
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError('root', { message: msg || 'Registration failed. Please try again.' });
    }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-900 text-base placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account ✨</h2>
      <p className="text-gray-400 text-sm mb-8">Start tracking your expenses today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input {...register('name')} placeholder="John Doe" className={inputCls} autoComplete="name" />
          {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className={inputCls} autoComplete="email" />
          {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input {...register('password')} type={show ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className={`${inputCls} pr-16`}
              autoComplete="new-password" />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repeat your password"
            className={inputCls} autoComplete="new-password" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {errors.root && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl">
            <span>⚠️</span>
            <span>{errors.root.message}</span>
          </div>
        )}

        <button type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
          {isLoading
            ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Creating account...</span></>
            : 'Create Account →'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-600 font-bold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
