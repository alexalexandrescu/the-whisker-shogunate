import { loadAllEntities } from '@whisker/data';
import Link from 'next/link';

export default async function BrowsePage() {
  const entities = await loadAllEntities();
  const entitiesArray = Array.from(entities.values());

  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-2">Browse Entities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {entities.size} entities in the knowledge base
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {entitiesArray.map((entity) => (
                <tr
                  key={entity.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/entity/${entity.type}/${entity.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {entity.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                      {entity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {entity.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
