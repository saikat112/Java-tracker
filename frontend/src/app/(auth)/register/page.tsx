'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create account ✨</h2>
        <p className="text-gray-500 mt-1 text-sm">Start tracking your expenses today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('name')} placeholder="John Doe" className="input-field pl-11" />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('email')} type="email" placeholder="you@example.com" className="input-field pl-11" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
              className="input-field pl-11 pr-11" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('confirmPassword')} type="password" placeholder="Repeat password"
              className="input-field pl-11" />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3.5 rounded-2xl flex items-center gap-2">
            <span className="text-lg">⚠️</span> {errors.root.message}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><span>Create Account</span><ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
