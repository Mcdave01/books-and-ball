// About page: presents the academy mission, values, programs, and coaching story.
export default function About() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Books & Ball Basketball Academy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated to developing basketball talent through professional coaching, comprehensive training programs, and a commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To provide world-class basketball training and development opportunities for players of all ages and skill levels,
              fostering growth both on and off the court.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the premier basketball academy in the region, known for producing skilled players,
              strong character, and lifelong love for the game.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Coaches</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-gray-600">Head Coach</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-gray-600">Assistant Coach</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium">Mike Davis</p>
                  <p className="text-gray-600">Skills Development Coach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
