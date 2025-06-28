'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })
    if (result?.error) {
      alert(result.error);
    }
    else {
      router.push('/');
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required

        />
        <input type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  )
}

export default LoginPage