import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ExpertChat } from '@/components/ExpertChat'
import { getPublicExpert } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const expert = await getPublicExpert()
  return {
    title: `Talk to ${expert.name}, our safari expert`,
    description: 'Ask our AI safari expert about parks, seasons, lodges and family trips, by typing or by talking.',
  }
}

type Props = { searchParams: Promise<{ about?: string }> }

export default async function ExpertPage({ searchParams }: Props) {
  const expert = await getPublicExpert()
  const { about } = await searchParams
  const initialQuestion = about ? `Tell me more about ${about.slice(0, 120)}` : undefined

  return (
    <section className="container expert-page">
      <div className="expert-intro">
        <span className="eyebrow">Ask a local expert</span>
        <h1>Plan your safari with {expert.name}</h1>
        <p className="lead">
          Ask anything about Tanzania&apos;s parks, seasons, lodges and beaches. Type, or press the microphone and simply talk.
        </p>
        <p className="muted">
          When you are ready, {expert.name} passes your plan to one of our safari planners, who reply personally. Prefer to
          build it yourself? Try the <Link href="/plan">trip builder</Link>.
        </p>
      </div>
      <ExpertChat expert={expert} initialQuestion={initialQuestion} />
    </section>
  )
}
