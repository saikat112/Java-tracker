'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type F = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: reg, isLoading } = useAuthStore();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (d: F) => {
    try { await reg(d.name, d.email, d.password); router.push('/dashboard'); }
    catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account ✨</h2>
      <p className="text-gray-400 text-sm mb-8">Start tracking your expenses</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'John Doe' },
          { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com' },
        ].map(f => (
          <div key={f.name}>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">{f.label}</label>
            <input {...register(f.name)} type={f.type} placeholder={f.placeholder} className="field" />
            {errors[f.name] && <p className="text-red-500 text-xs mt-1 ml-1">{errors[f.name]?.message}</p>}
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Password</label>
          <div className="relative">
            <input {...register('password')} type={show ? 'text' : 'password'} placeholder="Min 8 characters" className="field pr-12" />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Confirm Password</label>
          <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className="field" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>

        {errors.root && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl border border-red-100">
            {errors.root.message}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn-violet mt-2">
          {isLoading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Have an account?{' '}
        <Link href="/login" className="text-violet-600 font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
