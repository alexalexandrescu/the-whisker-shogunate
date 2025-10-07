import { loadAllEntities } from '@whisker/data';
import { buildEntityGraph } from '@/lib/entity-links';
import GraphClient from './graph-client';

export default async function GraphPage() {
  const entities = await loadAllEntities();
  const graphData = buildEntityGraph(entities);

  return <GraphClient nodes={graphData.nodes} edges={graphData.edges} />;
}
