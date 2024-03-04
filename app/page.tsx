'use client'
import { Spotlight } from '@/components/ui/SpotLight'
import { HomeInput } from '@/components/HomeInput'
import { Card } from '@/components/Card'
import { useState } from 'react'
import { CardRecommendation } from '@/components/CardRecommendation'

type SummaryType = {
  pros: string[]
  cons: string[]
  dev_recommendation: string
  imageSrc: string
}

export default function Home() {
  const [summary, setSummary] = useState<SummaryType>()
  return (
    <div className='min-h-screen w-full rounded-md flex flex-col md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <Spotlight
        className='-top-40 left-0 md:left-60 md:-top-20'
        fill='green'
      />

      <div
        className={`p-4 max-w-7xl  mx-auto relative z-10  w-full pt-10 ${
          summary ? 'md:mt-20' : 'md:mt-0'
        }`}
      >
        <h1 className='text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'>
          Shopify app <br /> pros and cons
        </h1>
        <p className='mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto'>
          I built this to detect potential app opportunities but I think can be
          also helpful for devs to prioritize their app features.
        </p>
        <HomeInput setSummary={setSummary} />
      </div>
      {summary && (
        <div className='grid grid-cols-2 gap-1 md:gap-4 md:max-w-xl mb-20 h-full'>
          {summary.pros.map((pro, index) => (
            <>
              <Card title='Pro' message={pro} meteor={5} key={index} />
              {summary.cons[index] && (
                <Card
                  title='Con'
                  message={summary.cons[index]}
                  key={`index-2`}
                  meteor={0}
                />
              )}
            </>
          ))}
          <div className='col-span-2 mt-2'>
            <CardRecommendation recommendation={summary.dev_recommendation} />
          </div>
          <div className='col-span-2 mt-8'>
            <p className='text-green-800 text-center font-bold'>
              If you want to receive the full analysis of your reviews and the
              top 10 features to prioritise please{' '}
              <a className='underline' href='https://x.com/jacintofleta'>
                contact me
              </a>
            </p>
          </div>
        </div>
      )}
      <p className='text-slate-500 mb-20'>
        Made by{' '}
        <a href='https://x.com/jacintofleta' className='underline'>
          Jacin
        </a>{' '}
        using{' '}
        <a href='https://pptr.dev/' className='underline'>
          Puppeteer
        </a>
        ,{' '}
        <a href='https://ui.aceternity.com/' className='underline'>
          Aceternity UI
        </a>
        ,{' '}
        <a href='https://tailwindcss.com/' className='underline'>
          Tailwind
        </a>{' '}
        and{' '}
        <a href='https://nextjs.org/' className='underline'>
          Next
        </a>
      </p>
    </div>
  )
}
