'use client'

// Hero slider: controls the rotating homepage showcase and slide navigation.

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Slide content drives the text, imagery, metrics, and color theme for each hero state.
const slides = [
  {
    id: 1,
    kicker: 'Elite Youth Training',
    title: 'Build Skills That Travel Beyond The Court',
    copy: 'Books & Ball blends serious basketball development with classroom discipline, confidence, and leadership.',
    image: '/basketball-teen-1.jpg',
    cta: 'Start Training',
    metric: '500+',
    metricLabel: 'Players coached',
    accent: 'bg-orange-400',
    gradient: 'from-orange-500 via-amber-400 to-yellow-300',
  },
  {
    id: 2,
    kicker: 'Game-Ready Confidence',
    title: 'Train For The Moment The Gym Gets Loud',
    copy: 'We sharpen footwork, decision-making, shooting rhythm, and pressure habits with focused reps every session.',
    image: '/basketball-teen-2.webp',
    cta: 'Join The Academy',
    metric: '95%',
    metricLabel: 'Growth mindset',
    accent: 'bg-sky-300',
    gradient: 'from-sky-400 via-blue-400 to-indigo-400',
  },
  {
    id: 3,
    kicker: 'Student-Athlete Culture',
    title: 'Dream Bigger. Study Smarter. Play Harder.',
    copy: 'Our academy helps young athletes chase basketball goals while building habits that support school and life.',
    image: '/basketball-teen-3.svg',
    cta: 'Explore Programs',
    metric: '15+',
    metricLabel: 'Championship runs',
    accent: 'bg-lime-300',
    gradient: 'from-lime-300 via-emerald-300 to-teal-300',
  },
]

const SLIDE_DURATION = 6500

export function HeroSlider() {
  // Track the active slide and derive the visible content from the slide config.
  const [currentSlide, setCurrentSlide] = useState(0)
  const activeSlide = slides[currentSlide]

  // Automatically advance the hero while keeping manual navigation available.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length)
    }, SLIDE_DURATION)

    return () => window.clearInterval(timer)
  }, [])

  const goToNextSlide = () => {
    setCurrentSlide((slide) => (slide + 1) % slides.length)
  }

  const goToPreviousSlide = () => {
    setCurrentSlide((slide) => (slide - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#090d14] text-white">
      {/* Decorative page background behind the slider stage. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_28%),linear-gradient(135deg,#090d14_0%,#111827_45%,#05070b_100%)]" />
      <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute -right-28 top-20 h-72 w-72 rounded-full border border-white/10" />
      <div className="absolute -bottom-36 left-16 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Main hero layout: large image stage plus supporting info panel. */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid min-h-[calc(100vh-7rem)] gap-6 lg:grid-cols-[minmax(0,1fr)_25rem]">
          {/* Image stage: stacks all slides and fades/translates only the active one into view. */}
          <div className="relative min-h-[34rem] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-[1300ms] ease-out ${
                    isActive
                      ? 'translate-x-0 opacity-100'
                      : index < currentSlide
                        ? '-translate-x-10 opacity-0'
                        : 'translate-x-10 opacity-0'
                  }`}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    priority={index === 0}
                    className={`object-cover transition-transform duration-[7000ms] ease-out ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  />
                </div>
              )
            })}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-transparent to-transparent" />

            <div className="relative flex h-full min-h-[34rem] flex-col justify-between p-6 sm:p-8 lg:p-10">
              {/* Top bar: brand badge and previous/next controls. */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/25 px-4 py-2 backdrop-blur-md">
                  <Image
                    src="/bnbLogo.jpeg"
                    alt="Books & Ball Basketball Academy Logo"
                    width={42}
                    height={42}
                    className="rounded-full border border-white/60"
                  />
                  <span className="text-xs font-black uppercase tracking-[0.35em] text-white/85">
                    Books & Ball
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-md">
                  <button
                    onClick={goToPreviousSlide}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-slate-950"
                    aria-label="Previous slide"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextSlide}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white hover:text-slate-950"
                    aria-label="Next slide"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Active slide copy and call-to-action buttons. */}
              <div className="max-w-3xl">
                <div
                  key={activeSlide.id}
                  className="transition-all duration-700 animate-in fade-in slide-in-from-bottom-4"
                >
                  <p className={`mb-5 inline-flex rounded-full bg-gradient-to-r ${activeSlide.gradient} px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-slate-950`}>
                    {activeSlide.kicker}
                  </p>
                  <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                    {activeSlide.title}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                    {activeSlide.copy}
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/contact"
                      className={`rounded-full bg-gradient-to-r ${activeSlide.gradient} px-8 py-4 text-center font-black text-slate-950 shadow-xl shadow-black/30 transition hover:-translate-y-1`}
                    >
                      {activeSlide.cta}
                    </Link>
                    <Link
                      href="/about"
                      className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-center font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-slate-950"
                    >
                      See Our Story
                    </Link>
                  </div>
                </div>
              </div>

              {/* Compact dot navigation without image thumbnails. */}
              <div className="flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? `w-14 bg-gradient-to-r ${slide.gradient}`
                        : 'w-2.5 bg-white/35 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side panel: reinforces the current slide with context and quick stats. */}
          <aside className="grid gap-6 lg:grid-rows-[1fr_auto]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur-md">
              <div className={`mb-6 h-2 w-20 rounded-full ${activeSlide.accent}`} />
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/45">
                Current Focus
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight">
                {activeSlide.kicker}
              </h2>
              <p className="mt-4 leading-7 text-white/70">
                Slide through the academy pillars: skill development, pressure confidence, and student-athlete habits.
              </p>

              <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-5">
                <p className={`bg-gradient-to-r ${activeSlide.gradient} bg-clip-text text-5xl font-black text-transparent`}>
                  {activeSlide.metric}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                  {activeSlide.metricLabel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-2xl font-black">3</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Pillars</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-2xl font-black">1:1</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Coaching</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-2xl font-black">A+</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Mindset</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

