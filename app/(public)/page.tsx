'use client'

// Public home page: combines the hero, events, success metrics, player feature, and CTA.

import { HeroSlider } from '@/components/ui/HeroSlider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Dumbbell, Goal, Trophy } from 'lucide-react'
import { IconBadge } from '@/components/common/IconBadge'
import { createClient } from '@/lib/supabase/client'

interface PlayerOfTheWeek {
  id: string
  player_id: string
  week_start: string
  week_end: string
  points: number
  assists: number
  rebounds: number
  steals: number
  highlights: string[]
  coach_comment: string
  player: {
    first_name: string
    last_name: string
    position: string
    grade: string
    profile_image_url: string
    jersey_number: number
  }
}

export default function Home() {
  const [playersOfTheWeek, setPlayersOfTheWeek] = useState<PlayerOfTheWeek[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchPlayersOfTheWeek = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('player_of_the_week')
        .select(`
          *,
          player:players(
            first_name,
            last_name,
            position,
            grade,
            profile_image_url,
            jersey_number
          )
        `)
        .eq('is_active', true)
        .order('week_start', { ascending: false })

      if (error) throw error
      setPlayersOfTheWeek(data || [])
    } catch {
      // Error fetching players of the week
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPlayersOfTheWeek()
  }, [fetchPlayersOfTheWeek])

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % playersOfTheWeek.length)
  }

  const prevPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev - 1 + playersOfTheWeek.length) % playersOfTheWeek.length)
  }

  const currentPlayer = playersOfTheWeek[currentPlayerIndex] || {
    player: {
      first_name: 'Jordan',
      last_name: 'Davis',
      position: 'Point Guard',
      grade: '10th',
      profile_image_url: '/basketball-teen-2.webp',
      jersey_number: 23
    },
    week_start: '2024-04-22',
    week_end: '2024-04-28',
    points: 28,
    assists: 12,
    rebounds: 8,
    steals: 4,
    highlights: [
      'Led team to victory with game-winning three-pointer',
      'Perfect free throw shooting (8/8) in crucial moments',
      'Outstanding court vision and playmaking ability',
      'Demonstrated exceptional leadership and sportsmanship'
    ],
    coach_comment: "Jordan's performance this week was outstanding. His dedication to the game and ability to perform under pressure makes him a true leader on and off the court."
  }
  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Events */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events & Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our elite training programs designed to develop champions and build lifelong skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced event cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <IconBadge className="from-orange-400 to-red-500 mb-4">
                <Goal className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Summer Elite Camp</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Intensive 2-week training program for serious players looking to elevate their game to the next level.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-600">July 15-28, 2024</span>
                <span className="text-sm text-gray-500">Limited Spots</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <IconBadge className="from-blue-500 to-purple-600 mb-4">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Tournament Tryouts</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Compete for a spot on our championship teams. Show your skills and join the winning tradition.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">August 5, 2024</span>
                <span className="text-sm text-gray-500">Open Tryouts</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <IconBadge className="from-purple-500 to-pink-600 mb-4">
                <Dumbbell className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Skills Mastery Workshop</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Master the fundamentals with our expert coaches. Perfect your shooting, dribbling, and court awareness.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-600">Every Saturday</span>
                <span className="text-sm text-gray-500">All Levels</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/events"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real players, real results. See how our academy transforms dreams into championships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">15+</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">State Championships</h3>
              <p className="text-gray-600">Our teams have won 15+ state championships in the last 5 years</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">500+</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Players Trained</h3>
              <p className="text-gray-600">Over 500 players have graduated from our programs and continued their basketball journey</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">95%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">College Scholarships</h3>
              <p className="text-gray-600">95% of our senior players receive college basketball scholarships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Player of the Week */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Player of the Week
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating our standout performers who demonstrate exceptional skill, dedication, and sportsmanship
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Navigation Arrows */}
            {playersOfTheWeek.length > 1 && (
              <>
                <button
                  onClick={prevPlayer}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-yellow-400"
                  aria-label="Previous player"
                >
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextPlayer}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-yellow-400"
                  aria-label="Next player"
                >
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Player Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-400">
              <div className="md:flex">
                {/* Player Photo */}
                <div className="md:w-1/3 bg-gradient-to-br from-orange-100 to-red-100 p-8 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    {currentPlayer.player?.profile_image_url ? (
                      <img
                        src={currentPlayer.player.profile_image_url}
                        alt={`${currentPlayer.player.first_name} ${currentPlayer.player.last_name}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl text-white font-bold mb-2">
                          {currentPlayer.player?.first_name?.[0]}{currentPlayer.player?.last_name?.[0]}
                        </div>
                        <div className="text-white text-sm font-semibold">
                          #{currentPlayer.player?.jersey_number || '23'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Player Info */}
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold mr-3">
              Player of the Week
                    </div>
                    <span className="text-sm text-gray-500">
                      Week of {new Date(currentPlayer.week_start || '2024-04-22').toLocaleDateString()} - {new Date(currentPlayer.week_end || '2024-04-28').toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentPlayer.player?.first_name || 'Jordan'} {currentPlayer.player?.last_name || 'Davis'}
                  </h3>
                  <p className="text-xl text-orange-600 font-semibold mb-4">
                    {currentPlayer.player?.position || 'Point Guard'} / {currentPlayer.player?.grade || '10th'} Grade
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentPlayer.points || 28}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentPlayer.assists || 12}</div>
                      <div className="text-sm text-gray-600">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{currentPlayer.rebounds || 8}</div>
                      <div className="text-sm text-gray-600">Rebounds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{currentPlayer.steals || 4}</div>
                      <div className="text-sm text-gray-600">Steals</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Weekly Highlights</h4>
                    <ul className="text-gray-700 space-y-1">
                      {(currentPlayer.highlights || [
                        'Led team to victory with game-winning three-pointer',
                        'Perfect free throw shooting (8/8) in crucial moments',
                        'Outstanding court vision and playmaking ability',
                        'Demonstrated exceptional leadership and sportsmanship'
                      ]).map((highlight, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Coach's Comment:</span>
                      <p className="mt-1 italic">"{currentPlayer.coach_comment || "Jordan's performance this week was outstanding. His dedication to the game and ability to perform under pressure makes him a true leader on and off the court."}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Indicators */}
            {playersOfTheWeek.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {playersOfTheWeek.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPlayerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentPlayerIndex
                        ? 'bg-yellow-500 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to player ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Become a Champion?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Don't wait for opportunity. Create it. Join Books & Ball Basketball Academy today and start your journey to greatness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


