import { loadAllEntities } from '@whisker/data';

export default async function Home() {
  const entities = await loadAllEntities();

  const stats = {
    total: entities.size,
    byType: {} as Record<string, number>,
  };

  entities.forEach((entity) => {
    const type = entity.type;
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });

  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">The Whisker Shogunate</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          World Building Knowledge Base
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Progress Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Entities
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(stats.byType).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Entity Types
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                85%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Migration Complete
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Entities by Type</h3>
            <div className="space-y-2">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize">{type}</span>
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Browse Entities</h3>
              <p className="text-blue-100">
                Explore all {stats.total} entities in the knowledge base
              </p>
            </a>

            <a
              href="/stats"
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg transition-colors"
            >
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-purple-100">
                View detailed progress metrics and charts
              </p>
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>The Whisker Shogunate · World Building Knowledge Base</p>
      </footer>
    </div>
  );
}
