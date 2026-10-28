import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'About us' }

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'home-page' })
  return (
    <>
      <section className="container page-intro" style={{ textAlign: 'center' }}>
        <Image src="/brand/logo.png" alt="All in Tanzania" width={420} height={167} style={{ margin: '0 auto 32px', height: 'auto' }} />
        <h1>Tanzania is our home</h1>
        <p className="lead" style={{ margin: '0 auto' }}>
          All in Tanzania is a Tanzanian-owned safari company. Our guides grew up between the Serengeti and Kilimanjaro, and every journey we plan is shaped around one thing: your choice, your holiday, our mission.
        </p>
      </section>
      {home.pillars && home.pillars.length > 0 && (
        <section className="section section-dark">
          <div className="container pillars">
            {home.pillars.map((p) => (
              <div key={p.id}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Ready when you are</h2>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href="/plan" className="btn btn-primary">Build your dream safari</Link>
            <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
