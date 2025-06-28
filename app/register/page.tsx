'use client'

import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const RegisterPage = () => {
  const [email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[confirmPassword,setConfirmPassword]=useState("");

  const router = useRouter();

  const handleSubmit =async (e:FormEvent<HTMLFormElement>)=>
    {
      e.preventDefault();

      try {
        if(password !== confirmPassword)
        {
          alert("Password not match");
          return;
        }
  
        const response = await fetch('/api/auth/register',{
          method:'POST',
          headers:{
            'Content-Type':"application/json"
          },
          body:JSON.stringify(
            {
              email,
              password
            }
          )
        });
  
        const data =await response.json();
        console.log('Data of Registration : ',data)
        if(!response.ok)
        {
          throw new Error(data.message||"Registration failed!" )
        }
  
        router.push('/login')

      } catch (error) {
        console.log("Error in Registration : ",error)
      }

    }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="email"
        placeholder='Email'
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
        />
        <input type="password"
        placeholder='Password'
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        required
        />
        <input type="password"
        placeholder='Confirm Password'
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        required
        />
        <button type='submit'>Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}

export default RegisterPage