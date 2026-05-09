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
  password: z.string().min(1, 'Required'),
});
type F = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: F) => {
    try { await login(d.email, d.password); router.push('/dashboard'); }
    catch { setError('root', { message: 'Invalid email or password' }); }
  };

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h2>
      <p className="text-gray-400 text-sm mb-8">Sign in to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Email address</label>
          <input {...register('email')} type="email" placeholder="you@example.com" className="field" />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Password</label>
          <div className="relative">
            <input {...register('password')} type={show ? 'text' : 'password'} placeholder="••••••••" className="field pr-12" />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl border border-red-100">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end">
          <Link href="#" className="text-sm text-violet-600 font-medium">Forgot password?</Link>
        </div>

        <button type="submit" disabled={isLoading} className="btn-violet mt-2">
          {isLoading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        No account?{' '}
        <Link href="/register" className="text-violet-600 font-semibold">Create one</Link>
      </p>
    </div>
  );
}
