'use client'
import React from 'react'
import { BackgroundGradient } from '@/components/ui/BackgroundGradient'

export function CardRecommendation({
  recommendation,
}: {
  recommendation: string
}) {
  return (
    <div>
      <BackgroundGradient className='rounded-[22px] w-full p-4 sm:p-10 bg-white dark:bg-zinc-900'>
        <p className='text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200'>
          Recommendation for devs
        </p>

        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          {recommendation}
        </p>
      </BackgroundGradient>
    </div>
  )
}
