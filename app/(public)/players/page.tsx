'use client'

// Public players page: filters and displays active player profiles.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Users } from 'lucide-react'

interface Player {
  id: string
  first_name: string
  last_name: string
  position: string
  grade: string
  height: string
  weight: string
  school: string
  achievements: string
  profile_image_url: string
  jersey_number: number
  status: string
}

const positions = ['all', 'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']
const grades = ['all', '6th', '7th', '8th', '9th', '10th', '11th', '12th']

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [positionFilter, setPositionFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const supabase = useMemo(() => createClient(), [])

  const fetchPlayers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('status', 'active')
        .order('last_name', { ascending: true })

      if (error) throw error
      setPlayers(data || [])
    } catch (error) {
      console.error('Error fetching players:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  const filteredPlayers = players.filter(player => {
    const positionMatch = positionFilter === 'all' || player.position === positionFilter
    const gradeMatch = gradeFilter === 'all' || player.grade === gradeFilter
    return positionMatch && gradeMatch
  })

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading players...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Players</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented athletes at Books & Ball Basketball Academy. These young champions are developing their skills and pursuing their basketball dreams.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {positions.map(position => (
                  <option key={position} value={position}>
                    {position === 'all' ? 'All Positions' : position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'all' ? 'All Grades' : `${grade} Grade`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-10 w-10 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 relative">
                  {player.profile_image_url ? (
                    <img
                      src={player.profile_image_url}
                      alt={`${player.first_name} ${player.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {player.first_name[0]}{player.last_name[0]}
                        </span>
                      </div>
                    </div>
                  )}
                  {player.jersey_number && (
                    <div className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      <span className="font-bold text-orange-600">#{player.jersey_number}</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {player.first_name} {player.last_name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {player.position && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Position:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          player.position === 'Point Guard' ? 'bg-orange-100 text-orange-800' :
                          player.position === 'Shooting Guard' ? 'bg-blue-100 text-blue-800' :
                          player.position === 'Small Forward' ? 'bg-green-100 text-green-800' :
                          player.position === 'Power Forward' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {player.position}
                        </span>
                      </div>
                    )}

                    {player.grade && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Grade:</span>
                        <span className="ml-2">{player.grade} Grade</span>
                      </div>
                    )}

                    {player.school && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">School:</span>
                        <span className="ml-2">{player.school}</span>
                      </div>
                    )}

                    {(player.height || player.weight) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Physical:</span>
                        <span className="ml-2">
                          {player.height && player.weight ? `${player.height}, ${player.weight}` :
                           player.height ? player.height :
                           player.weight ? player.weight : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {player.achievements && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Achievements</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{player.achievements}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Player
                    </span>
                    <Link
                      href={`/players/${player.id}`}
                      className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
                    >
                      View Profile†’
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Want to Join Our Team?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            We're always looking for talented young athletes to join our academy. Contact us to learn about tryouts and training programs.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  )
}




