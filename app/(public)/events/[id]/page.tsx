// Event details page: displays one event and its registration call to action.
interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params

  // In a real app, fetch event data from Supabase
  const event = {
    id,
    title: 'Summer Training Camp',
    description: 'Intensive training for all skill levels. This camp is designed to improve your basketball skills through professional coaching and competitive drills.',
    date: '2024-07-15',
    type: 'camp',
    location: 'Main Court',
    details: 'The camp runs from 9 AM to 5 PM daily, including lunch and breaks. Equipment is provided.'
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <div className="text-gray-600 space-y-2">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Type:</strong> {event.type}</p>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{event.description}</p>
          <p>{event.details}</p>
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Register for Event
        </button>
      </div>
    </div>
  )
}
