export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-500">Yombal</div>
          <div className="flex gap-4">
            <a href="/login" className="text-gray-700 hover:text-orange-500">
              Login
            </a>
            <a href="/signup" className="bg-orange-500 text-white px-4 py-2 rounded">
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Buy & Sell Locally in Senegal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing deals from neighbors near you
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <button className="bg-orange-500 text-white px-6 py-3 rounded text-lg hover:bg-orange-600">
            Start Selling
          </button>
          <a href="#listings" className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded text-lg hover:bg-orange-50">
            Browse Listings
          </a>
        </div>
        <div className="flex gap-2 justify-center mb-8">
          <input
            type="text"
            placeholder="Search listings..."
            data-testid="search-input"
            className="px-4 py-2 border rounded-l w-64"
          />
          <button className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600">
            Search
          </button>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Create Account', desc: 'Sign up in seconds' },
              { icon: '📸', title: 'List Items', desc: 'Add photos and details' },
              { icon: '💬', title: 'Connect', desc: 'Chat with buyers/sellers' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 Yombal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
