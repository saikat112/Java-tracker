'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
        <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('email')} type="email" placeholder="you@example.com"
              className="input-field pl-11" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••"
              className="input-field pl-11 pr-11" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3.5 rounded-2xl flex items-center gap-2">
            <span className="text-lg">⚠️</span> {errors.root.message}
          </div>
        )}

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-violet-600 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><span>Sign In</span><ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-violet-600 font-semibold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
