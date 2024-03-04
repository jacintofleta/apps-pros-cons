'use client'
import toast, { Toaster } from 'react-hot-toast'

import React from 'react'
import { Input } from '@/components/ui/Input'

export function HomeInput({
  setSummary,
}: {
  setSummary: React.Dispatch<React.SetStateAction<any>>
}) {
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const urlInput = document.getElementById('url') as HTMLInputElement

    const formData = new FormData()
    formData.append('url', urlInput.value)

    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'API-Key': process.env.DATA_API_KEY!,
      },
      body: formData,
    })

    if (!res.ok) {
      console.log(res)
      toast.error(res.statusText)
      setLoading(false)
      return
    }
    const data = await res.json()
    setSummary(data)

    setLoading(false)
  }
  return (
    <form className='my-8 max-w-md mx-auto' onSubmit={handleSubmit}>
      <div className='mb-4'>
        <Input
          id='url'
          placeholder='Shopify store app url'
          type='url'
          required
        />
      </div>
      <button
        className={`${
          loading && 'animate-pulse'
        } bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
        type='submit'
        disabled={loading}
      >
        {loading ? 'Loading (up to 1 minute)' : 'Get pros and cons'}
        <BottomGradient />
      </button>
      <Toaster />
    </form>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-green-500 to-transparent' />
      <span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-green-500 to-transparent' />
    </>
  )
}
