// Player details page: shows a single player profile and achievements.

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params

  // In a real app, fetch player data from Supabase
  const player = {
    id,
    name: 'Alex Johnson',
    position: 'Point Guard',
    team: 'Varsity',
    bio: 'Alex has been playing basketball since age 8 and joined the academy 3 years ago. He excels in playmaking and shooting.',

    stats: {
      points: 18.5,
      assists: 7.2,
      rebounds: 4.1,
    },

    // Store ONLY the YouTube URL
    video: 'https://www.youtube.com/watch?v=exc4351_7h8',
  }

  // Convert normal YouTube link to embed ID
  const getYoutubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/

    const match = url.match(regExp)

    return match ? match[1] : ''
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Player Header */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {player.name}
          </h1>

          <p className="text-xl text-gray-600">
            {player.position} - {player.team}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Bio */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Bio
            </h2>

            <p className="text-gray-600">
              {player.bio}
            </p>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Season Stats
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Points per game:</strong> {player.stats.points}
              </p>

              <p>
                <strong>Assists per game:</strong> {player.stats.assists}
              </p>

              <p>
                <strong>Rebounds per game:</strong> {player.stats.rebounds}
              </p>
            </div>
          </div>
        </div>

        {/* Video Documentary */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Player Highlight Documentary
          </h2>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-[400px]"
              src={`https://www.youtube.com/embed/${getYoutubeId(player.video)}`}
              title="Player Documentary"
              allowFullScreen
            />
          </div>

          {/* Clickable Link */}
          <div className="mt-4">
            <a
              href={player.video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Watch on YouTube
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}