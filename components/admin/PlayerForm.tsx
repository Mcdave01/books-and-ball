'use client'

// Player form: creates and edits player profile records.

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const playerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().optional(),
  grade: z.string().optional(),
  position: z.enum(['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  school: z.string().optional(),
  player_video_documentary: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  medical_conditions: z.string().optional(),
  achievements: z.string().optional(),
  jersey_number: z.number().optional(),
  status: z.enum(['active', 'inactive', 'graduated']).default('active'),
  notes: z.string().optional(),
})

type PlayerFormData = z.input<typeof playerSchema>
type PlayerPosition = NonNullable<PlayerFormData['position']>
type PlayerStatus = NonNullable<PlayerFormData['status']>

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
  medical_conditions: string
  achievements: string
  profile_image_url: string
  jersey_number: number
  status: string
  notes: string
}

interface PlayerFormProps {
  player?: Player | null
  onClose: () => void
  onSubmit: () => void
}

export function  PlayerForm({ player, onClose, onSubmit }: PlayerFormProps) {
  const [loading, setLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: player ? {
      first_name: player.first_name,
      last_name: player.last_name,
      date_of_birth: player.date_of_birth,
      grade: player.grade,
      position: player.position as PlayerPosition,
      height: player.height,
      weight: player.weight,
      school: player.school,
      player_video_documentary: player.player_video_documentary,
      contact_email: player.contact_email,
      contact_phone: player.contact_phone,
      emergency_contact_name: player.emergency_contact_name,
      medical_conditions: player.medical_conditions,
      achievements: player.achievements,
      jersey_number: player.jersey_number,
      status: player.status as PlayerStatus,
      notes: player.notes,
    } : {
      status: 'active',
    },
  })

 const onFormSubmit = async (data: PlayerFormData) => {
  setLoading(true)

  try {
    let imageUrl = player?.profile_image_url || ''

    // ✅ Upload image if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('player-images')
        .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase
        .storage
        .from('player-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    // ✅ Prepare player data
    const playerData = {
      ...data,
      profile_image_url: imageUrl,
      contact_email: data.contact_email || null,
      jersey_number: data.jersey_number || null,
    }

    if (player) {
      // ✅ Update player
      const { error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', player.id)
   supabase.storage.from('player-images')

      if (error) throw error
    } else {
      // ✅ Insert player
      const { error } = await supabase
        .from('players')
        .insert(playerData)
        .select()

      if (error) throw error
    }

    alert('Player saved successfully!')
    onSubmit()

  }  catch (error: any) {
  console.error('FULL ERROR:', error)
  console.error('MESSAGE:', error?.message)
  console.error('DETAILS:', error?.details)
  console.error('HINT:', error?.hint)

  alert(error?.message || 'Error saving player')
}
   finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {player ? 'Edit Player' : 'Add New Player'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  {...register('first_name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  {...register('last_name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  {...register('date_of_birth')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  {...register('grade')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  {...register('position')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Position</option>
                  <option value="Point Guard">Point Guard</option>
                  <option value="Shooting Guard">Shooting Guard</option>
                  <option value="Small Forward">Small Forward</option>
                  <option value="Power Forward">Power Forward</option>
                  <option value="Center">Center</option>
                </select>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input
                  {...register('height')}
                  type="text"
                  placeholder="e.g., 6'2&quot;"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  {...register('weight')}
                  type="text"
                  placeholder="e.g., 180 lbs"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jersey Number
                </label>
                <input
                  {...register('jersey_number', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            {/* Player Video Documentary */}

            <div className='grid grid-cols-1 md:grid-col-2 gap-6'>

                 <div>
              <label className="block text-sm font-medium mb-1">
                Player Documentary
              </label>
              <input
              {...register('player_video_documentary')}
              type="text" 
              placeholder='https://youtube.com/watch?v=xxxx'
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              />
            </div>

            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <input
                  {...register('school')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  {...register('contact_email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.contact_email && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  {...register('contact_phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  {...register('emergency_contact_name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  {...register('emergency_contact_phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  {...register('medical_conditions')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Any medical conditions, allergies, or special needs..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements
                </label>
                <textarea
                  {...register('achievements')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Awards, honors, notable performances..."
                />
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Profile Image
                </label>
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
  className="w-full border border-gray-300 rounded-full p-2"
/>

{imageFile && (
  <img 
    src={URL.createObjectURL(imageFile)} 
    className="w-24 h-24 rounded-full mt-2 object-cover"
  />
)}
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Additional notes or observations..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (player ? 'Update Player' : 'Add Player')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

