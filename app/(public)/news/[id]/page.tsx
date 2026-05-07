// News details page: renders one full academy article.
interface NewsPageProps {
  params: Promise<{ id: string }>
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = await params

  // In a real app, fetch news data from Supabase
  const article = {
    id,
    title: 'New Coaching Staff Announced',
    content: 'We are thrilled to announce the addition of Coach Johnson as our new head coach. With over 15 years of experience at the collegiate level, Coach Johnson brings a wealth of knowledge and passion for developing young athletes. The coaching staff has also been expanded with specialized coaches for skills development, strength training, and mental performance.',
    published_at: '2024-06-01',
    author: 'Academy Staff'
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="text-gray-600">
              <p>By {article.author}</p>
              <p>{new Date(article.published_at).toLocaleDateString()}</p>
            </div>
          </header>

          <div className="prose max-w-none">
            <p>{article.content}</p>
          </div>
        </article>
      </div>
    </div>
  )
}
