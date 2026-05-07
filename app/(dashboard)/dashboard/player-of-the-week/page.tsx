'use client'

// Player of the Week admin page: selects and manages featured players.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Player {
  id: string
  first_name: string
  last_name: string
  position: string
  grade: string
  jersey_number: number
  profile_image_url: string
}

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
  is_active: boolean
  player: Player
}

export default function PlayerOfTheWeekPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playersOfTheWeek, setPlayersOfTheWeek] = useState<PlayerOfTheWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [formData, setFormData] = useState({
    week_start: '',
    week_end: '',
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    highlights: [''],
    coach_comment: ''
  })

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
    }
  }, [supabase])

  const fetchPlayersOfTheWeek = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('player_of_the_week')
        .select(`
          *,
          player:players(*)
        `)
        .order('week_start', { ascending: false })

      if (error) throw error
      setPlayersOfTheWeek(data || [])
    } catch (error) {
      console.error('Error fetching players of the week:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPlayers()
    fetchPlayersOfTheWeek()
  }, [fetchPlayers, fetchPlayersOfTheWeek])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlayer) {
      alert('Please select a player')
      return
    }

    try {
      // First, set all existing players of the week to inactive
      await supabase
        .from('player_of_the_week')
        .update({ is_active: false })
        .eq('is_active', true)

      // Then insert the new player of the week
      const { error } = await supabase
        .from('player_of_the_week')
        .insert({
          player_id: selectedPlayer,
          week_start: formData.week_start,
          week_end: formData.week_end,
          points: formData.points,
          assists: formData.assists,
          rebounds: formData.rebounds,
          steals: formData.steals,
          highlights: formData.highlights.filter(h => h.trim() !== ''),
          coach_comment: formData.coach_comment,
          is_active: true
        })

      if (error) throw error

      alert('Player of the Week updated successfully!')
      fetchPlayersOfTheWeek()
      resetForm()
    } catch (error) {
      console.error('Error updating player of the week:', error)
      alert('Error updating player of the week')
    }
  }

  const resetForm = () => {
    setSelectedPlayer('')
    setFormData({
      week_start: '',
      week_end: '',
      points: 0,
      assists: 0,
      rebounds: 0,
      steals: 0,
      highlights: [''],
      coach_comment: ''
    })
  }

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }))
  }

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        // If activating, first deactivate all others
        await supabase
          .from('player_of_the_week')
          .update({ is_active: false })
          .eq('is_active', true)
      }

      const { error } = await supabase
        .from('player_of_the_week')
        .update({ is_active: isActive })
        .eq('id', id)

      if (error) throw error

      fetchPlayersOfTheWeek()
    } catch (error) {
      console.error('Error updating player status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Player of the Week Management</h1>
        <p className="text-gray-600">Manage and update the Player of the Week feature</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Set Player of the Week</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a player...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.first_name} {player.last_name} - {player.position} ({player.grade} Grade)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week Start
                </label>
                <input
                  type="date"
                  value={formData.week_start}
                  onChange={(e) => setFormData(prev => ({ ...prev, week_start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week End
                </label>
                <input
                  type="date"
                  value={formData.week_end}
                  onChange={(e) => setFormData(prev => ({ ...prev, week_end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assists
                </label>
                <input
                  type="number"
                  value={formData.assists}
                  onChange={(e) => setFormData(prev => ({ ...prev, assists: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rebounds
                </label>
                <input
                  type="number"
                  value={formData.rebounds}
                  onChange={(e) => setFormData(prev => ({ ...prev, rebounds: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steals
                </label>
                <input
                  type="number"
                  value={formData.steals}
                  onChange={(e) => setFormData(prev => ({ ...prev, steals: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Highlights
              </label>
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder="Enter a highlight..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addHighlight}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Highlight
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coach's Comment
              </label>
              <textarea
                value={formData.coach_comment}
                onChange={(e) => setFormData(prev => ({ ...prev, coach_comment: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coach's comment..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Set as Player of the Week
            </button>
          </form>
        </div>

        {/* Current Players of the Week */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Player of the Week History</h2>

          <div className="space-y-4">
            {playersOfTheWeek.map((potw) => (
              <div key={potw.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {potw.player.first_name} {potw.player.last_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      potw.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {potw.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleActive(potw.id, !potw.is_active)}
                      className={`px-3 py-1 rounded text-sm ${
                        potw.is_active
                          ? 'bg-gray-500 text-white hover:bg-gray-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {potw.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Week of {new Date(potw.week_start).toLocaleDateString()} - {new Date(potw.week_end).toLocaleDateString()}
                </p>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div><strong>{potw.points}</strong> Points</div>
                  <div><strong>{potw.assists}</strong> Assists</div>
                  <div><strong>{potw.rebounds}</strong> Rebounds</div>
                  <div><strong>{potw.steals}</strong> Steals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

