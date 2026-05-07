'use client'

// Coach overview page: summarizes roster stats and quick coaching actions.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { BookOpen, CalendarDays, CheckCircle2, Eye, Goal, Users } from 'lucide-react'
import { IconBadge } from '@/components/common/IconBadge'

interface Player {
  id: string
  first_name: string
  last_name: string
  position: string
  grade: string
  status: string
  jersey_number: number
  school: string
}

interface CoachStats {
  totalPlayers: number
  activePlayers: number
  playersByPosition: Record<string, number>
  playersByGrade: Record<string, number>
}

export default function CoachDashboard() {
  const [stats, setStats] = useState<CoachStats>({
    totalPlayers: 0,
    activePlayers: 0,
    playersByPosition: {},
    playersByGrade: {},
  })
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchCoachStats = useCallback(async () => {
    try {
      // Fetch all players
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const playerData = players || []

      // Calculate stats
      const totalPlayers = playerData.length
      const activePlayers = playerData.filter(p => p.status === 'active').length

      // Players by position
      const playersByPosition: Record<string, number> = {}
      playerData.forEach(player => {
        if (player.position) {
          playersByPosition[player.position] = (playersByPosition[player.position] || 0) + 1
        }
      })

      // Players by grade
      const playersByGrade: Record<string, number> = {}
      playerData.forEach(player => {
        if (player.grade) {
          playersByGrade[player.grade] = (playersByGrade[player.grade] || 0) + 1
        }
      })

      setStats({
        totalPlayers,
        activePlayers,
        playersByPosition,
        playersByGrade,
      })

      // Get recent players (last 5)
      setRecentPlayers(playerData.slice(0, 5))
    } catch (error) {
      console.error('Error fetching coach stats:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchCoachStats()
  }, [fetchCoachStats])

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading coach dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your players and track their progress</p>
          </div>
          <Link
            href="/dashboard/players"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Manage All Players
          </Link>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <IconBadge className="from-orange-400 to-red-500 mr-4">
                <Users className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Players</h3>
                <p className="text-2xl font-bold text-orange-600">{stats.totalPlayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <IconBadge className="from-green-500 to-teal-600 mr-4">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Players</h3>
                <p className="text-2xl font-bold text-green-600">{stats.activePlayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <IconBadge className="from-blue-500 to-purple-600 mr-4">
                <Goal className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Positions</h3>
                <p className="text-2xl font-bold text-blue-600">{Object.keys(stats.playersByPosition).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <IconBadge className="from-purple-500 to-pink-600 mr-4">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </IconBadge>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Grade Levels</h3>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.playersByGrade).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Position Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Players by Position</h3>
            <div className="space-y-3">
              {Object.entries(stats.playersByPosition).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No position data available</p>
              ) : (
                Object.entries(stats.playersByPosition).map(([position, count]) => (
                  <div key={position} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{position}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                          style={{ width: `${(count / stats.totalPlayers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Players */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Additions</h3>
            <div className="space-y-3">
              {recentPlayers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No players yet</p>
              ) : (
                recentPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {player.first_name[0]}{player.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {player.first_name} {player.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {player.position || 'No position'} / {player.grade || 'No grade'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      player.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {player.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/players"
              className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:from-orange-100 hover:to-red-100 transition-all duration-300 border border-orange-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Add New Player</div>
                <div className="text-sm text-gray-600">Create player profile</div>
              </div>
            </Link>

            <Link
              href="/dashboard/events"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <CalendarDays className="h-6 w-6 text-white" aria-hidden="true" /></div><div><div className="font-semibold text-gray-900">Schedule Practice</div>
                <div className="text-sm text-gray-600">Plan training sessions</div>
              </div>
            </Link>

            <Link
              href="/players"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg hover:from-green-100 hover:to-teal-100 transition-all duration-300 border border-green-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 text-white" aria-hidden="true" /></div><div><div className="font-semibold text-gray-900">View Team Roster</div>
                <div className="text-sm text-gray-600">Public player profiles</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Coach's Motivation</h3>
              <p className="text-blue-100">
                "The strength of the team is each individual member. The strength of each member is the team."
              </p>
              <p className="text-orange-300 text-sm mt-2">- Phil Jackson</p>
            </div>
            <Goal className="h-16 w-16 opacity-20" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}


