// Public news page: lists academy updates and articles.
import Link from 'next/link'

const news = [
  {
    id: '1',
    title: 'New Coaching Staff Announced',
    excerpt: 'We are excited to welcome our new head coach and expanded coaching team.',
    published_at: '2024-06-01',
    author: 'Academy Staff'
  },
  {
    id: '2',
    title: 'Academy Expansion Plans',
    excerpt: 'New facilities and programs coming this fall.',
    published_at: '2024-05-15',
    author: 'Academy Staff'
  }
]

export default function News() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Updates</h1>
          <p className="text-xl text-gray-600">Stay updated with the latest from Books & Ball Basketball Academy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map(item => (
            <article key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.excerpt}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p>By {item.author}</p>
                <p>{new Date(item.published_at).toLocaleDateString()}</p>
              </div>
              <Link
                href={`/news/${item.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

