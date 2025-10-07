import { loadAllEntities } from '@whisker/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export default async function EntityPage({ params }: PageProps) {
  const { type, id } = await params;
  const entities = await loadAllEntities();
  const entity = entities.get(id);

  if (!entity || entity.type !== type) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="mb-8">
        <Link href="/browse" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Browse
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">{entity.name}</h1>
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
            {entity.type}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
          ID: {entity.id}
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Entity Data</h2>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(entity, null, 2)}
          </pre>
        </div>

        {entity.description && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {entity.description}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export async function generateStaticParams(): Promise<Array<{ type: string; id: string }>> {
  const entities = await loadAllEntities();

  return Array.from(entities.values()).map((entity) => ({
    type: String(entity.type),
    id: String(entity.id),
  }));
}
