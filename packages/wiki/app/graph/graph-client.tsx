'use client';

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import Link from 'next/link';

interface EntityNode {
  id: string;
  name: string;
  type: string;
}

interface EntityEdge {
  source: string;
  target: string;
}

interface GraphClientProps {
  nodes: EntityNode[];
  edges: EntityEdge[];
}

const nodeWidth = 180;
const nodeHeight = 50;

function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to bottom
    ranksep: 100, // Vertical spacing between ranks
    nodesep: 50, // Horizontal spacing between nodes
    edgesep: 20,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export default function GraphClient({ nodes: entityNodes, edges: entityEdges }: GraphClientProps) {
  // Color mapping for different entity types
  const typeColors: Record<string, string> = {
    location: '#3b82f6', // blue
    character: '#8b5cf6', // purple
    faction: '#ef4444', // red
    profession: '#10b981', // green
    culture: '#f59e0b', // amber
    food: '#ec4899', // pink
    concept: '#6b7280', // gray
    material: '#06b6d4', // cyan
    event: '#f97316', // orange
  };

  // Convert to ReactFlow format
  const flowNodes: Node[] = entityNodes.map((node) => ({
    id: node.id,
    type: 'default',
    data: {
      label: (
        <Link
          href={`/entity/${node.type}/${node.id}`}
          className="text-xs font-medium hover:underline"
        >
          {node.name}
        </Link>
      ),
    },
    position: { x: 0, y: 0 }, // Will be set by dagre
    style: {
      background: typeColors[node.type] || '#6b7280',
      color: 'white',
      border: '2px solid white',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
      width: nodeWidth,
      height: nodeHeight,
    },
  }));

  const flowEdges: Edge[] = entityEdges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: false,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#94a3b8',
    },
  }));

  // Apply hierarchical layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(flowNodes, flowEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Entity Relationship Graph</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {entityNodes.length} entities, {entityEdges.length} relationships
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span>Character</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Faction</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Profession</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: 'calc(100vh - 120px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const style = node.style as any;
              return style?.background || '#6b7280';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
