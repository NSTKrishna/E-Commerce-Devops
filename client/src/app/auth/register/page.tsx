'use client';

import { Suspense, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/store/api';
import Link from 'next/link';

function RegisterContent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuthStore();
    const router = useRouter();

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', { name, email, password });
            login(res.data);
            router.push(redirect);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            setError(e.response?.data?.message || e.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <div className="text-red-500">{error}</div>}

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account?{' '}
                    <Link href={`/auth/login?redirect=${redirect}`}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}