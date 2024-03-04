'use client'
import React from 'react'
import { Meteors } from '@/components/ui/Meteors'

type ContentType = {
  title: 'Pro' | 'Con'
  message: string
  meteor: number
}

export function Card({ title, message, meteor }: ContentType) {
  return (
    <div className='h-full'>
      <div className=' w-full relative max-w-xs h-full'>
        <div className='absolute inset-0 h-full w-full bg-gradient-to-r from-green-100 to-green-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl' />
        <div className='relative shadow-xl bg-black border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col  items-start'>
          <h1 className='font-bold text-xl text-white mb-4 relative z-50'>
            {title}
          </h1>

          <p className='font-normal text-base text-slate-500 mb-4 relative z-50'>
            {message}
          </p>
          {/* Meaty part - Meteor effect */}
          {meteor && <Meteors number={meteor} />}
        </div>
      </div>
    </div>
  )
}
