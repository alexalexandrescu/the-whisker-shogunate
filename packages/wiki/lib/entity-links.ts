/**
 * Utility functions for parsing and linking entity references
 */

export interface EntityReference {
  id: string;
  type: string;
  field: string;
}

/**
 * Extract all entity references from an entity object
 */
export function extractEntityReferences(entity: any): EntityReference[] {
  const references: EntityReference[] = [];
  const entityIdPattern = /^(location|character|profession|faction|culture|food|concept|material|event)_[a-z0-9_-]+$/;

  function traverse(obj: any, path: string = '') {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'string' && entityIdPattern.test(value)) {
        const type = value.split('_')[0];
        references.push({
          id: value,
          type,
          field: currentPath
        });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'string' && entityIdPattern.test(item)) {
            const type = item.split('_')[0];
            references.push({
              id: item,
              type,
              field: `${currentPath}[${index}]`
            });
          } else if (typeof item === 'object') {
            traverse(item, `${currentPath}[${index}]`);
          }
        });
      } else if (typeof value === 'object') {
        traverse(value, currentPath);
      }
    }
  }

  traverse(entity);
  return references;
}

/**
 * Get human-readable name for entity type
 */
export function getEntityTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    location: 'Location',
    character: 'Character',
    profession: 'Profession',
    faction: 'Faction',
    culture: 'Culture',
    food: 'Food',
    concept: 'Concept',
    material: 'Material',
    event: 'Event'
  };
  return typeNames[type] || type;
}

/**
 * Parse text and convert entity IDs to markdown links
 */
export function parseEntityLinks(text: string): string {
  const entityIdPattern = /(location|character|profession|faction|culture|food|concept|material|event)_[a-z0-9_-]+/g;

  return text.replace(entityIdPattern, (match) => {
    const type = match.split('_')[0];
    return `[${match}](/entity/${type}/${match})`;
  });
}

/**
 * Build a graph data structure from all entities
 */
export interface GraphNode {
  id: string;
  name: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildEntityGraph(entities: Map<string, any>): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const addedEdges = new Set<string>();

  // Create nodes for all entities
  entities.forEach((entity) => {
    nodes.push({
      id: entity.id,
      name: entity.name || entity.id,
      type: entity.type
    });
  });

  // Create edges from entity references
  entities.forEach((entity) => {
    const references = extractEntityReferences(entity);

    references.forEach((ref) => {
      const edgeKey = `${entity.id}->${ref.id}`;
      const reverseKey = `${ref.id}->${entity.id}`;

      // Avoid duplicate edges
      if (!addedEdges.has(edgeKey) && !addedEdges.has(reverseKey)) {
        edges.push({
          source: entity.id,
          target: ref.id
        });
        addedEdges.add(edgeKey);
      }
    });
  });

  return { nodes, edges };
}
