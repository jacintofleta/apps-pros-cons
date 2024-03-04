import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY })

import chromium from 'chrome-aws-lambda'
import playwright from 'playwright-core'

export async function POST(request) {
  const formData = await request.formData()
  let baseURL = formData.get('url').split('?').shift()

  if (!baseURL.includes('apps.shopify.com')) {
    return Response.json(
      { some: 'data', more: 'information' },
      {
        status: 400,
        statusText:
          'Invalid URL, please get the url of an app from the Shopify App marketplace',
      }
    )
  }

  if (baseURL.endsWith('/')) {
    baseURL = baseURL.slice(0, -1)
  }
  if (!baseURL.includes('reviews')) {
    baseURL = baseURL + '/reviews'
  }

  const browser = await playwright.chromium.launch({
    args: [...chromium.args, '--font-render-hinting=none'], // This way fix rendering issues with specific fonts
    executablePath:
      process.env.NODE_ENV === 'production'
        ? await chromium.executablePath
        : '/usr/local/bin/chromium',
    headless: process.env.NODE_ENV === 'production' ? chromium.headless : true,
  })

  const page = await browser.newPage()

  const totalPages = 6
  const allReviews = []
  let summary

  try {
    for (let page_number = 1; page_number <= totalPages; page_number++) {
      const pageURL = `${baseURL}?page=${page_number}`
      await page.goto(pageURL, { waitUntil: 'domcontentloaded' })

      if (page_number === 1) {
        const numberOfATags = await page.$$eval(
          'div[data-pagination-controls] a',
          (elements) => elements.length
        )

        if (numberOfATags < 12) {
          return Response.json(
            { some: 'data', more: 'information' },
            {
              status: 400,
              statusText: 'The app does not have a minimum of 100 reviews..',
            }
          )
        }
      }

      await page.$$eval('[data-truncate-content-toggle]', (buttons) => {
        buttons.forEach((button) => button.click())
      })

      const reviews = await page.$$eval('[data-merchant-review]', (reviews) => {
        return reviews.map((el) => {
          const paragraphElement = el.querySelector('p.tw-break-words')
          const starsElement = el.querySelector('[aria-label]')
          const dateElement = el.querySelector(
            '.tw-text-body-xs.tw-text-fg-tertiary'
          )

          return {
            stars: starsElement.getAttribute('aria-label'),
            review: paragraphElement.textContent.trim(),
            date: dateElement.textContent.trim(),
          }
        })
      })

      allReviews.push(...reviews)
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in Shopify Apps and your role is to read carefully all the reviews and output a JSON with one object and only 3 keys: cons, pros and dev_recommendation. Key cons is an array of top 5 cons of the app explained in detail. Key pros is an array of top 5 pros of the app explained in detail. Key dev_recommendation is a string with an empathic and enthusiastic recommendation for the developer of the app (be specific about a feature).',
        },
        {
          role: 'user',
          content: JSON.stringify(allReviews),
        },
      ],
      response_format: { type: 'json_object' },
      model: 'gpt-3.5-turbo',
    })

    summary = completion.choices[0].message.content
  } catch (error) {
    return Response.error(500, error.message)
  } finally {
    await browser.close()

    summary = JSON.parse(summary)
    return Response.json(summary)
  }
}
