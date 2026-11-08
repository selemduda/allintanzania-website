'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { EnquiryForm } from '@/components/EnquiryForm'
import { usd } from '@/lib/format'
import { getDict, localePath, type Lang } from '@/lib/i18n'
import type { PublicExpert } from '@/lib/payload'

type Estimate = { low: number; high: number; perPerson: number; days: number; travellers: number; season: string }
type Item =
  | { kind: 'visitor'; text: string }
  | { kind: 'expert'; text: string; status?: string }
  | { kind: 'estimate'; estimate: Estimate; route: string; tier: string }
  | { kind: 'enquiry' }
  | { kind: 'error'; text: string }

const TOKEN_KEY = 'ait-expert-chat'
const store = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (v: string | null) => {
    try {
      if (v) localStorage.setItem(TOKEN_KEY, v)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {}
  },
}


/** Minimal, safe Markdown: paragraphs, bullet lists, **bold** and links to our own pages or https. */
function Rich({ text }: { text: string }) {
  const inline = (line: string, key: string) => {
    const parts: React.ReactNode[] = []
    const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(line))) {
      if (m.index > last) parts.push(line.slice(last, m.index))
      if (m[1]) {
        const href = m[2]
        if (href.startsWith('/')) parts.push(<Link key={`${key}-${m.index}`} href={href}>{m[1]}</Link>)
        else if (href.startsWith('https://'))
          parts.push(<a key={`${key}-${m.index}`} href={href} target="_blank" rel="noopener noreferrer">{m[1]}</a>)
        else parts.push(m[1])
      } else parts.push(<strong key={`${key}-${m.index}`}>{m[3]}</strong>)
      last = m.index + m[0].length
    }
    parts.push(line.slice(last))
    return parts
  }
  return (
    <>
      {text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split('\n').filter(Boolean)
        if (lines.length && lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*([-*]|\d+\.)\s/, ''), `${i}-${j}`)}</li>)}
            </ul>
          )
        }
        return <p key={i}>{lines.map((l, j) => <React.Fragment key={j}>{j > 0 && <br />}{inline(l.replace(/^#+\s*/, ''), `${i}-${j}`)}</React.Fragment>)}</p>
      })}
    </>
  )
}

/** Plain text for reading aloud: no Markdown, links reduced to their words. */
const speakable = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*#_`]/g, '').replace(/\n+/g, ' ').trim()

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

export function ExpertChat({ expert, initialQuestion, lang }: { expert: PublicExpert; initialQuestion?: string; lang: Lang }) {
  const t = getDict(lang).expert
  const [items, setItems] = useState<Item[]>([])
  const [input, setInput] = useState(initialQuestion ?? '')
  const [busy, setBusy] = useState(false)
  const [offline, setOffline] = useState(!expert.enabled)
  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [canListen, setCanListen] = useState(false)
  const token = useRef<string | null>(null)
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    setCanListen(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition))
    token.current = store.get()
    if (!token.current) return
    fetch(`/api/expert?token=${encodeURIComponent(token.current)}`)
      .then((r) => r.json())
      .then((data: { transcript?: { role: string; text: string }[] }) => {
        if (data.transcript?.length) {
          setItems(
            data.transcript.map((l) => (l.role === 'visitor' ? { kind: 'visitor', text: l.text } : { kind: 'expert', text: l.text })),
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Scroll the conversation, not the whole page.
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' })
  }, [items])

  const speak = useCallback(
    async (text: string) => {
      const clean = speakable(text)
      if (!clean) return
      if (expert.voiceProvider === 'elevenlabs') {
        try {
          const res = await fetch('/api/expert/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: clean }),
          })
          if (res.ok) {
            audio.current?.pause()
            audio.current = new Audio(URL.createObjectURL(await res.blob()))
            await audio.current.play()
            return
          }
        } catch {}
      }
      if (!('speechSynthesis' in window)) return
      const utterance = new SpeechSynthesisUtterance(clean)
      const voices = window.speechSynthesis.getVoices()
      utterance.lang = lang === 'no' ? 'nb-NO' : 'en-GB'
      utterance.voice =
        (lang === 'no' ? voices.find((v) => /^(nb|no|nn)/.test(v.lang)) : undefined) ??
        voices.find((v) => v.lang === 'en-TZ' || v.lang === 'sw-TZ') ??
        voices.find((v) => v.lang === 'en-KE' || v.lang === 'en-ZA') ??
        voices.find((v) => v.lang.startsWith('en-GB')) ??
        null
      utterance.rate = 0.98
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    },
    [expert.voiceProvider, lang],
  )

  const send = useCallback(
    async (raw: string) => {
      const message = raw.trim()
      if (!message || busy) return
      setInput('')
      setBusy(true)
      setItems((list) => [...list, { kind: 'visitor', text: message }, { kind: 'expert', text: '', status: t.thinking }])

      const updateExpert = (fn: (item: Extract<Item, { kind: 'expert' }>) => Item) =>
        setItems((list) => {
          const i = list.map((x) => x.kind).lastIndexOf('expert')
          if (i < 0) return list
          const next = [...list]
          next[i] = fn(next[i] as Extract<Item, { kind: 'expert' }>)
          return next
        })

      let reply = ''
      try {
        const res = await fetch('/api/expert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.current, message, lang }),
        })
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}))
          if (data.offline || data.limit) setOffline(true)
          throw new Error(data.error || t.error)
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''
          for (const chunk of events) {
            if (!chunk.startsWith('data: ')) continue
            const event = JSON.parse(chunk.slice(6))
            switch (event.type) {
              case 'token':
                token.current = event.token
                store.set(event.token)
                break
              case 'text':
                reply += event.text
                updateExpert((item) => ({ ...item, text: item.text + event.text, status: undefined }))
                break
              case 'status':
                updateExpert((item) => ({ ...item, status: event.text }))
                break
              case 'estimate':
                setItems((list) => {
                  const i = list.map((x) => x.kind).lastIndexOf('expert')
                  const card: Item = { kind: 'estimate', estimate: event.estimate, route: event.route, tier: event.tier }
                  return [...list.slice(0, i), card, ...list.slice(i)]
                })
                break
              case 'enquiry':
                setItems((list) => {
                  const i = list.map((x) => x.kind).lastIndexOf('expert')
                  return [...list.slice(0, i), { kind: 'enquiry' }, ...list.slice(i)]
                })
                break
              case 'error':
                throw new Error(event.message)
            }
          }
        }
        if (voiceOn && reply) void speak(reply)
      } catch (err) {
        setItems((list) => {
          const last = list.at(-1)
          const trimmed = last?.kind === 'expert' && !last.text ? list.slice(0, -1) : list
          return [...trimmed, { kind: 'error', text: (err as Error).message }]
        })
      } finally {
        updateExpert((item) => ({ ...item, status: undefined }))
        setBusy(false)
      }
    },
    [busy, speak, voiceOn, lang, t],
  )

  const toggleListening = () => {
    if (listening) {
      recognition.current?.stop()
      return
    }
    const w = window as unknown as Record<string, new () => SpeechRecognitionLike>
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Recognition) return
    const rec = new Recognition()
    rec.lang = lang === 'no' ? 'nb-NO' : navigator.language || 'en-GB'
    rec.interimResults = true
    rec.continuous = false
    let finalText = ''
    rec.onresult = (e) => {
      let interim = ''
      finalText = ''
      for (const result of Array.from(e.results)) {
        if (result.isFinal) finalText += result[0].transcript
        else interim += result[0].transcript
      }
      setInput(finalText || interim)
    }
    rec.onend = () => {
      setListening(false)
      if (finalText) {
        setVoiceOn(true)
        void send(finalText)
      }
    }
    rec.onerror = () => setListening(false)
    recognition.current = rec
    window.speechSynthesis?.cancel()
    audio.current?.pause()
    setListening(true)
    rec.start()
  }

  const restart = () => {
    store.set(null)
    token.current = null
    setItems([])
    setOffline(!expert.enabled)
  }

  return (
    <div className="chat">
      <div className="chat-head">
        <div className="chat-avatar" aria-hidden>
          {expert.avatar ? <img src={expert.avatar} alt="" /> : <span>{expert.name.slice(0, 1)}</span>}
        </div>
        <div>
          <strong>{expert.name}</strong>
          <small>
            {expert.title} · <span className="chat-badge">AI</span>
          </small>
        </div>
        <div className="chat-head-actions">
          <button
            type="button"
            className={`chat-icon ${voiceOn ? 'on' : ''}`}
            onClick={() => {
              setVoiceOn((v) => !v)
              window.speechSynthesis?.cancel()
              audio.current?.pause()
            }}
            aria-pressed={voiceOn}
            title={voiceOn ? t.voiceOnTitle : t.voiceOffTitle}
          >
            {voiceOn ? t.voiceOn : t.voiceOff}
          </button>
          {items.length > 0 && (
            <button type="button" className="chat-icon" onClick={restart} title={t.newChatTitle}>
              {t.newChat}
            </button>
          )}
        </div>
      </div>

      <div className="chat-log" aria-live="polite" ref={logRef}>
        <div className="chat-msg chat-expert">
          <Rich text={expert.greeting} />
        </div>
        {items.length === 0 && !offline && (
          <div className="chat-suggestions">
            {t.suggestions.map((s) => (
              <button key={s} type="button" className="pill" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {items.map((item, i) => {
          switch (item.kind) {
            case 'visitor':
              return <div key={i} className="chat-msg chat-visitor">{item.text}</div>
            case 'expert':
              return (
                <div key={i} className="chat-msg chat-expert">
                  {item.text ? <Rich text={item.text} /> : null}
                  {item.status && <p className="chat-status">{item.status}</p>}
                </div>
              )
            case 'estimate':
              return (
                <div key={i} className="chat-card">
                  <span className="eyebrow">{t.estimate(item.estimate.season)}</span>
                  <div className="estimate-total">
                    {usd(item.estimate.low)} – {usd(item.estimate.high)}
                  </div>
                  <p className="muted small">
                    {t.about} {usd(item.estimate.perPerson)} {t.perPerson} · {getDict(lang).days(item.estimate.days)} ·{' '}
                    {getDict(lang).travellers(item.estimate.travellers)}
                  </p>
                  <Link className="link-arrow" href={localePath(lang, `/plan?route=${encodeURIComponent(item.route)}&tier=${item.tier}`)}>
                    {t.openBuilder}
                  </Link>
                </div>
              )
            case 'enquiry':
              return (
                <div key={i} className="chat-card chat-card-ok">
                  <strong>{t.sentTitle}</strong> {t.sentBody}
                </div>
              )
            case 'error':
              return <p key={i} className="notice notice-error">{item.text}</p>
          }
        })}
        {offline && (
          <div className="chat-card">
            <p>{t.offline}</p>
            <EnquiryForm source="ai" compact lang={lang} />
          </div>
        )}
      </div>

      {!offline && (
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault()
            void send(input)
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder={listening ? t.listening : t.placeholder(expert.name)}
            rows={1}
            maxLength={2000}
            aria-label={t.yourMessage}
          />
          {canListen && (
            <button
              type="button"
              className={`chat-mic ${listening ? 'on' : ''}`}
              onClick={toggleListening}
              aria-pressed={listening}
              aria-label={listening ? t.stopListening : t.talkInstead}
              title={listening ? t.stopListening : t.talkInstead}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path fill="currentColor" d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-3.08A7 7 0 0 0 19 12h-2Z" />
              </svg>
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
            {t.send}
          </button>
        </form>
      )}
      <p className="chat-foot muted small">
        {t.foot(expert.name)}
      </p>
    </div>
  )
}
