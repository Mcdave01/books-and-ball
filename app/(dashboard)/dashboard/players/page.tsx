'use client'

// Players admin page: manages player records and profile editing.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PlayerForm } from '@/components/admin/PlayerForm'
import { PlayerList } from '@/components/admin/PlayerList'

interface Player {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  grade: string
  position: string
  height: string
  weight: string
  school: string
  player_video_documentary: string
  contact_email: string
  contact_phone: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_conditions: string
  achievements: string
  profile_image_url: string
  jersey_number: number
  status: string
  image: File | null
  notes: string
  created_at: string
  updated_at: string
}

export default function PlayersManagement() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const supabase = useMemo(() => createClient(), [])

  const fetchPlayers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false })

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

  const handleAddPlayer = () => {
    setEditingPlayer(null)
    setShowForm(true)
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setShowForm(true)
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)

      if (error) throw error
      await fetchPlayers()
    } catch (error) {
      console.error('Error deleting player:', error)
      alert('Error deleting player')
    }
  }

  const handleFormSubmit = async () => {
    setShowForm(false)
    await fetchPlayers()
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading players...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Player Management</h1>
            <p className="text-gray-600 mt-2">Manage player profiles and information</p>
          </div>
          <button
            onClick={handleAddPlayer}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Add New Player
          </button>
        </div>

        <PlayerList
          players={players}
          onEdit={handleEditPlayer}
          onDelete={handleDeletePlayer}
        />

        {showForm && (
          <PlayerForm
            player={editingPlayer}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  )
}

