'use client'

// Public events page: lists upcoming academy events and programs.

import { useState } from 'react'
import Link from 'next/link'

const events = [
  {
    id: '1',
    title: 'Summer Training Camp',
    description: 'Intensive training for all skill levels',
    date: '2024-07-15',
    type: 'camp',
    location: 'Main Court'
  },
  {
    id: '2',
    title: 'Tournament Tryouts',
    description: 'Join our competitive teams',
    date: '2024-08-05',
    type: 'tryout',
    location: 'Gym A'
  },
  {
    id: '3',
    title: 'Weekly Training Session',
    description: 'Regular training for registered players',
    date: '2024-06-15',
    type: 'training',
    location: 'Main Court'
  }
]

const eventTypes = ['all', 'training', 'tournament', 'camp', 'tryout']

export default function Events() {
  const [filter, setFilter] = useState('all')

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter)

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-xl text-gray-600">Join our training sessions, camps, and tournaments</p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                <p>Type: {event.type}</p>
              </div>
              <Link
                href={`/events/${event.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
